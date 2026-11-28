import test from 'node:test';
import assert from 'node:assert/strict';
import { adaptarHu4 } from '../services/adaptador.js';
import { puedeRevisar } from '../services/revisionService.js';
import { progresoTrabajo } from '../utils/progreso.js';

const asesor = { id: 'u-101', rol: 'asesor' };
const estudiante = { id: 'u-001', rol: 'estudiante' };

function datosApi() {
  return {
    trabajos: [{
      id: 't-1',
      codigo: 'TFC-1',
      titulo: 'Trabajo de prueba',
      estado: 'en_desarrollo',
      integrantes: ['u-001', 'u-002'],
      equipo: [
        { usuarioId: 'u-001', nombre: 'Rosa Quispe', responsable: true },
        { usuarioId: 'u-002', nombre: 'Diego Ramirez', responsable: false },
      ],
      responsableId: 'u-001',
      asesor: { usuarioId: 'u-101', nombre: 'Mariela Quispe' },
    }],
    entregables: [
      { id: 'e-1', trabajoCodigo: 'TFC-1', orden: 1, nombre: 'Plan', peso: 30, obligatorio: true, fechaLimite: '2026-09-01' },
      { id: 'e-2', trabajoCodigo: 'TFC-1', orden: 2, nombre: 'Marco teorico', peso: 70, obligatorio: true, fechaLimite: '2026-10-01' },
      { id: 'e-3', trabajoCodigo: 'TFC-1', orden: 3, nombre: 'Anexos', peso: 10, obligatorio: false, fechaLimite: '2026-10-15' },
    ],
    avances: [
      { id: 'av-1', entregableId: 'e-1', version: 1, fecha: '2026-08-28', estado: 'observado',
        revision: { fecha: '2026-08-30', comentario: 'Corrige la muestra.', revisor: 'Mariela Quispe' }, comentarios: [] },
      { id: 'av-2', entregableId: 'e-1', version: 2, fecha: '2026-09-01', estado: 'aprobado', revision: null, comentarios: [] },
      { id: 'av-3', entregableId: 'e-2', version: 1, fecha: '2026-09-29', estado: 'en_revision', revision: null, comentarios: [] },
      { id: 'av-4', entregableId: 'e-3', version: 1, fecha: '2026-10-10', estado: 'aprobado', revision: null, comentarios: [] },
    ],
  };
}

test('adaptarHu4 conserva equipo y convierte integrantes a ids', () => {
  const { trabajos } = adaptarHu4(datosApi());
  assert.deepEqual(trabajos[0].integrantes, ['u-001', 'u-002']);
  assert.equal(trabajos[0].equipo.length, 2);
  assert.equal(trabajos[0].equipo[0].nombre, 'Rosa Quispe');
  assert.equal(trabajos[0].responsableId, 'u-001');
});

test('adaptarHu4 agrega la revision del asesor como primer comentario', () => {
  const { avances } = adaptarHu4(datosApi());
  const observado = avances.find((a) => a.id === 'av-1');
  assert.equal(observado.comentarios.length, 1);
  assert.equal(observado.comentarios[0].id, 'origen-av-1');
  assert.equal(observado.comentarios[0].rol, 'asesor');
  assert.equal(observado.comentarios[0].autorId, 'u-101');
  assert.equal(avances.find((a) => a.id === 'av-2').comentarios.length, 0);
});

test('adaptarHu4 rechaza datos incompletos o inconsistentes', () => {
  assert.throws(() => adaptarHu4(null));
  assert.throws(() => adaptarHu4({ trabajos: [], entregables: [] }));
  const sinTrabajo = datosApi();
  sinTrabajo.entregables[0].trabajoCodigo = 'TFC-inexistente';
  assert.throws(() => adaptarHu4(sinTrabajo));
  const estadoInvalido = datosApi();
  estadoInvalido.avances[0].estado = 'otro';
  assert.throws(() => adaptarHu4(estadoInvalido));
});

test('puedeRevisar solo permite al asesor del trabajo revisar la ultima version en revision', () => {
  const datos = adaptarHu4(datosApi());
  assert.equal(puedeRevisar(datos, asesor, 'av-3'), true);
  assert.equal(puedeRevisar(datos, asesor, 'av-1'), false);
  assert.equal(puedeRevisar(datos, estudiante, 'av-3'), false);
  assert.equal(puedeRevisar(datos, { id: 'u-102', rol: 'asesor' }, 'av-3'), false);
  assert.equal(puedeRevisar(datos, asesor, 'av-inexistente'), false);
});

test('puedeRevisar rechaza versiones antiguas y trabajos concluidos', () => {
  const antigua = adaptarHu4(datosApi());
  antigua.avances.find((a) => a.id === 'av-1').estado = 'en_revision';
  assert.equal(puedeRevisar(antigua, asesor, 'av-1'), false);
  const concluido = adaptarHu4(datosApi());
  concluido.trabajos[0].estado = 'concluido';
  assert.equal(puedeRevisar(concluido, asesor, 'av-3'), false);
});

test('progresoTrabajo suma el peso de los obligatorios aprobados segun la ultima version', () => {
  const datos = adaptarHu4(datosApi());
  assert.deepEqual(progresoTrabajo(datos, 'TFC-1'), { porcentaje: 30, aprobados: 2, total: 3 });
  datos.avances.find((a) => a.id === 'av-3').estado = 'aprobado';
  assert.equal(progresoTrabajo(datos, 'TFC-1').porcentaje, 100);
  assert.equal(progresoTrabajo(datos, 'TFC-sin-entregables').porcentaje, 0);
});

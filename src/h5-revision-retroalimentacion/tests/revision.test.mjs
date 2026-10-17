import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRepositorio, PREFIJO_EVENTO } from '../services/revisionRepository.js';
import { adaptarHu4, enlaceSeguro } from '../services/adaptador.js';
import { datosDemo } from '../data/avances.js';
import { puedeVerTrabajo, aplicarEventos, puedeRevisar } from '../services/revisionService.js';
import { progresoTrabajo } from '../utils/progreso.js';

const asesor = { id: 'u-101', rol: 'asesor', nombres: 'Mariela', apellidos: 'Quispe Ramos' };
const estudiante = { id: 'u-001', rol: 'estudiante', nombres: 'Rosa Elena', apellidos: 'Quispe Mendoza' };
const observacion = 'Corrige la justificación de la muestra y describe la validación por carrera.';
class Almacen {
  datos = new Map();
  get length() { return this.datos.size; }
  key(i) { return [...this.datos.keys()][i] ?? null; }
  getItem(k) { return this.datos.get(k) ?? null; }
  setItem(k, v) { this.datos.set(k, String(v)); }
}
function escenario() {
  const almacen = new Almacen();
  const ventanaAsesor = new EventTarget();
  const ventanaEstudiante = new EventTarget();
  return { almacen, ventanaAsesor, ventanaEstudiante,
    a: crearRepositorio(almacen, ventanaAsesor), e: crearRepositorio(almacen, ventanaEstudiante) };
}
test('asesor observa, estudiante responde, asesor lee; todo persiste al crear repositorio nuevo', () => {
  const { almacen, a, e } = escenario();
  const comentario = a.ejecutar(asesor, { tipo: 'observado', avanceId: 'av-06', texto: observacion });
  assert.equal(e.leer().datos.avances.find((v) => v.id === 'av-06').estado, 'observado');
  e.ejecutar(estudiante, { tipo: 'respuesta', avanceId: 'av-06', texto: 'Revisaré los criterios indicados.', respuestaA: comentario.id });
  assert.equal(a.leer().datos.avances.find((v) => v.id === 'av-06').comentarios.at(-1).rol, 'estudiante');
  const recarga = crearRepositorio(almacen, new EventTarget());
  assert.deepEqual(recarga.leer().datos, a.leer().datos);
  assert.equal(progresoTrabajo(recarga.leer().datos, 'TFC-2026-2-047').porcentaje, 35);
});
test('comentarios independientes no resuelven el avance; pestañas con lecturas antiguas no pierden mensajes', () => {
  const { a, e } = escenario();
  e.leer();
  const c = a.ejecutar(asesor, { tipo: 'comentario', avanceId: 'av-06', texto: 'Aclara la técnica de validación.' });
  e.ejecutar(estudiante, { tipo: 'respuesta', avanceId: 'av-06', texto: 'Usamos validación cruzada.', respuestaA: c.id });
  a.ejecutar(asesor, { tipo: 'comentario', avanceId: 'av-06', texto: 'Incluye las métricas.' });
  const avance = e.leer().datos.avances.find((v) => v.id === 'av-06');
  assert.equal(avance.comentarios.length, 3);
  assert.equal(avance.estado, 'en_revision');
});
test('aprobación suma 20 puntos una sola vez y conserva versiones anteriores', () => {
  const { a } = escenario();
  const antes = a.leer().datos.avances.filter((v) => v.id !== 'av-06');
  a.ejecutar(asesor, { tipo: 'aprobado', avanceId: 'av-06', texto: 'Metodología aprobada.' });
  assert.equal(progresoTrabajo(a.leer().datos, 'TFC-2026-2-047').porcentaje, 55);
  assert.deepEqual(a.leer().datos.avances.filter((v) => v.id !== 'av-06'), antes);
  assert.throws(() => a.ejecutar(asesor, { tipo: 'aprobado', avanceId: 'av-06' }));
  assert.throws(() => a.ejecutar(asesor, { tipo: 'observado', avanceId: 'av-06', texto: observacion }));
});
test('permisos por rol y relación; no basta conocer el identificador del avance', () => {
  const { a } = escenario();
  for (const u of [estudiante, { ...asesor, id: 'u-102' }, { ...asesor, rol: 'coordinador' }]) {
    assert.throws(() => a.ejecutar(u, { tipo: 'aprobado', avanceId: 'av-06' }));
  }
  assert.throws(() => a.ejecutar({ ...estudiante, id: 'u-004' }, { tipo: 'respuesta', avanceId: 'av-05', texto: 'Respuesta', respuestaA: 'origen-av-05' }));
  const trabajo = a.leer().datos.trabajos[0];
  assert.equal(puedeVerTrabajo(estudiante, trabajo), true);
  assert.equal(puedeVerTrabajo({ ...estudiante, id: 'u-002' }, trabajo), true);
  assert.equal(puedeVerTrabajo({ ...estudiante, id: 'u-004' }, trabajo), false);
  assert.equal(puedeVerTrabajo({ ...asesor, rol: 'coordinador' }, trabajo), false);
});
test('validaciones de comentarios y respuestas', () => {
  const { a } = escenario();
  for (const texto of ['', 'x', 'x'.repeat(29), 'x'.repeat(801)]) assert.throws(() => a.ejecutar(asesor, { tipo: 'observado', avanceId: 'av-06', texto }));
  assert.throws(() => a.ejecutar(estudiante, { tipo: 'respuesta', avanceId: 'av-06', texto: 'Respuesta', respuestaA: 'no-existe' }));
  assert.throws(() => a.ejecutar(estudiante, { tipo: 'comentario', avanceId: 'av-06', texto: 'Comentario' }));
});
test('solo última versión pendiente; proyección resuelve decisiones concurrentes sin duplicación', () => {
  const base = adaptarHu4(datosDemo);
  base.avances.find((a) => a.id === 'av-05').estado = 'en_revision';
  assert.equal(puedeRevisar(base, asesor, 'av-05'), false);
  const eventos = ['aprobado', 'observado'].map((tipo, i) => ({ id: String(i), tipo, avanceId: 'av-06', texto: observacion, fecha: `2026-10-13T12:00:0${i}Z`, rol: 'asesor' }));
  const datos = aplicarEventos(base, eventos);
  assert.equal(datos.avances.find((a) => a.id === 'av-06').estado, 'aprobado');
  assert.equal(progresoTrabajo(datos, 'TFC-2026-2-047').porcentaje, 55);
});
test('suscripción al storage y limpieza de listeners; snapshot estable', () => {
  const { a, ventanaAsesor } = escenario();
  assert.equal(a.leer(), a.leer());
  let cambios = 0;
  const limpiar = a.suscribir(() => cambios++);
  const evento = new Event('storage');
  Object.defineProperty(evento, 'key', { value: PREFIJO_EVENTO + 'otra-pestana' });
  ventanaAsesor.dispatchEvent(evento);
  assert.equal(cambios, 1);
  limpiar(); ventanaAsesor.dispatchEvent(evento);
  assert.equal(cambios, 1);
});
test('adaptador lee HU-4 sin escribir sus datos; detecta corrupción sin sobrescribir', () => {
  const { almacen, a } = escenario();
  const origen = JSON.stringify(datosDemo);
  almacen.setItem('tfc.hu4', origen);
  a.ejecutar(asesor, { tipo: 'comentario', avanceId: 'av-06', texto: 'Comentario desde HU-5.' });
  assert.equal(almacen.getItem('tfc.hu4'), origen);
  almacen.setItem('tfc.hu4', 'corrupto');
  assert.ok(a.leer().error);
  assert.equal(a.leer(), a.leer());
  assert.throws(() => a.ejecutar(asesor, { tipo: 'comentario', avanceId: 'av-06', texto: 'Intento' }));
  assert.equal(almacen.getItem('tfc.hu4'), 'corrupto');
});
test('URL de documento solo http/https; progreso ponderado, no conteo de versiones', () => {
  assert.equal(enlaceSeguro('javascript:alert(1)'), null);
  assert.equal(enlaceSeguro('https://example.edu/avance'), 'https://example.edu/avance');
  const datos = adaptarHu4(datosDemo);
  assert.equal(progresoTrabajo(datos, 'TFC-2026-2-012').porcentaje, 100);
  assert.equal(progresoTrabajo(datos, 'TFC-2026-2-047').porcentaje, 35);
});
test('catálogo con relaciones incompletas muestra error y no produce filas inválidas', () => {
  const { almacen, a } = escenario();
  const datos = structuredClone(datosDemo);
  datos.avances[0].entregableId = 'entregable-inexistente';
  almacen.setItem('tfc.hu4', JSON.stringify(datos));
  assert.ok(a.leer().error);
  assert.equal(a.leer().datos.avances.length, 0);
});
test('error de cuota no informa éxito ni altera el avance', () => {
  const { almacen, a } = escenario();
  const setItem = almacen.setItem.bind(almacen);
  almacen.setItem = (k, v) => { if (k.startsWith(PREFIJO_EVENTO)) throw new Error('QuotaExceeded'); setItem(k, v); };
  assert.throws(() => a.ejecutar(asesor, { tipo: 'aprobado', avanceId: 'av-06' }), /No se pudo guardar/);
  assert.equal(a.leer().datos.avances.find((v) => v.id === 'av-06').estado, 'en_revision');
});

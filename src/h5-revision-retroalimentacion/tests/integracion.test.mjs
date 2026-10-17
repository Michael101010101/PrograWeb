import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRepositorio } from '../services/revisionRepository.js';
import { cargarDatos, guardarDatos, registrarAvance, detallePlan } from '../../hu4-entregables/services/entregablesService.js';
import { DATOS_SEMILLA } from '../../hu4-entregables/data/datosSemilla.js';

class Almacen {
  datos = new Map();
  get length() { return this.datos.size; }
  key(i) { return [...this.datos.keys()][i] ?? null; }
  getItem(k) { return this.datos.get(k) ?? null; }
  setItem(k, v) { this.datos.set(k, String(v)); }
}

test('HU4 → revisión → Mi trabajo: observación, nueva versión y aprobación habilitan el siguiente entregable', () => {
  const almacen = new Almacen();
  const ventana = new EventTarget();
  globalThis.localStorage = almacen;
  globalThis.window = ventana;
  try {
    guardarDatos(structuredClone(DATOS_SEMILLA));
    const repo = crearRepositorio(almacen, ventana);
    const codigo = 'TFC-2026-2-047';
    const asesor = { id: 'u-101', rol: 'asesor', nombres: 'Mariela', apellidos: 'Quispe' };
    const inicial = detallePlan(cargarDatos(), codigo);
    const siguiente = inicial.items.find((e) => e.puedeRegistrar);
    assert.ok(siguiente);
    guardarDatos(registrarAvance(cargarDatos(), siguiente.id, { enlace: 'https://example.com/v1', descripcion: 'Resultados de la investigación inicial.' }));
    let version = repo.leer().datos.avances.filter((a) => a.entregableId === siguiente.id).at(-1);
    assert.equal(version.estado, 'en_revision');
    repo.ejecutar(asesor, { tipo: 'observado', avanceId: version.id, texto: 'Amplía el análisis de resultados y justifica las conclusiones con evidencia.' });
    assert.equal(detallePlan(cargarDatos(), codigo).items.find((e) => e.id === siguiente.id).puedeRegistrar, true);
    const segunda = registrarAvance(cargarDatos(), siguiente.id, { enlace: 'https://example.com/v2', descripcion: 'Resultados corregidos con evidencia adicional.' });
    // Guardado del hook: mantener versiones originales y eventos separados.
    const originales = JSON.parse(almacen.getItem('tfc.entregables')).avances;
    segunda.avances = segunda.avances.map((a) => originales.find((o) => o.id === a.id) ?? a);
    const nuevaId = segunda.avances.at(-1).id;
    guardarDatos(segunda);
    version = repo.leer().datos.avances.find((a) => a.id === nuevaId);
    assert.equal(version.version, 2);
    repo.ejecutar(asesor, { tipo: 'aprobado', avanceId: version.id, texto: 'Resultados conformes.' });
    const final = detallePlan(cargarDatos(), codigo);
    assert.equal(final.avance.porcentaje, inicial.avance.porcentaje + siguiente.peso);
    assert.equal(final.items.find((e) => e.orden === siguiente.orden + 1).bloqueado, false);
    assert.equal(repo.leer().datos.avances.find((a) => a.id === version.id).estado, 'aprobado');
  } finally {
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});

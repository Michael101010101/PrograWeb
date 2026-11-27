import { api } from '../../shared/api.js';

// Capa de servicios de la HU-4 en el front. Antes guardaba todo en localStorage;
// ahora cada función hace una petición a la API (server/src/routes/entregables y planes).
// Las reglas y validaciones viven en el servidor (entregables.service.js): si algo no es válido,
// la API responde un error y api() lo lanza como ServiceError con el mensaje para mostrar.
// Cada acción responde { plan, mensaje } con el plan ya actualizado.

// Límites que muestra el formulario ("Entre 5 y 40"). Son los mismos que valida el servidor.
export const PESO_MIN = 5;
export const PESO_MAX = 40;
export const DIAS_ALERTA = 14; // "Próximos a vencer · siguientes 14 días"

// ─────────── Estudiante ───────────

/** Plan del trabajo del estudiante que inició sesión: { trabajo, items, suma, avance, alertas, … } */
export function obtenerMiPlan() {
  return api('/entregables/mi-plan');
}

export function registrarAvance(entregableId, { enlace, descripcion }) {
  return api(`/entregables/${entregableId}/avances`, { method: 'POST', body: { enlace, descripcion } });
}

export function solicitarAmpliacion(entregableId, { nuevaFecha, motivo }) {
  return api(`/entregables/${entregableId}/ampliaciones`, { method: 'POST', body: { nuevaFecha, motivo } });
}

// ─────────── Asesor ───────────

/**
 * Plan de un trabajo para su asesor. Acepta el id ('t-047') o el código ('TFC-2026-2-047'),
 * porque el enlace de la HU-3 (Detalle del asesorado) usa el código en la URL.
 */
export async function obtenerPlan(trabajoIdOCodigo) {
  let trabajoId = trabajoIdOCodigo;
  if (trabajoIdOCodigo.startsWith('TFC-')) {
    const { planes } = await api('/planes'); // trabajos que asesora el usuario
    trabajoId = planes.find((p) => p.trabajo.codigo === trabajoIdOCodigo)?.trabajo.id ?? trabajoIdOCodigo;
  }
  return api(`/planes/${encodeURIComponent(trabajoId)}`);
}

/** Crea (entregableId = null) o edita un entregable del plan. */
export function guardarEntregable(trabajoId, formulario, entregableId = null) {
  const ruta = `/planes/${encodeURIComponent(trabajoId)}/entregables`;
  const body = { ...formulario, peso: Number(formulario.peso) };
  return entregableId
    ? api(`${ruta}/${entregableId}`, { method: 'PUT', body })
    : api(ruta, { method: 'POST', body });
}

export function eliminarEntregable(trabajoId, entregableId) {
  return api(`/planes/${encodeURIComponent(trabajoId)}/entregables/${entregableId}`, { method: 'DELETE' });
}

export function aplicarPlantilla(trabajoId) {
  return api(`/planes/${encodeURIComponent(trabajoId)}/plantilla`, { method: 'POST' });
}

export function responderAmpliacion(trabajoId, ampliacionId, aceptar) {
  return api(`/planes/${encodeURIComponent(trabajoId)}/ampliaciones/${ampliacionId}`, { method: 'PATCH', body: { aceptar } });
}

// ─────────── Cálculo local (solo para la vista previa) ───────────

/**
 * Suma de pesos si se guarda el formulario, sin contar el entregable que se edita.
 * La pantalla 4.2 la usa para la barra "en vivo" y para abrir el modal de pesos;
 * el servidor vuelve a hacer la misma cuenta al guardar.
 */
export function simularSuma(items, { peso, obligatorio }, excluirId = null) {
  const resto = items.filter((e) => e.obligatorio && e.id !== excluirId).reduce((suma, e) => suma + e.peso, 0);
  const suma = resto + (obligatorio ? Number(peso) || 0 : 0);
  return { suma, exceso: Math.max(0, suma - 100) };
}

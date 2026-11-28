import { api } from '../../shared/api.js';

// Servicio de la HU-3 en el front: cada función es una petición a la API (server/, rutas /api/asesores y /api/solicitudes).
// Las reglas y validaciones viven en el servidor; si algo no es válido, api() lanza un ServiceError
// con el mensaje del servidor (400, 404, 409…) y la página o el modal lo muestran.

/** Arma la query string sin los filtros vacíos: { linea: 'X', texto: '' } → "?linea=X" */
function query(parametros) {
  const q = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== '' && valor !== null && valor !== undefined && valor !== false) q.set(clave, String(valor));
  });
  const texto = q.toString();
  return texto ? `?${texto}` : '';
}

/* ─────────── Directorio (público) ─────────── */

/** { asesores, total, pagina, porPagina, totalPaginas, totalAsesores, conCupo } */
export function listarAsesores({ texto, linea, departamento, soloConCupo }, orden, pagina, porPagina) {
  return api(`/asesores${query({ texto, linea, departamento, soloConCupo, orden, pagina, porPagina })}`);
}

/** Los 3 asesores con más cupo (página de inicio y ficha de propuesta). */
export async function obtenerDestacados() {
  const { asesores } = await api('/asesores/destacados');
  return asesores;
}

/** Otros asesores de la misma línea con cupo: { linea, asesores } */
export function obtenerAlternativas(asesorId, linea) {
  return api(`/asesores/${encodeURIComponent(asesorId)}/alternativas${query({ linea })}`);
}

/* ─────────── Estudiante ─────────── */

/** "Mi solicitud": { trabajo, solicitud, asesor, termino } */
export function obtenerMiSolicitud() {
  return api('/solicitudes/mia');
}

export function solicitarAsesoria(asesorId, mensaje) {
  return api('/solicitudes', { method: 'POST', body: { asesorId, mensaje } });
}

export function retirarSolicitud(solicitudId) {
  return api(`/solicitudes/${encodeURIComponent(solicitudId)}/retirar`, { method: 'PATCH' });
}

/* ─────────── Asesor ─────────── */

/** { asesor, resumen: { trabajosACargo, solicitudesPendientes, avancesPorRevisar, planesSinDefinir } } */
export function obtenerMiFicha() {
  return api('/asesores/me');
}

export function guardarFicha(ficha) {
  return api('/asesores/me', { method: 'PUT', body: ficha });
}

/** { solicitudes, pendientes, resueltas, cupoDisponible, cupoMaximo } */
export function obtenerBandeja() {
  return api('/asesores/me/solicitudes');
}

export function aceptarSolicitud(solicitudId) {
  return api(`/solicitudes/${encodeURIComponent(solicitudId)}/aceptar`, { method: 'PATCH' });
}

export function rechazarSolicitud(solicitudId, motivo) {
  return api(`/solicitudes/${encodeURIComponent(solicitudId)}/rechazar`, { method: 'PATCH', body: { motivo } });
}

/** { trabajos, avancesPorRevisar, vencimientos } */
export function obtenerAsesorados() {
  return api('/asesores/me/asesorados');
}

/** { trabajo, vencimientos } */
export function obtenerAsesorado(codigo) {
  return api(`/asesores/me/asesorados/${encodeURIComponent(codigo)}`);
}

export function terminarAsesoria(codigo, motivo) {
  return api(`/asesores/me/asesorados/${encodeURIComponent(codigo)}/terminar`, { method: 'POST', body: { motivo } });
}

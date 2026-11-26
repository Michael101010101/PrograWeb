import { api } from '../../shared/api.js';

// HU-7 · Cliente del API de coordinación (/api/admin). Usa el cliente común (JWT y ServiceError).
// Cada función devuelve el cuerpo JSON tal como lo entrega el servidor.

const LIMITE_ASESORES = 50;
const LIMITE_TRABAJOS = 100;

/** Arma "?a=1&b=2" omitiendo los valores vacíos (undefined, null o ''). */
function armarConsulta(parametros = {}) {
  const consulta = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== '') consulta.set(clave, String(valor));
  }
  const texto = consulta.toString();
  return texto ? `?${texto}` : '';
}

const segmento = (id) => encodeURIComponent(id);

/* ─────────── Usuarios ─────────── */

export function listarUsuarios(filtros) {
  return api(`/admin/usuarios${armarConsulta(filtros)}`);
}

/** Total de usuarios que cumplen los filtros (pide una sola fila). */
export async function contarUsuarios(filtros) {
  const { paginacion } = await listarUsuarios({ ...filtros, page: 1, limit: 1 });
  return paginacion.total;
}

export function bloquearUsuario(id, motivo) {
  return api(`/admin/usuarios/${segmento(id)}/bloquear`, { method: 'PATCH', body: { motivo } });
}

export function desbloquearUsuario(id) {
  return api(`/admin/usuarios/${segmento(id)}/desbloquear`, { method: 'PATCH' });
}

export function validarAsesor(id, cupoMaximo) {
  return api(`/admin/usuarios/${segmento(id)}/validar`, { method: 'PATCH', body: { cupoMaximo } });
}

/* ─────────── Trabajos ─────────── */

export function listarTrabajos(filtros) {
  return api(`/admin/trabajos${armarConsulta(filtros)}`);
}

/** Total de trabajos que cumplen los filtros (pide una sola fila). */
export async function contarTrabajos(filtros) {
  const { paginacion } = await listarTrabajos({ ...filtros, page: 1, limit: 1 });
  return paginacion.total;
}

/** Recorre todas las páginas (100 por página) con los filtros dados. */
export async function cargarTodosLosTrabajos(filtros) {
  const primera = await listarTrabajos({ ...filtros, page: 1, limit: LIMITE_TRABAJOS });
  const resto = [];
  for (let pagina = 2; pagina <= primera.paginacion.totalPaginas; pagina += 1) {
    resto.push(listarTrabajos({ ...filtros, page: pagina, limit: LIMITE_TRABAJOS }));
  }
  const paginas = await Promise.all(resto);
  return [primera, ...paginas].flatMap((p) => p.trabajos);
}

export function obtenerFiltrosTrabajos() {
  return api('/admin/trabajos/filtros');
}

export async function obtenerTrabajo(id) {
  const { trabajo } = await api(`/admin/trabajos/${segmento(id)}`);
  return trabajo;
}

/* ─────────── Asesores ─────────── */

export function listarAsesores(filtros) {
  return api(`/admin/asesores${armarConsulta(filtros)}`);
}

/** Recorre todas las páginas (50 por página) con los filtros dados. */
export async function cargarTodosLosAsesores(filtros) {
  const primera = await listarAsesores({ ...filtros, page: 1, limit: LIMITE_ASESORES });
  const resto = [];
  for (let pagina = 2; pagina <= primera.paginacion.totalPaginas; pagina += 1) {
    resto.push(listarAsesores({ ...filtros, page: pagina, limit: LIMITE_ASESORES }));
  }
  const paginas = await Promise.all(resto);
  return [primera, ...paginas].flatMap((p) => p.asesores);
}

export async function obtenerAsesor(id) {
  const { asesor } = await api(`/admin/asesores/${segmento(id)}`);
  return asesor;
}

export function ampliarCupo(id, { cupoMaximo, motivo }) {
  return api(`/admin/asesores/${segmento(id)}/cupo`, { method: 'PATCH', body: { cupoMaximo, motivo } });
}

export function escribirAsesor(id, { asunto, contenido }) {
  return api(`/admin/asesores/${segmento(id)}/mensajes`, { method: 'POST', body: { asunto, contenido } });
}

/* ─────────── Tablero y distribución ─────────── */

export function obtenerTablero({ periodoId } = {}) {
  return api(`/admin/tablero${armarConsulta({ periodoId })}`);
}

export function obtenerDistribucion({ desde, hasta, periodoId } = {}) {
  return api(`/admin/distribucion${armarConsulta({ desde, hasta, periodoId })}`);
}

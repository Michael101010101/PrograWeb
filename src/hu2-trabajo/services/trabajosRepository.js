import seed from '../../data/hu2/seed.json';
import { guardarColeccion } from '../../hu1-cuenta/services/localStore.js';
import { ESTADOS_VIGENTES } from '../config.js';

const COLECCION = 'trabajos';
const CLAVE = `tfc.${COLECCION}`;

export function listar() {
  const crudo = localStorage.getItem(CLAVE);
  if (crudo) {
    try {
      return JSON.parse(crudo);
    } catch {
      return structuredClone(seed.trabajos);
    }
  }
  const inicial = structuredClone(seed.trabajos);
  guardarColeccion(COLECCION, inicial);
  return inicial;
}

export function buscarPorId(id) {
  return listar().find((t) => t.id === id) ?? null;
}

export function listarPorIntegrante(usuarioId) {
  return listar().filter((t) => t.integrantes.some((i) => i.usuarioId === usuarioId));
}

export function buscarVigentePorIntegrante(usuarioId) {
  return listarPorIntegrante(usuarioId).find((t) => ESTADOS_VIGENTES.includes(t.estado)) ?? null;
}

export function siguienteCodigo(semestre) {
  const prefijo = `TFC-${semestre}-`;
  const max = listar()
    .filter((t) => t.codigo.startsWith(prefijo))
    .reduce((m, t) => Math.max(m, Number(t.codigo.slice(prefijo.length)) || 0), 0);
  return `${prefijo}${String(max + 1).padStart(3, '0')}`;
}

export function crear(trabajo) {
  const nuevo = { ...trabajo, id: `t-${Date.now().toString(36)}` };
  guardarColeccion(COLECCION, [...listar(), nuevo]);
  return nuevo;
}

export function actualizar(id, cambios) {
  let actualizado = null;
  const lista = listar().map((t) => {
    if (t.id !== id) return t;
    actualizado = { ...t, ...cambios };
    return actualizado;
  });
  guardarColeccion(COLECCION, lista);
  return actualizado;
}
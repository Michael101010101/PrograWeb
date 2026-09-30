import { generarToken } from '../utils/hash.js';
import { guardarColeccion, leerColeccion } from './localStore.js';

// Enlaces de un solo uso: verificación de correo (24 h) y recuperación de contraseña (60 min).
const COLECCION = 'tokens';

export const VIGENCIA = {
  verificacion: 24 * 60 * 60 * 1000,
  recuperacion: 60 * 60 * 1000,
};

export function emitir(tipo, usuarioId) {
  const tokens = leerColeccion(COLECCION)
    // un enlace nuevo invalida los anteriores del mismo tipo
    .map((t) => (t.usuarioId === usuarioId && t.tipo === tipo ? { ...t, usado: true } : t));
  const nuevo = {
    token: generarToken(),
    tipo,
    usuarioId,
    creadoEn: new Date().toISOString(),
    venceEn: new Date(Date.now() + VIGENCIA[tipo]).toISOString(),
    usado: false,
  };
  guardarColeccion(COLECCION, [...tokens, nuevo]);
  return nuevo;
}

/** Devuelve { estado: 'valido' | 'usado' | 'vencido' | 'inexistente', registro } */
export function consultar(token, tipo) {
  const registro = leerColeccion(COLECCION).find((t) => t.token === token && t.tipo === tipo);
  if (!registro) return { estado: 'inexistente', registro: null };
  if (registro.usado) return { estado: 'usado', registro };
  if (new Date(registro.venceEn) < new Date()) return { estado: 'vencido', registro };
  return { estado: 'valido', registro };
}

export function marcarUsado(token) {
  const tokens = leerColeccion(COLECCION).map((t) => (t.token === token ? { ...t, usado: true } : t));
  guardarColeccion(COLECCION, tokens);
}

import { generarCodigoInvitacion } from '../utils/hash.js';
import { guardarColeccion, leerColeccion } from './localStore.js';

const COLECCION = 'invitaciones';
const VIGENCIA_DIAS = 7;

export function listar() {
  return leerColeccion(COLECCION);
}

export function buscarPorCodigo(codigo) {
  const c = String(codigo ?? '').trim().toUpperCase();
  return listar().find((i) => i.codigo === c) ?? null;
}

export function crear({ correo, invitadoPor }) {
  const nueva = {
    codigo: generarCodigoInvitacion(),
    correo,
    invitadoPor,
    creadaEn: new Date().toISOString(),
    venceEn: new Date(Date.now() + VIGENCIA_DIAS * 86400000).toISOString(),
    usada: false,
  };
  guardarColeccion(COLECCION, [...listar(), nueva]);
  return nueva;
}

export function actualizar(codigo, cambios) {
  guardarColeccion(
    COLECCION,
    listar().map((i) => (i.codigo === codigo ? { ...i, ...cambios } : i))
  );
}

export function estadoDe(invitacion) {
  if (invitacion.revocada) return 'revocada';
  if (invitacion.usada) return 'usada';
  if (new Date(invitacion.venceEn) < new Date()) return 'vencida';
  return 'vigente';
}

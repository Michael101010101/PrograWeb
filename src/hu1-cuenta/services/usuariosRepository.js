import { guardarColeccion, leerColeccion } from './localStore.js';

// Patrón Repository: único punto de acceso a la entidad Usuario.
// Las demás historias solo LEEN usuarios mediante estas funciones.

const COLECCION = 'usuarios';

export function listar() {
  return leerColeccion(COLECCION);
}

export function buscarPorId(id) {
  return listar().find((u) => u.id === id) ?? null;
}

export function buscarPorCorreo(correo) {
  const c = String(correo ?? '').trim().toLowerCase();
  return listar().find((u) => u.correo === c) ?? null;
}

export function buscarPorCodigoAlumno(codigo) {
  return listar().find((u) => u.codigoAlumno === codigo) ?? null;
}

export function crear(usuario) {
  const usuarios = listar();
  const nuevo = { ...usuario, id: `u-${Date.now().toString(36)}` };
  guardarColeccion(COLECCION, [...usuarios, nuevo]);
  return nuevo;
}

export function actualizar(id, cambios) {
  const usuarios = listar();
  let actualizado = null;
  const lista = usuarios.map((u) => {
    if (u.id !== id) return u;
    actualizado = { ...u, ...cambios };
    return actualizado;
  });
  guardarColeccion(COLECCION, lista);
  return actualizado;
}

/** Versión pública del usuario, sin el hash de la contraseña. */
export function sinSecretos(usuario) {
  if (!usuario) return null;
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...resto } = usuario;
  return resto;
}

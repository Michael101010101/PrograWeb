import { api } from '../../shared/api.js';

// Capa de servicios de la HU-1 en el front. Las páginas llaman a estas funciones;
// ahora cada una hace una petición a la API (server/) en lugar de leer localStorage.
// Los errores llegan como ServiceError con el código HTTP del servidor.

/* ─────────── Sesión ─────────── */

/** Devuelve { token, usuario, ingresoAnterior } */
export function iniciarSesion(correo, password) {
  return api('/auth/login', { method: 'POST', body: { correo, password } });
}

/** Usuario de la sesión actual (según el JWT guardado). */
export async function obtenerUsuarioSesion() {
  const { usuario } = await api('/cuenta');
  return usuario;
}

/* ─────────── Registro ─────────── */

export function registrarEstudiante(datos) {
  return api('/auth/registro/estudiante', { method: 'POST', body: datos });
}

export function registrarAsesor(datos) {
  return api('/auth/registro/asesor', { method: 'POST', body: datos });
}

export function consultarInvitacion(codigo) {
  return api(`/auth/invitaciones/${encodeURIComponent(codigo)}`);
}

export function registrarCoordinador(codigo, datos) {
  return api('/auth/registro/coordinador', { method: 'POST', body: { codigo, ...datos } });
}

/* ─────────── Verificación de correo ─────────── */

export async function verificarCorreo(token) {
  const { usuario } = await api(`/auth/verificar/${encodeURIComponent(token)}`, { method: 'POST' });
  return usuario;
}

export function reenviarVerificacion(correo) {
  return api('/auth/verificacion/reenviar', { method: 'POST', body: { correo } });
}

/* ─────────── Recuperación de contraseña ─────────── */

export function solicitarRecuperacion(correo) {
  return api('/auth/recuperar', { method: 'POST', body: { correo } });
}

export function validarEnlaceRecuperacion(token) {
  return api(`/auth/recuperar/${encodeURIComponent(token)}`);
}

export function restablecerPassword(token, nueva, confirmacion) {
  return api(`/auth/recuperar/${encodeURIComponent(token)}`, { method: 'POST', body: { nueva, confirmacion } });
}

/* ─────────── Mi cuenta ─────────── */

// usuarioId ya no se envía: el servidor lo obtiene del JWT. Se mantiene el parámetro para no cambiar las páginas.
export function actualizarCuenta(_usuarioId, perfil, cambioPassword) {
  return api('/cuenta', { method: 'PUT', body: { perfil, cambioPassword } });
}

/* ─────────── Invitaciones (solo coordinación) ─────────── */

export function listarInvitaciones() {
  return api('/invitaciones');
}

export function crearInvitacion(_solicitante, correo) {
  return api('/invitaciones', { method: 'POST', body: { correo } });
}

export function anularInvitacion(_solicitante, codigo) {
  return api(`/invitaciones/${encodeURIComponent(codigo)}`, { method: 'DELETE' });
}

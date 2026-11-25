import ServiceError from './ServiceError.js';
import { leerSesion } from './sesion.js';

// Cliente HTTP común para todas las historias.
// - Agrega el JWT de la sesión en la cabecera Authorization.
// - Convierte las respuestas de error en ServiceError { status, message, campos, datos }.
// En desarrollo, Vite redirige /api al servidor (ver vite.config.js). En producción se usa VITE_API_URL.

const BASE = import.meta.env.VITE_API_URL ?? '';

export async function api(ruta, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = leerSesion()?.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${BASE}/api${ruta}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ServiceError(0, 'No pudimos conectar con el servidor. Revisa que esté encendido.');
  }

  if (respuesta.status === 204) return null;
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new ServiceError(respuesta.status, datos.mensaje ?? 'Ocurrió un error.', { campos: datos.campos, datos: datos.datos });
  }
  return datos;
}

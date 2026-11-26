import { api } from '../../shared/api.js';

// HU-5 · Acceso al API de revisión y retroalimentación (/api/revision).
// Devuelve los datos con el formato que lee adaptarHu4 y envía cada acción al endpoint que corresponde.

/** { trabajos, entregables, avances } del usuario que inició sesión (asesor: sus asesorados; estudiante: su trabajo). */
export function cargarDatosRevision() {
  return api('/revision/mis-datos');
}

/**
 * Envía una acción de la pantalla al servidor:
 *   aprobado   -> POST /revision/avances/:id/aprobar    { comentario }
 *   observado  -> POST /revision/avances/:id/observar   { comentario }  (obligatorio)
 *   comentario -> POST /revision/avances/:id/comentarios { texto }       (asesor)
 *   respuesta  -> POST /revision/avances/:id/comentarios { texto, respuestaAId } (estudiante)
 */
export function enviarAccion({ tipo, avanceId, texto = '', respuestaA }) {
  const base = `/revision/avances/${avanceId}`;
  const mensaje = texto.trim();
  if (tipo === 'aprobado') return api(`${base}/aprobar`, { method: 'POST', body: { comentario: mensaje } });
  if (tipo === 'observado') return api(`${base}/observar`, { method: 'POST', body: { comentario: mensaje } });
  // El comentario de la revisión se muestra como primer mensaje del asesor con un id propio (origen-…): no existe como fila.
  const respuestaAId = respuestaA && !String(respuestaA).startsWith('origen-') ? respuestaA : undefined;
  return api(`${base}/comentarios`, { method: 'POST', body: { texto: mensaje, respuestaAId } });
}

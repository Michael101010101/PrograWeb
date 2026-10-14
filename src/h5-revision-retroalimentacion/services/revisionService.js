export function puedeVerTrabajo(usuario, trabajo) {
  if (!usuario || !trabajo) return false;
  if (usuario.rol === 'asesor') return trabajo.asesor?.usuarioId === usuario.id;
  if (usuario.rol === 'estudiante') return trabajo.integrantes.includes(usuario.id);
  return false;
}
export function versionesDe(datos, entregableId) {
  return datos.avances.filter((a) => a.entregableId === entregableId).sort((a, b) => b.version - a.version);
}
export function detalleAvance(datos, id) {
  const avance = datos.avances.find((a) => a.id === id);
  const entregable = datos.entregables.find((e) => e.id === avance?.entregableId);
  const trabajo = datos.trabajos.find((t) => t.codigo === entregable?.trabajoCodigo);
  return avance && entregable && trabajo ? { avance, entregable, trabajo } : null;
}
export function puedeRevisar(datos, usuario, id) {
  const d = detalleAvance(datos, id);
  return Boolean(d && usuario?.rol === 'asesor' && puedeVerTrabajo(usuario, d.trabajo)
    && d.trabajo.estado === 'en_desarrollo' && d.avance.estado === 'en_revision'
    && versionesDe(datos, d.entregable.id)[0]?.id === id);
}
export function validarAccion(datos, usuario, { tipo, avanceId, texto = '', respuestaA }) {
  const d = detalleAvance(datos, avanceId);
  if (!d || !puedeVerTrabajo(usuario, d.trabajo)) throw new Error('No tienes acceso a este avance.');
  if (!['comentario', 'respuesta', 'aprobado', 'observado'].includes(tipo)) throw new Error('Acción inválida.');
  if (texto.trim().length > 800) throw new Error('El comentario no puede superar los 800 caracteres.');
  if (['aprobado', 'observado'].includes(tipo)) {
    if (!puedeRevisar(datos, usuario, avanceId)) throw new Error('Solo puedes revisar la última versión pendiente de tus trabajos asignados.');
    if (tipo === 'observado' && texto.trim().length < 30) throw new Error('Indica qué debe corregirse en al menos 30 caracteres.');
  } else {
    if (!texto.trim()) throw new Error('Escribe un comentario antes de enviarlo.');
    if (tipo === 'comentario' && usuario.rol !== 'asesor') throw new Error('Solo el asesor puede publicar comentarios.');
    if (tipo === 'respuesta' && (usuario.rol !== 'estudiante'
      || !d.avance.comentarios.some((c) => c.id === respuestaA && c.rol === 'asesor'))) throw new Error('Selecciona un comentario del asesor para responder.');
  }
}
export function aplicarEventos(base, eventos) {
  const datos = structuredClone(base);
  for (const evento of [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id))) {
    const avance = datos.avances.find((a) => a.id === evento.avanceId);
    if (!avance) continue;
    if (['aprobado', 'observado'].includes(evento.tipo)) {
      if (avance.estado !== 'en_revision') continue;
      avance.estado = evento.tipo;
      avance.revision = { fecha: evento.fecha, comentario: evento.texto, revisor: evento.autor, revisorId: evento.autorId };
    }
    if (evento.texto) avance.comentarios.push({ ...evento });
  }
  return datos;
}

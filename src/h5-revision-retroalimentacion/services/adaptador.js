// Lectura del contrato de origin/Michael-h4. Nunca escribe en tfc.hu4.
export function adaptarHu4(datos) {
  if (!datos || !['trabajos', 'entregables', 'avances'].every((k) => Array.isArray(datos[k]))) throw new Error('Catálogo de HU-4 incompatible.');
  const trabajos = datos.trabajos.map((t) => ({ ...t,
    responsableId: t.responsableId ?? t.integrantes?.find((i) => i.responsable)?.usuarioId,
    integrantes: (t.integrantes || []).map((i) => typeof i === 'string' ? i : i.usuarioId).filter(Boolean),
  }));
  const unicos = (lista, campo) => lista.every((item) => typeof item[campo] === 'string' && item[campo])
    && new Set(lista.map((item) => item[campo])).size === lista.length;
  if (!unicos(trabajos, 'codigo') || !unicos(datos.entregables, 'id') || !unicos(datos.avances, 'id')
    || datos.entregables.some((e) => !trabajos.some((t) => t.codigo === e.trabajoCodigo)
      || !Number.isFinite(e.peso) || e.peso < 0 || typeof e.fechaLimite !== 'string')
    || datos.avances.some((a) => !datos.entregables.some((e) => e.id === a.entregableId)
      || !Number.isInteger(a.version) || a.version < 1 || typeof a.fecha !== 'string'
      || !['en_revision', 'observado', 'aprobado'].includes(a.estado))) {
    throw new Error('El catálogo contiene identificadores, relaciones o versiones incompatibles.');
  }
  return { trabajos, entregables: datos.entregables.map((e) => ({ ...e, peso: Number(e.peso) || 0 })),
    avances: datos.avances.map((a) => {
      const e = datos.entregables.find((item) => item.id === a.entregableId);
      const t = trabajos.find((item) => item.codigo === e?.trabajoCodigo);
      const comentarios = [...(a.comentarios || [])];
      if (a.revision?.comentario) comentarios.unshift({ id: `origen-${a.id}`, autorId: t?.asesor?.usuarioId,
        autor: a.revision.revisor, rol: 'asesor', texto: a.revision.comentario, fecha: a.revision.fecha });
      return { ...a, comentarios };
    }),
  };
}
export function enlaceSeguro(texto) {
  try { return ['http:', 'https:'].includes(new URL(texto).protocol) ? texto : null; }
  catch { return null; }
}

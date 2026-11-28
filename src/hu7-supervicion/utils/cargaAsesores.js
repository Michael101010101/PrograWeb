// HU-7 · Cálculos de la pantalla "Carga por asesor" sobre los datos que entrega el API.

const ABREVIATURA_GRADO = { Ingeniero: 'Ing.', Magíster: 'Mg.', Doctor: 'Dr.' };

/** "Ing. Luis Ocampo"; un grado desconocido se muestra tal cual; sin grado, solo el nombre. */
export function nombreConGrado(asesor) {
  const grado = asesor.gradoAcademico;
  if (!grado) return asesor.nombreCompleto;
  return `${ABREVIATURA_GRADO[grado] ?? grado} ${asesor.nombreCompleto}`;
}

/** Ocupación 0–1 (o null si no tiene cupo registrado). */
export function ocupacion(asesor) {
  if (!asesor.cupoMaximo) return null;
  return asesor.trabajosACargo / asesor.cupoMaximo;
}

/** De mayor a menor ocupación; los que no tienen cupo van al final. Empate: por nombre. */
export function ordenarPorOcupacion(asesores) {
  return [...asesores].sort((a, b) => {
    const oa = ocupacion(a);
    const ob = ocupacion(b);
    if (oa === null && ob !== null) return 1;
    if (ob === null && oa !== null) return -1;
    return (ob ?? 0) - (oa ?? 0) || a.nombreCompleto.localeCompare(b.nombreCompleto, 'es');
  });
}

/** Métricas de la tarjeta "Resumen de la facultad". */
export function resumenFacultad(asesores) {
  const conCupo = asesores.filter((a) => a.cupoMaximo !== null);
  const tiempos = asesores.map((a) => a.tiempoRevisionPromedioDias).filter((t) => t !== null && t !== undefined);
  return {
    cuposOcupados: conCupo.reduce((s, a) => s + a.trabajosACargo, 0),
    cuposTotales: conCupo.reduce((s, a) => s + a.cupoMaximo, 0),
    sinCarga: asesores.filter((a) => a.trabajosACargo === 0).length,
    revisionPromedio: tiempos.length ? Math.round((tiempos.reduce((s, t) => s + t, 0) / tiempos.length) * 10) / 10 : null,
  };
}

/**
 * Asesor activo con cupo completo y más avances por revisar, y hasta 2 asesores activos
 * con cupo libre que compartan alguna de sus líneas. null si nadie tiene el cupo completo.
 */
export function recomendacion(asesores) {
  const activos = asesores.filter((a) => a.estado === 'activo');
  const critico = activos
    .filter((a) => a.cupoDisponible === 0)
    .sort((a, b) => b.avancesPorRevisar - a.avancesPorRevisar)[0];
  if (!critico) return null;

  const lineas = new Set(critico.lineas);
  const candidatos = activos
    .filter((a) => a.id !== critico.id && a.cupoDisponible > 0)
    .map((a) => ({ ...a, lineasComunes: a.lineas.filter((l) => lineas.has(l)) }))
    .filter((a) => a.lineasComunes.length > 0)
    .sort((a, b) => b.cupoDisponible - a.cupoDisponible)
    .slice(0, 2);

  return { critico, candidatos };
}

/** Clase de color de la barra de cupo: 100 % rojo, desde 70 % ámbar, si no verde. */
export function colorOcupacion(valor) {
  if (valor >= 1) return 'hu7-barra-roja';
  if (valor >= 0.7) return 'hu7-barra-ambar';
  return 'hu7-barra-verde';
}

export const plural = (n, singular, varios) => `${n} ${n === 1 ? singular : varios}`;

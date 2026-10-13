// Etiqueta y punto de color de cada estado del entregable (lámina "Estados del entregable").
export const ESTADOS = {
  pendiente: { texto: 'Pendiente', tono: 'neutral' },
  entregado: { texto: 'Entregado', tono: 'info' },
  con_retraso: { texto: 'Con retraso', tono: 'warning' },
  observado: { texto: 'Observado', tono: 'accent' },
  aprobado: { texto: 'Aprobado', tono: 'success' },
  vencido: { texto: 'Vencido sin presentar', tono: 'danger' },
};

/** Chip con el nombre del estado: <EstadoBadge estado="aprobado" /> */
export function EstadoBadge({ estado }) {
  const { texto, tono } = ESTADOS[estado];
  return <span className={`hu4-badge hu4-badge--${tono}`}>{texto}</span>;
}

/** Punto de la línea de tiempo. El pendiente es un círculo punteado. */
export function PuntoEstado({ estado }) {
  return <span className={`hu4-punto hu4-punto--${ESTADOS[estado].tono}`} aria-hidden="true" />;
}

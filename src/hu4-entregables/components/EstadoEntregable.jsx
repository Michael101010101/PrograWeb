import { ESTADOS } from '../utils/estados.js';

/** Chip con el nombre del estado: <EstadoBadge estado="aprobado" /> */
export function EstadoBadge({ estado }) {
  const { texto, tono } = ESTADOS[estado];
  return <span className={`hu4-badge hu4-badge--${tono}`}>{texto}</span>;
}

/** Punto de la línea de tiempo. El pendiente es un círculo punteado. */
export function PuntoEstado({ estado }) {
  return <span className={`hu4-punto hu4-punto--${ESTADOS[estado].tono}`} aria-hidden="true" />;
}

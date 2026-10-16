// Utilidades de fechas de la HU-3.
// Las fechas se guardan como texto 'AAAA-MM-DD' (fácil de comparar y de guardar en JSON).

// "Hoy" fijo para la demo: así los "días en espera" y los vencimientos
// coinciden siempre con los mockups (semana del 06/09/2026).
export const HOY = '2026-09-06';

// '2026-09-01' -> '01/09/2026'
export function formatearFecha(iso) {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

// Días que hay desde la fecha `desde` hasta la fecha `hasta` (puede ser negativo).
export function diasEntre(desde, hasta) {
  const unDia = 24 * 60 * 60 * 1000;
  return Math.round((new Date(hasta) - new Date(desde)) / unDia);
}

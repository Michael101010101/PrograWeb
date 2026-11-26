// Utilidades de fechas de la HU-3.
// La API devuelve las fechas como texto 'AAAA-MM-DD' (columnas DATEONLY de PostgreSQL).

/** Fecha de hoy en Lima como 'AAAA-MM-DD' (la misma zona que usa el servidor). */
export function hoy() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

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

// Utilidades de fechas de la HU-4.
// Las fechas se guardan como texto 'AAAA-MM-DD': se comparan como texto y se guardan fácil en JSON.

// Fecha actual del calendario de Lima.
export const HOY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

// Límites del semestre 2026-2 (del cronograma del periodo): las fechas límite deben caer aquí.
export const SEMESTRE = { nombre: '2026-2', inicio: '2026-08-10', fin: '2026-12-19' };

// '2026-09-06' -> '06/09/2026'
export function formatearFecha(iso) {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

// '2026-09-06' -> '06/09' (para textos cortos)
export function formatearCorta(iso) {
  return formatearFecha(iso).slice(0, 5);
}

// Días desde `desde` hasta `hasta`. Positivo si `hasta` es posterior; negativo si ya pasó.
export function diasEntre(desde, hasta) {
  const unDia = 24 * 60 * 60 * 1000;
  return Math.round((new Date(hasta) - new Date(desde)) / unDia);
}

// '1 día' / '7 días'
export function textoDias(n) {
  return `${n} ${Math.abs(n) === 1 ? 'día' : 'días'}`;
}

export function dentroDelSemestre(iso) {
  return iso >= SEMESTRE.inicio && iso <= SEMESTRE.fin;
}

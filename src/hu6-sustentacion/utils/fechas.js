// Utilidades de fechas de la HU-6.
// Las fechas se guardan como texto 'AAAA-MM-DD' y las horas como 'HH:MM'.

// "Hoy" fijo para la demo (misma fecha que usan las demás historias: 06/09/2026).
export const HOY = '2026-09-06';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Crea la fecha al mediodía para evitar saltos de día por la zona horaria.
const aFecha = (iso) => new Date(`${iso}T12:00:00`);
const aIso = (fecha) => fecha.toISOString().slice(0, 10);

// '2026-12-11' -> '11/12/2026'
export function formatearFecha(iso) {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

// '2026-12-11' -> '11/12'
export const formatearCorta = (iso) => formatearFecha(iso).slice(0, 5);

// '2026-12-11' -> 'Viernes'
export const diaSemana = (iso) => DIAS[aFecha(iso).getDay()];

// Días desde `desde` hasta `hasta` (negativo si `hasta` ya pasó).
export function diasEntre(desde, hasta) {
  return Math.round((aFecha(hasta) - aFecha(desde)) / (24 * 60 * 60 * 1000));
}

// Resta días hábiles (de lunes a viernes). Ej.: 11/12/2026 menos 5 hábiles = 04/12/2026
export function restarDiasHabiles(iso, cantidad) {
  const fecha = aFecha(iso);
  let restantes = cantidad;
  while (restantes > 0) {
    fecha.setDate(fecha.getDate() - 1);
    const dia = fecha.getDay();
    if (dia !== 0 && dia !== 6) restantes -= 1;
  }
  return aIso(fecha);
}

// '10:00' -> '11:00' (los bloques duran 60 minutos)
export function horaFin(hora) {
  const h = Number(hora.slice(0, 2)) + 1;
  return `${String(h).padStart(2, '0')}:${hora.slice(3)}`;
}

// Hora actual 'HH:MM' (para registrar a qué hora se firmó el acta).
export function horaActual() {
  const ahora = new Date();
  return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
}

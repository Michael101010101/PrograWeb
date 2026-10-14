export function fecha(texto) {
  if (!texto) return 'Sin fecha';
  const valor = new Date(texto.length === 10 ? `${texto}T12:00:00-05:00` : texto);
  return Number.isNaN(valor.getTime()) ? 'Sin fecha' : valor.toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric' });
}
export function hoy() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
export function diasDesde(texto) {
  return Math.max(0, Math.floor((Date.parse(`${hoy()}T12:00:00Z`) - Date.parse(`${texto.slice(0, 10)}T12:00:00Z`)) / 86400000));
}

const p = (n) => String(n).padStart(2, '0');

export function fecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function fechaCorta(iso) {
  return fecha(iso).slice(0, 5);
}

export function hora(iso) {
  const d = new Date(iso);
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function diasHasta(fechaObjetivo, hoy = new Date()) {
  const a = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const b = new Date(fechaObjetivo);
  const c = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((c - a) / 86400000);
}
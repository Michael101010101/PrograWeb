export function iniciales(nombres = '', apellidos = '') {
  return `${nombres.trim().charAt(0)}${apellidos.trim().charAt(0)}`.toUpperCase();
}

export function nombreCorto(usuario) {
  if (!usuario) return '';
  return `${usuario.nombres.split(' ')[0]} ${usuario.apellidos}`;
}

export function nombreCompleto(usuario) {
  return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
}

export function fechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

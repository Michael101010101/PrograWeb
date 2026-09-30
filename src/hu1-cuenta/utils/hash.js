// En la entrega 1 no hay servidor: se guarda solo un hash SHA-256 con sal (nunca la contraseña).
// En la entrega 2 esto se reemplaza por bcrypt en el backend (Express).
const SAL_GLOBAL = 'tfc-2026-2';

export async function hashPassword(correo, password) {
  const texto = `${SAL_GLOBAL}:${correo.trim().toLowerCase()}:${password}`;
  const bytes = new TextEncoder().encode(texto);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generarToken(longitud = 24) {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function generarCodigoInvitacion() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const c = Array.from(bytes, (b) => letras[b % letras.length]).join('');
  return `INV-${c.slice(0, 4)}-${c.slice(4)}`;
}

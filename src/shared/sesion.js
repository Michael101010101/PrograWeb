// Dónde se guarda el JWT en el navegador. Lo usan AuthContext (guardar/borrar) y api.js (leer).
const CLAVE = 'tfc.sesion';

export function leerSesion() {
  try {
    const crudo = localStorage.getItem(CLAVE) ?? sessionStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

/** recordar = true → localStorage (persiste); false → sessionStorage (se borra al cerrar la pestaña). */
export function guardarSesion(sesion, recordar) {
  localStorage.removeItem(CLAVE);
  sessionStorage.removeItem(CLAVE);
  if (sesion) (recordar ? localStorage : sessionStorage).setItem(CLAVE, JSON.stringify(sesion));
}

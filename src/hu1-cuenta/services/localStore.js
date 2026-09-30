import seed from '../../data/seed.json';

// Persistencia de la entrega 1: los datos semilla se copian a localStorage la primera vez
// y desde ahí se leen y escriben. En la entrega 2 los repositorios pasan a usar fetch.
const PREFIJO = 'tfc.';

export function leerColeccion(nombre) {
  const crudo = localStorage.getItem(PREFIJO + nombre);
  if (crudo) {
    try {
      return JSON.parse(crudo);
    } catch {
      /* dato corrupto: se vuelve a la semilla */
    }
  }
  const inicial = structuredClone(seed[nombre] ?? []);
  guardarColeccion(nombre, inicial);
  return inicial;
}

export function guardarColeccion(nombre, datos) {
  localStorage.setItem(PREFIJO + nombre, JSON.stringify(datos));
}

export function leerObjeto(nombre, porDefecto = {}) {
  try {
    return JSON.parse(localStorage.getItem(PREFIJO + nombre)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardarObjeto(nombre, datos) {
  localStorage.setItem(PREFIJO + nombre, JSON.stringify(datos));
}

/** Restaura los datos semilla (útil en la demo y en pruebas). */
export function reiniciarDatos() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIJO))
    .forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem(PREFIJO + 'sesion');
}

export const catalogos = seed.catalogos;

export const esperar = (ms = 350) => new Promise((r) => setTimeout(r, ms));

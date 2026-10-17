import { LIMITES, LINEAS_INVESTIGACION } from '../config.js';

export function limpiar(texto) {
  return String(texto ?? '').trim().replace(/\s+/g, ' ');
}

export function validarTitulo(valor) {
  const v = limpiar(valor);
  if (!v) return 'Escribe el título del trabajo';
  if (v.length < LIMITES.tituloMin) return `El título debe tener al menos ${LIMITES.tituloMin} caracteres`;
  if (v.length > LIMITES.tituloMax) return `El título admite hasta ${LIMITES.tituloMax} caracteres`;
  return null;
}

export function validarLinea(valor) {
  if (!valor) return 'Debes elegir una línea de investigación';
  if (!LINEAS_INVESTIGACION.includes(valor)) return 'La línea elegida no existe';
  return null;
}

export function validarResumen(valor) {
  const n = String(valor ?? '').trim().length;
  if (n === 0) return 'Escribe el resumen del trabajo';
  if (n < LIMITES.resumenMin) return `Faltan ${LIMITES.resumenMin - n} caracteres para el mínimo · ${n} / ${LIMITES.resumenMax}`;
  if (n > LIMITES.resumenMax) return `Sobran ${n - LIMITES.resumenMax} caracteres · ${n} / ${LIMITES.resumenMax}`;
  return null;
}

export function validarObjetivos(valor) {
  const n = String(valor ?? '').trim().length;
  if (n === 0) return 'Escribe al menos un objetivo';
  if (n < LIMITES.objetivosMin) return `Los objetivos deben tener al menos ${LIMITES.objetivosMin} caracteres`;
  if (n > LIMITES.objetivosMax) return `Los objetivos admiten hasta ${LIMITES.objetivosMax} caracteres`;
  return null;
}

export function validarPalabrasClave(lista = []) {
  if (lista.length < LIMITES.palabrasMin) {
    const faltan = LIMITES.palabrasMin - lista.length;
    return `Agrega ${faltan} palabra${faltan === 1 ? '' : 's'} clave más (mínimo ${LIMITES.palabrasMin})`;
  }
  if (lista.length > LIMITES.palabrasMax) return `Máximo ${LIMITES.palabrasMax} palabras clave`;
  return null;
}

export function validarNuevaPalabra(palabra, lista = []) {
  const p = limpiar(palabra).toLowerCase();
  if (!p) return null;
  if (p.length < 2) return 'La palabra clave es muy corta';
  if (p.length > LIMITES.palabraMax) return `Cada palabra clave admite hasta ${LIMITES.palabraMax} caracteres`;
  if (lista.some((x) => x.toLowerCase() === p)) return 'Esa palabra clave ya está en la lista';
  if (lista.length >= LIMITES.palabrasMax) return `Máximo ${LIMITES.palabrasMax} palabras clave`;
  return null;
}

export function validarTrabajo(v) {
  const errores = {
    titulo: validarTitulo(v.titulo),
    linea: validarLinea(v.linea),
    resumen: validarResumen(v.resumen),
    objetivos: validarObjetivos(v.objetivos),
    palabrasClave: validarPalabrasClave(v.palabrasClave),
  };
  return Object.fromEntries(Object.entries(errores).filter(([, e]) => e));
}

export function validarMotivo(valor) {
  const n = String(valor ?? '').trim().length;
  if (n === 0) return 'El motivo es obligatorio';
  if (n < LIMITES.motivoMin) return `Faltan ${LIMITES.motivoMin - n} caracteres para el mínimo`;
  if (n > LIMITES.motivoMax) return `El motivo admite hasta ${LIMITES.motivoMax} caracteres`;
  return null;
}
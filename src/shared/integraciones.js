// Puntos de integración entre historias (solo LECTURA de entidades ajenas).
// Mientras cada historia no se fusione a develop, estas funciones devuelven datos de ejemplo.
// Al integrar, el dueño de cada entidad reemplaza el cuerpo por la llamada a su repositorio.
import { useEffect, useState } from 'react';
import { resumenTrabajoVigente } from '../hu2-trabajo/services/trabajoService.js';
import { obtenerDestacados } from '../hu3-asesores/services/asesoriasService.js';

/** HU-2 · Trabajo vigente del estudiante: { codigo, titulo, avance } | null */
export function obtenerTrabajoVigente() {
  return resumenTrabajoVigente();
}

/**
 * HU-3 · Asesores con cupo para la landing pública (los 3 con más cupo disponible).
 * Hook: los pide a la API (GET /api/asesores/destacados) y mientras llegan devuelve [].
 * Cada uno: { id, iniciales, nombre, departamento, linea, cupo: '3 de 6' }
 */
export function useAsesoresDestacados() {
  const [asesores, setAsesores] = useState([]);
  useEffect(() => {
    let vigente = true;
    obtenerDestacados()
      .then((lista) => vigente && setAsesores(lista))
      .catch(() => vigente && setAsesores([]));
    return () => {
      vigente = false;
    };
  }, []);
  return asesores;
}

// Puntos de integración entre historias (solo LECTURA de entidades ajenas).
// Mientras cada historia no se fusione a develop, estas funciones devuelven datos de ejemplo.
// Al integrar, el dueño de cada entidad reemplaza el cuerpo por la llamada a su repositorio.
import {
  cargarDatos,
  cupoDisponible,
  inicialesAsesor,
  nombreAsesor,
  ordenarAsesores,
} from '../hu3-asesores/services/asesoriasService.js';

/** HU-2 · Trabajo vigente del estudiante: { codigo, titulo, avance } | null */
export function obtenerTrabajoVigente(/* usuarioId */) {
  return null;
}

/** HU-3 · Asesores con cupo para la landing pública (los 3 con más cupo disponible). */
export function obtenerAsesoresDestacados() {
  const { asesores } = cargarDatos();
  return ordenarAsesores(asesores.filter((a) => cupoDisponible(a) > 0), 'cupo')
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      iniciales: inicialesAsesor(a),
      nombre: nombreAsesor(a),
      departamento: a.departamento.replace('Ingeniería', 'Ing.'),
      linea: a.lineas[0],
      cupo: `${cupoDisponible(a)} de ${a.cupoMaximo}`,
    }));
}

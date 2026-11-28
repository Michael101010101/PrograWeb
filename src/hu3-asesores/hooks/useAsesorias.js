import useCarga from './useCarga.js';
import * as servicio from '../services/asesoriasService.js';

// Hooks de la HU-3: cada página pide a la API solo los datos que muestra.
// Todos devuelven { datos, cargando, error, recargar } (ver useCarga.js).

/** Directorio paginado; se vuelve a pedir al cambiar los filtros, el orden o la página. */
export function useDirectorio(filtros, orden, pagina, porPagina) {
  const { texto, linea, departamento, soloConCupo } = filtros;
  return useCarga(
    () => servicio.listarAsesores(filtros, orden, pagina, porPagina),
    [texto, linea, departamento, soloConCupo, orden, pagina, porPagina]
  );
}

/** Trabajo del estudiante, su última solicitud, el asesor y el término (solo con rol estudiante). */
export function useMiSolicitud(activo) {
  return useCarga(() => servicio.obtenerMiSolicitud(), [], activo);
}

/** Ficha del asesor que inició sesión y el resumen de su rol (cupo, pendientes, por revisar). */
export function useMiFicha() {
  return useCarga(() => servicio.obtenerMiFicha(), []);
}

/** Bandeja de solicitudes del asesor (pendientes y resueltas). */
export function useBandeja() {
  return useCarga(() => servicio.obtenerBandeja(), []);
}

/** Trabajos a cargo del asesor y sus vencimientos. */
export function useAsesorados() {
  return useCarga(() => servicio.obtenerAsesorados(), []);
}

/** Un trabajo a cargo (detalle); se vuelve a pedir si cambia el código de la URL. */
export function useAsesorado(codigo) {
  return useCarga(() => servicio.obtenerAsesorado(codigo), [codigo]);
}

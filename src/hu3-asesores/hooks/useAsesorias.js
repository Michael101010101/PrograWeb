import { useState } from 'react';
import * as servicio from '../services/asesoriasService.js';

/**
 * Hook propio de la HU-3: guarda los datos en un useState y expone las acciones.
 * Cada acción llama al servicio (que valida y devuelve datos nuevos),
 * los guarda en localStorage y actualiza el estado para que React vuelva a pintar.
 * Si el servicio lanza un Error, se propaga para que la página muestre el mensaje.
 */
export default function useAsesorias() {
  const [datos, setDatos] = useState(() => servicio.cargarDatos());

  const ejecutar = (accion) => {
    const nuevos = accion(datos);
    servicio.guardarDatos(nuevos);
    setDatos(nuevos);
  };

  return {
    datos,
    solicitar: (solicitud) => ejecutar((d) => servicio.solicitarAsesoria(d, solicitud)),
    retirar: (solicitudId) => ejecutar((d) => servicio.retirarSolicitud(d, solicitudId)),
    aceptar: (solicitudId) => ejecutar((d) => servicio.aceptarSolicitud(d, solicitudId)),
    rechazar: (solicitudId, motivo) => ejecutar((d) => servicio.rechazarSolicitud(d, solicitudId, motivo)),
    terminar: (codigoTrabajo, motivo) => ejecutar((d) => servicio.terminarAsesoria(d, codigoTrabajo, motivo)),
    guardarFicha: (asesorId, ficha) => ejecutar((d) => servicio.guardarFicha(d, asesorId, ficha)),
  };
}

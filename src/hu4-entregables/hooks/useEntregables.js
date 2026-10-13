import { useState } from 'react';
import * as servicio from '../services/entregablesService.js';

/**
 * Hook propio de la HU-4: guarda los datos en un useState y expone las acciones.
 * Cada acción llama al servicio (que valida y devuelve datos nuevos),
 * los guarda en localStorage y actualiza el estado para que React vuelva a pintar.
 * Si el servicio lanza un Error, se propaga para que la página muestre el mensaje.
 */
export default function useEntregables() {
  const [datos, setDatos] = useState(() => servicio.cargarDatos());

  const ejecutar = (accion) => {
    const nuevos = accion(datos);
    servicio.guardarDatos(nuevos);
    setDatos(nuevos);
  };

  return {
    datos,
    // Estudiante
    registrarAvance: (entregableId, avance) => ejecutar((d) => servicio.registrarAvance(d, entregableId, avance)),
    solicitarAmpliacion: (entregableId, solicitud) => ejecutar((d) => servicio.solicitarAmpliacion(d, entregableId, solicitud)),
    // Asesor
    guardarEntregable: (codigo, formulario, entregableId) =>
      ejecutar((d) => servicio.guardarEntregable(d, codigo, formulario, entregableId)),
    eliminarEntregable: (entregableId) => ejecutar((d) => servicio.eliminarEntregable(d, entregableId)),
    aplicarPlantilla: (codigo) => ejecutar((d) => servicio.aplicarPlantilla(d, codigo)),
    responderAmpliacion: (ampliacionId, aceptar) => ejecutar((d) => servicio.responderAmpliacion(d, ampliacionId, aceptar)),
  };
}

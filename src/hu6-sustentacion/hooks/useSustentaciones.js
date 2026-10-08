import { useState } from 'react';
import * as servicio from '../services/sustentacionesService.js';

/**
 * Hook propio de la HU-6: guarda los datos en un useState y expone las acciones.
 * Cada acción llama al servicio (que valida y devuelve datos nuevos),
 * los guarda en localStorage y actualiza el estado para que React vuelva a pintar.
 * Si el servicio lanza un Error, se propaga para que la página muestre el mensaje.
 */
export default function useSustentaciones() {
  const [datos, setDatos] = useState(() => servicio.cargarDatos());

  const ejecutar = (accion) => {
    const nuevos = accion(datos);
    servicio.guardarDatos(nuevos);
    setDatos(nuevos);
  };

  return {
    datos,
    // Devuelve el id de la nueva sustentación para poder ir al paso del jurado.
    programar: (form) => {
      const id = `s-${Date.now()}`;
      ejecutar((d) => servicio.programarSustentacion(d, { ...form, id }));
      return id;
    },
    reprogramar: (id, form) => ejecutar((d) => servicio.reprogramarSustentacion(d, id, form)),
    guardarJurado: (id, jurado) => ejecutar((d) => servicio.guardarJurado(d, id, jurado)),
    guardarBorrador: (id, acta) => ejecutar((d) => servicio.guardarBorradorActa(d, id, acta)),
    registrarActa: (id, acta) => ejecutar((d) => servicio.registrarActa(d, id, acta)),
  };
}

import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta una petición al API cuando cambian las dependencias.
 * - Ignora las respuestas viejas: si las dependencias cambian antes de que llegue la respuesta,
 *   esa respuesta se descarta (por ejemplo, al cambiar filtros rápido).
 * - `funcion` puede devolver undefined para no pedir nada (por ejemplo, mientras falta un dato previo).
 * Devuelve { datos, cargando, error, reintentar }.
 */
export function usePeticion(funcion, dependencias) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    async function cargar() {
      setEstado((previo) => ({ ...previo, cargando: true, error: null }));
      try {
        const promesa = funcion();
        if (promesa === undefined) {
          if (vigente) setEstado({ datos: null, cargando: false, error: null });
          return;
        }
        const datos = await promesa;
        if (vigente) setEstado({ datos, cargando: false, error: null });
      } catch (error) {
        if (vigente) setEstado((previo) => ({ ...previo, cargando: false, error }));
      }
    }

    cargar();
    return () => {
      vigente = false;
    };
    // Las dependencias las define quien llama, igual que en useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...estado, reintentar };
}

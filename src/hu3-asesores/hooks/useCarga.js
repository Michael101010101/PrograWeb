import { useCallback, useEffect, useState } from 'react';

/**
 * Hook genérico para pedir datos a la API (useEffect + async/await).
 *   const { datos, cargando, error, recargar } = useCarga(() => servicio.obtenerX(), [dependencias]);
 * - Pide al montar la página y otra vez cuando cambian las dependencias (filtros, página, código…).
 * - recargar(): vuelve a pedir después de una acción (aceptar, rechazar, guardar…).
 * - Mientras recarga, conserva los datos anteriores para que la pantalla no parpadee.
 * - activo = false: no pide nada (por ejemplo, el visitante sin sesión no tiene "Mi solicitud").
 */
export default function useCarga(cargar, dependencias, activo = true) {
  const [version, setVersion] = useState(0);
  // Identifica la petición actual: cambia si cambian las dependencias o si se pide recargar
  const clave = JSON.stringify([...dependencias, version]);
  // Resultado de la última respuesta que llegó, con la clave de la petición que la produjo
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });

  useEffect(() => {
    if (!activo) return undefined;
    // Si cambian los filtros o se sale de la página antes de que llegue la respuesta,
    // esa respuesta vieja se ignora (evita mostrar resultados de un filtro anterior).
    let vigente = true;
    async function pedir() {
      try {
        const datos = await cargar();
        if (vigente) setResultado({ clave, datos, error: null });
      } catch (error) {
        if (vigente) setResultado((anterior) => ({ clave, datos: anterior.datos, error }));
      }
    }
    pedir();
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, activo]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return {
    datos: resultado.datos,
    error: resultado.error,
    // Está cargando mientras la última respuesta no corresponda a la petición actual
    cargando: activo && resultado.clave !== clave,
    recargar,
  };
}

import { useEffect, useState } from 'react';

/** Devuelve `valor` solo después de que deja de cambiar por `milisegundos` (para la búsqueda). */
export function useRetardo(valor, milisegundos = 400) {
  const [retrasado, setRetrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setRetrasado(valor), milisegundos);
    return () => clearTimeout(temporizador);
  }, [valor, milisegundos]);

  return retrasado;
}

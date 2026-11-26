import { useEffect, useState } from 'react';
import { obtenerCatalogos } from '../services/trabajoService.js';

export default function useLineas() {
  const [lineas, setLineas] = useState([]);
  useEffect(() => {
    let activo = true;
    obtenerCatalogos()
      .then((c) => activo && setLineas(c.lineas))
      .catch(() => activo && setLineas([]));
    return () => {
      activo = false;
    };
  }, []);
  return lineas;
}
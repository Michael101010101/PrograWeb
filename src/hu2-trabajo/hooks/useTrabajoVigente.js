import { useEffect, useState } from 'react';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { resumenTrabajoVigente } from '../services/trabajoService.js';

export default function useTrabajoVigente() {
  const { usuario } = useAuth();
  const esEstudiante = usuario?.rol === 'estudiante';
  const [trabajo, setTrabajo] = useState(undefined);

  useEffect(() => {
    if (!esEstudiante) return undefined;
    let activo = true;
    resumenTrabajoVigente()
      .then((t) => activo && setTrabajo(t))
      .catch(() => activo && setTrabajo(null));
    return () => {
      activo = false;
    };
  }, [esEstudiante, usuario?.id]);

  return esEstudiante ? trabajo : null;
}
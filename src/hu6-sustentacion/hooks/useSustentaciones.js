import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { api } from '../../shared/api.js';
import { DATOS_SEMILLA } from '../data/datosSemilla.js';

// HU-6 entrega final: el servidor PostgreSQL es la única fuente de verdad.

export default function useSustentaciones() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(() => ({ ...DATOS_SEMILLA, trabajos: [], sustentaciones: [], reservas: [] }));
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const recargar = useCallback(async () => {
    const nuevos = await api('/hu6/datos');
    setDatos(nuevos);
    setErrorCarga('');
    return nuevos;
  }, []);

  useEffect(() => {
    let activo = true;
    if (!usuario?.id) return;
    // La llamada es al servidor. Ninguna operación escribe en localStorage.
    const cargar = async () => {
      setCargando(true);
      try {
        const nuevos = await api('/hu6/datos');
        if (activo) { setDatos(nuevos); setErrorCarga(''); }
      } catch (error) {
        if (activo) setErrorCarga(error.message);
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, [usuario?.id]);

  const ejecutar = async (ruta, metodo, body) => {
    const resultado = await api(`/hu6${ruta}`, { method: metodo, body });
    await recargar();
    return resultado;
  };

  return {
    datos, cargando, errorCarga, recargar,
    programar: async (form) => (await ejecutar('/sustentaciones', 'POST', form)).id,
    reprogramar: (id, form) => ejecutar(`/sustentaciones/${encodeURIComponent(id)}/reprogramar`, 'PATCH', form),
    guardarJurado: (id, jurado) => ejecutar(`/sustentaciones/${encodeURIComponent(id)}/jurado`, 'PUT', { jurado }),
    guardarBorrador: (id, acta) => ejecutar(`/sustentaciones/${encodeURIComponent(id)}/acta/borrador`, 'PUT', acta),
    registrarActa: (id, acta) => ejecutar(`/sustentaciones/${encodeURIComponent(id)}/acta/registrar`, 'POST', acta),
  };
}

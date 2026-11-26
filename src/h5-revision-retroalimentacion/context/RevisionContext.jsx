import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { RevisionContext } from './revisionContext.js';
import { cargarDatosRevision, enviarAccion } from '../services/revisionApi.js';
import { adaptarHu4 } from '../services/adaptador.js';
import { puedeVerTrabajo, validarAccion } from '../services/revisionService.js';

const VACIO = { trabajos: [], entregables: [], avances: [] };

// HU-5 · Los datos vienen del API (/api/revision), no del navegador.
// Expone lo mismo que antes ({ datos, usuario, error, ejecutar }) para que las pantallas y HU-2 no cambien.
export function RevisionProvider({ children }) {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState({ datos: VACIO, cargando: true, error: null });

  const cargar = useCallback(async () => {
    try {
      const crudo = await cargarDatosRevision();
      setEstado({ datos: adaptarHu4(crudo), cargando: false, error: null });
    } catch (err) {
      setEstado((previo) => ({ ...previo, cargando: false, error: err.message || 'No se pudieron cargar los datos de revisión.' }));
    }
  }, []);

  // Carga al entrar y cada vez que vuelves a la pestaña (así ves lo que hizo la otra persona).
  useEffect(() => {
    cargar();
    window.addEventListener('focus', cargar);
    return () => window.removeEventListener('focus', cargar);
  }, [cargar, usuario?.id]);

  const valor = useMemo(() => {
    const trabajos = estado.datos.trabajos.filter((t) => puedeVerTrabajo(usuario, t));
    const entregables = estado.datos.entregables.filter((e) => trabajos.some((t) => t.codigo === e.trabajoCodigo));
    const avances = estado.datos.avances.filter((a) => entregables.some((e) => e.id === a.entregableId));
    const datos = { trabajos, entregables, avances };
    return {
      datos,
      usuario,
      error: estado.error,
      async ejecutar(accion) {
        validarAccion(datos, usuario, accion); // mismos mensajes de siempre; el servidor vuelve a validar
        await enviarAccion(accion);
        await cargar();
      },
    };
  }, [estado, usuario, cargar]);

  if (estado.cargando) return <div className="h5 h5--incrustado" role="status">Cargando revisión…</div>;
  return <RevisionContext.Provider value={valor}>{children}</RevisionContext.Provider>;
}

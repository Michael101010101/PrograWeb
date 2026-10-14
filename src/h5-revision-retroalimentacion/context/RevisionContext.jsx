import { useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { RevisionContext } from './revisionContext.js';
import { repositorioRevision } from '../services/revisionRepository.js';
import { puedeVerTrabajo } from '../services/revisionService.js';
export function RevisionProvider({ children }) {
  const { usuario } = useAuth();
  const repositorio = repositorioRevision();
  const snapshot = useSyncExternalStore(repositorio.suscribir, repositorio.leer);
  const valor = useMemo(() => {
    const trabajos = snapshot.datos.trabajos.filter((t) => puedeVerTrabajo(usuario, t));
    const entregables = snapshot.datos.entregables.filter((e) => trabajos.some((t) => t.codigo === e.trabajoCodigo));
    const avances = snapshot.datos.avances.filter((a) => entregables.some((e) => e.id === a.entregableId));
    return { datos: { trabajos, entregables, avances }, usuario, error: snapshot.error,
      ejecutar: (accion) => repositorio.ejecutar(usuario, accion) };
  }, [snapshot, usuario, repositorio]);
  return <RevisionContext.Provider value={valor}>{children}</RevisionContext.Provider>;
}

import { useContext } from 'react';
import { RevisionContext } from '../context/revisionContext.js';
export function useRevision() {
  const valor = useContext(RevisionContext);
  if (!valor) throw new Error('useRevision debe usarse dentro de RevisionProvider.');
  return valor;
}

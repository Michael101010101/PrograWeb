import { createContext, useContext, useState } from 'react';
import { avancesPendientes } from '../data/avances.js';

const RevisionContext = createContext(null);

export function RevisionProvider({ children }) {
  const [avances, setAvances] = useState(avancesPendientes);

  const cambiarEstadoAvance = (id, nuevoEstado) => {
    setAvances((avancesActuales) =>
      avancesActuales.map((avance) =>
        avance.id === Number(id)
          ? { ...avance, estado: nuevoEstado }
          : avance
      )
    );
  };

  const agregarComentario = (id, nuevoComentario) => {
    setAvances((avancesActuales) =>
      avancesActuales.map((avance) =>
        avance.id === Number(id)
          ? {
              ...avance,
              comentarios: [
                ...(avance.comentarios || []),
                nuevoComentario,
              ],
            }
          : avance
      )
    );
  };

  return (
    <RevisionContext.Provider
      value={{
        avances,
        cambiarEstadoAvance,
        agregarComentario,
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
}

export function useRevision() {
  const contexto = useContext(RevisionContext);

  if (!contexto) {
    throw new Error(
      'useRevision debe usarse dentro de <RevisionProvider>'
    );
  }

  return contexto;
}
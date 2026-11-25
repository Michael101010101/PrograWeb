import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

// Datos generales que vienen del API y usan varias páginas:
//  - periodo: semestre, cronograma (etapas con estado) y contacto de la oficina  → GET /api/periodo
//  - catalogos: listas de los formularios (carreras, ciclos, grados, departamentos) → GET /api/catalogos
// Se cargan una sola vez al abrir la aplicación.

const PERIODO_VACIO = {
  semestre: '',
  totalEtapas: 0,
  etapaActual: null,
  etapas: [],
  contacto: { correo: '', anexo: '', mesaAyuda: '', direccion: '' },
};
const CATALOGOS_VACIOS = { carreras: [], ciclos: [], gradosAcademicos: [], departamentos: [] };

const DatosContext = createContext(null);

export function DatosProvider({ children }) {
  const [periodo, setPeriodo] = useState(PERIODO_VACIO);
  const [catalogos, setCatalogos] = useState(CATALOGOS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const [p, c] = await Promise.all([api('/periodo'), api('/catalogos')]);
        if (!activo) return;
        setPeriodo(p);
        setCatalogos(c);
      } catch (e) {
        if (activo) setError(e.message);
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  /** Texto del nav: "Semestre 2026-2 · etapa 4 de 5 en curso". */
  const textoNav = !periodo.semestre
    ? ''
    : periodo.etapaActual
      ? `Semestre ${periodo.semestre} · etapa ${periodo.etapaActual.numero} de ${periodo.totalEtapas} en curso`
      : `Semestre ${periodo.semestre}`;

  return (
    <DatosContext.Provider value={{ periodo, contacto: periodo.contacto, catalogos, textoNav, cargando, error }}>
      {children}
    </DatosContext.Provider>
  );
}

export function useDatos() {
  const ctx = useContext(DatosContext);
  if (!ctx) throw new Error('useDatos debe usarse dentro de <DatosProvider>');
  return ctx;
}

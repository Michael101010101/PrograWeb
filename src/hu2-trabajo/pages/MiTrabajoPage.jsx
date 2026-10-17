import { RevisionProvider } from '../../h5-revision-retroalimentacion/context/RevisionContext.jsx';
import TrabajoConsolidadoPage from '../../h5-revision-retroalimentacion/pages/TrabajoConsolidadoPage.jsx';
import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import TrabajoChip from '../components/TrabajoChip.jsx';
import CambiarEstadoModal from '../components/CambiarEstadoModal.jsx';
import * as trabajoService from '../services/trabajoService.js';
import FichaTrabajoPage from './FichaTrabajoPage.jsx';
import FichaPropuestaPage from './FichaPropuestaPage.jsx';
import FichaConcluidaPage from './FichaConcluidaPage.jsx';

const FICHAS = {
  propuesta: FichaPropuestaPage,
  en_desarrollo: FichaTrabajoPage,
  concluido: FichaConcluidaPage,
};

function infoEtapa(estado) {
  if (estado === 'propuesta') return 'Etapa 2 de 5 · asignación de asesores';
  if (estado === 'concluido') return 'Etapa 5 de 5 · sustentaciones';
  return PERIODO.etapaActual;
}

export default function MiTrabajoPage({ vistaFicha = false }) {
  const { usuario } = useAuth();
  const [trabajo, setTrabajo] = useState(undefined);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const cargar = useCallback(() => {
    trabajoService.obtenerMiTrabajo(usuario.id).then(({ trabajo: actual }) => setTrabajo(actual));
  }, [usuario.id]);

  useEffect(cargar, [cargar]);

  if (trabajo === null) return <Navigate to="/estudiante/mi-trabajo/registrar" replace />;

  const Ficha = trabajo && FICHAS[trabajo.estado];
  const puedeGestionar = Boolean(trabajo?.integrantes.some((i) => i.usuarioId === usuario.id && i.responsable));

  if (trabajo?.estado === 'en_desarrollo' && !vistaFicha) return (
    <RevisionProvider>
      <TrabajoConsolidadoPage codigo={trabajo.codigo} />
    </RevisionProvider>
  );

  return (
    <PageLayout
      headerSlot={<TrabajoChip />}
      navInfo={infoEtapa(trabajo?.estado)}
      footerDetalle={trabajo ? `${trabajo.codigo}${trabajo.estado === 'concluido' ? ' concluido' : ''}` : undefined}
    >
      {!trabajo ? (
        <div aria-busy="true" />
      ) : (
        <Ficha trabajo={trabajo} puedeGestionar={puedeGestionar} onCambiarEstado={() => setCambiandoEstado(true)} />
      )}

      {cambiandoEstado && (
        <CambiarEstadoModal
          trabajo={trabajo}
          onCerrar={() => setCambiandoEstado(false)}
          onCambiado={() => {
            setCambiandoEstado(false);
            cargar();
          }}
        />
      )}
    </PageLayout>
  );
}
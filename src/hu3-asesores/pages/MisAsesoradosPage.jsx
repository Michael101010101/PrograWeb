import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAsesorados, useMiFicha } from '../hooks/useAsesorias.js';
import * as servicio from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import AsesoradoCard from '../components/AsesoradoCard.jsx';
import TablaVencimientos from '../components/TablaVencimientos.jsx';
import ModalTerminarAsesoria from '../components/modales/ModalTerminarAsesoria.jsx';

/** 3.5 Mis asesorados · rol Asesor (diapositivas 25 y 29). Datos: GET /api/asesores/me/asesorados */
export default function MisAsesoradosPage() {
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const ficha = useMiFicha();
  const asesorados = useAsesorados();

  const [verTodos, setVerTodos] = useState(false);
  const [porTerminar, setPorTerminar] = useState(null); // trabajo del modal "Terminar asesoría"

  const trabajos = asesorados.datos?.trabajos ?? [];
  const vencimientos = asesorados.datos?.vencimientos ?? [];
  const porRevisar = asesorados.datos?.avancesPorRevisar ?? 0;
  const cupo = ficha.datos?.asesor.cupoDisponible ?? 0;

  // POST /api/asesores/me/asesorados/:codigo/terminar · libera el cupo; si el motivo no es válido, el modal muestra el error
  const confirmarTermino = async (motivo) => {
    await servicio.terminarAsesoria(porTerminar.codigo, motivo);
    setPorTerminar(null);
    mostrar({ tipo: 'exito', titulo: 'Asesoría terminada', mensaje: 'Se notificó al equipo y a la coordinación.' });
    asesorados.recargar();
    ficha.recargar();
  };

  const verSustentacion = () => {
    mostrar({ tipo: 'aviso', titulo: 'Sustentación pendiente', mensaje: 'La coordinación aún no la programa (HU-6).' });
  };

  let contenido;
  if (!asesorados.datos && asesorados.cargando) {
    contenido = <p className="text-muted" style={{ padding: 24 }}>Cargando asesorados…</p>;
  } else if (asesorados.error && !asesorados.datos) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
        <EmptyState icono="!" tono="warning" titulo="No pudimos cargar tus asesorados" texto={asesorados.error.message}>
          <button className="btn btn--outline" onClick={asesorados.recargar}>Reintentar</button>
        </EmptyState>
      </div>
    );
  } else if (trabajos.length === 0) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
        <EmptyState
          icono="✉"
          titulo="Aún no tienes asesorados"
          texto="Cuando aceptes una solicitud, el trabajo aparecerá aquí con su avance."
        >
          <button className="btn btn--outline" onClick={() => navigate('/asesor/solicitudes')}>Ver solicitudes</button>
        </EmptyState>
      </div>
    );
  } else {
    contenido = (
      <>
        <div className="hu3-asesorados">
          {trabajos.map((trabajo) => (
            <AsesoradoCard
              key={trabajo.codigo}
              trabajo={trabajo}
              onTerminar={setPorTerminar}
              onVerSustentacion={verSustentacion}
            />
          ))}
        </div>

        <TablaVencimientos
          titulo="Próximos vencimientos de mis asesorados"
          vencimientos={verTodos ? vencimientos : vencimientos.slice(0, 3)}
          accion={
            vencimientos.length > 3 && (
              <button className="link-button" style={{ fontWeight: 600, fontSize: 14 }} onClick={() => setVerTodos(!verTodos)}>
                {verTodos ? 'Ver menos' : 'Ver todos'}
              </button>
            )
          }
        />
      </>
    );
  }

  return (
    <PaginaAsesor
      ficha={ficha.datos}
      cargando={ficha.cargando}
      error={ficha.error}
      onReintentar={ficha.recargar}
      footerDetalle={`${trabajos.length} trabajos a cargo`}
    >
      <PageHead
        migas="Inicio · Mis asesorados"
        titulo="Mis asesorados"
        descripcion={`${trabajos.length} trabajos a cargo · ${porRevisar} avances pendientes de revisión`}
        acciones={
          <button className="btn btn--outline btn--lg" onClick={() => navigate('/asesor/revision')}>
            Ir a la bandeja de revisión
          </button>
        }
      />

      {contenido}

      {porTerminar && (
        <ModalTerminarAsesoria
          trabajo={porTerminar}
          cupo={cupo}
          onConfirmar={confirmarTermino}
          onCerrar={() => setPorTerminar(null)}
        />
      )}
    </PaginaAsesor>
  );
}

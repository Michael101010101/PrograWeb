import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAsesorado, useMiFicha } from '../hooks/useAsesorias.js';
import * as servicio from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import BarraProgreso from '../components/BarraProgreso.jsx';
import TablaVencimientos from '../components/TablaVencimientos.jsx';
import ModalTerminarAsesoria from '../components/modales/ModalTerminarAsesoria.jsx';

/**
 * Detalle de un trabajo a cargo ("Ver trabajo"). El código llega en la URL: /asesor/asesorados/:codigo
 * Datos: GET /api/asesores/me/asesorados/:codigo (el servidor responde 404 si el trabajo no es de este asesor).
 */
export default function DetalleAsesoradoPage() {
  const { codigo } = useParams();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const ficha = useMiFicha();
  const detalle = useAsesorado(codigo);
  const [modalAbierto, setModalAbierto] = useState(false);

  const trabajo = detalle.datos?.trabajo ?? null;
  const vencimientos = detalle.datos?.vencimientos ?? [];

  const confirmarTermino = async (motivo) => {
    await servicio.terminarAsesoria(codigo, motivo);
    mostrar({ tipo: 'exito', titulo: 'Asesoría terminada', mensaje: 'Se notificó al equipo y a la coordinación.' });
    navigate('/asesor/asesorados');
  };

  let contenido;
  if (detalle.cargando && !trabajo) {
    contenido = <p className="text-muted" style={{ padding: 24 }}>Cargando trabajo…</p>;
  } else if (!trabajo) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState
          icono="?"
          titulo="Trabajo no encontrado"
          texto={detalle.error?.status === 404 ? detalle.error.message : `No pudimos cargar el trabajo ${codigo}.`}
        >
          <Link to="/asesor/asesorados" className="btn btn--outline">Volver a Mis asesorados</Link>
        </EmptyState>
      </div>
    );
  } else {
    contenido = (
      <>
        <PageHead
          migas={`Inicio · Mis asesorados · ${trabajo.codigo}`}
          titulo={trabajo.titulo}
          descripcion={`${trabajo.linea}${trabajo.carrera ? ` · ${trabajo.carrera}` : ''} · código ${trabajo.codigo}`}
          acciones={
            <>
              <Link to="/asesor/asesorados" className="btn btn--outline">Volver</Link>
              {/* HU-4: enlace a la pantalla 4.2 "Definir el plan de entregables" */}
              <Link to={`/asesor/asesorados/${trabajo.codigo}/plan`} className="btn btn--primary">Plan de entregables</Link>
            </>
          }
        />

        <div className="card stack" style={{ marginBottom: 16 }}>
          <p className="text-label">Equipo</p>
          <p>{trabajo.integrantes.map((i) => i.nombre).join(', ')}</p>
          <p className="text-label" style={{ marginTop: 8 }}>Avance</p>
          <BarraProgreso valor={trabajo.avance} />
          {trabajo.nota && <p className={`hu3-tono--${trabajo.nota.tono}`}>{trabajo.nota.texto}</p>}
          {trabajo.estado !== 'concluido' && (
            <div>
              <button className="btn hu3-btn-terminar" onClick={() => setModalAbierto(true)}>Terminar asesoría</button>
            </div>
          )}
        </div>

        <TablaVencimientos titulo="Entregables del trabajo" vencimientos={vencimientos} />
      </>
    );
  }

  return (
    <PaginaAsesor
      ficha={ficha.datos}
      cargando={ficha.cargando}
      error={ficha.error}
      onReintentar={ficha.recargar}
      footerDetalle={`trabajo ${codigo}`}
    >
      {contenido}

      {modalAbierto && trabajo && (
        <ModalTerminarAsesoria
          trabajo={trabajo}
          cupo={ficha.datos?.asesor.cupoDisponible ?? 0}
          onConfirmar={confirmarTermino}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </PaginaAsesor>
  );
}

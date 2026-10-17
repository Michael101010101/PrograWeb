import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useAsesorias from '../hooks/useAsesorias.js';
import { asesorDeUsuario, cupoDisponible, vencimientosDeAsesor } from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import BarraProgreso from '../components/BarraProgreso.jsx';
import TablaVencimientos from '../components/TablaVencimientos.jsx';
import ModalTerminarAsesoria from '../components/modales/ModalTerminarAsesoria.jsx';

/** Detalle de un trabajo a cargo ("Ver trabajo"). El código llega en la URL: /asesor/asesorados/:codigo */
export default function DetalleAsesoradoPage() {
  const { codigo } = useParams();
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const { datos, terminar } = useAsesorias();
  const [modalAbierto, setModalAbierto] = useState(false);

  const asesor = asesorDeUsuario(datos, usuario.id);
  // Solo se muestra si el trabajo existe y está a cargo de este asesor.
  const trabajo = datos.trabajos.find((t) => t.codigo === codigo && t.asesorId === asesor?.id);
  const vencimientos = asesor ? vencimientosDeAsesor(datos, asesor.id).filter((v) => v.trabajoCodigo === codigo) : [];

  const confirmarTermino = (motivo) => {
    terminar(codigo, motivo);
    mostrar({ tipo: 'exito', titulo: 'Asesoría terminada', mensaje: 'Se notificó al equipo y a la coordinación.' });
    navigate('/asesor/asesorados');
  };

  return (
    <PaginaAsesor datos={datos} asesor={asesor} footerDetalle={`trabajo ${codigo}`}>
      {!trabajo ? (
        <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <EmptyState icono="?" titulo="Trabajo no encontrado" texto={`El trabajo ${codigo} no está a tu cargo.`}>
            <Link to="/asesor/asesorados" className="btn btn--outline">Volver a Mis asesorados</Link>
          </EmptyState>
        </div>
      ) : (
        <>
          <PageHead
            migas={`Inicio · Mis asesorados · ${trabajo.codigo}`}
            titulo={trabajo.titulo}
            descripcion={`${trabajo.linea}${trabajo.carrera ? ` · ${trabajo.carrera}` : ''} · código ${trabajo.codigo}`}
            acciones={<Link to="/asesor/asesorados" className="btn btn--outline">Volver</Link>}
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
      )}

      {modalAbierto && (
        <ModalTerminarAsesoria
          trabajo={trabajo}
          cupo={cupoDisponible(asesor)}
          onConfirmar={confirmarTermino}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </PaginaAsesor>
  );
}

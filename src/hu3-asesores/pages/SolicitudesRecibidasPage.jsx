import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useAsesorias from '../hooks/useAsesorias.js';
import { asesorDeUsuario, cupoDisponible, solicitudesDeAsesor } from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import SolicitudCard from '../components/SolicitudCard.jsx';
import ModalRechazarSolicitud from '../components/modales/ModalRechazarSolicitud.jsx';

/** 3.4 Solicitudes recibidas · rol Asesor (diapositivas 24 y 28). */
export default function SolicitudesRecibidasPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const { datos, aceptar, rechazar } = useAsesorias();

  const [pestana, setPestana] = useState('pendientes');
  const [porRechazar, setPorRechazar] = useState(null); // solicitud del modal de rechazo

  const asesor = asesorDeUsuario(datos, usuario.id);
  const todas = asesor ? solicitudesDeAsesor(datos, asesor.id) : [];
  const pendientes = todas.filter((s) => s.estado === 'pendiente');
  const resueltas = todas.filter((s) => s.estado !== 'pendiente');
  const cupo = asesor ? cupoDisponible(asesor) : 0;
  const lista = pestana === 'pendientes' ? pendientes : resueltas;

  const aceptarSolicitud = (solicitud) => {
    try {
      aceptar(solicitud.id);
      mostrar({ tipo: 'exito', titulo: 'Asesoría aceptada', mensaje: `«${solicitud.trabajo.titulo}» ahora está en Mis asesorados.` });
    } catch (e) {
      mostrar({ tipo: 'error', titulo: 'No se pudo aceptar', mensaje: e.message });
    }
  };

  const confirmarRechazo = (motivo) => {
    rechazar(porRechazar.id, motivo); // si el motivo no es válido lanza Error y el modal lo muestra
    setPorRechazar(null);
    mostrar({ tipo: 'exito', titulo: 'Solicitud rechazada', mensaje: 'El equipo verá el motivo en su bandeja.' });
  };

  return (
    <PaginaAsesor datos={datos} asesor={asesor} footerDetalle={`${pendientes.length} solicitudes pendientes`}>
      <PageHead
        migas="Inicio · Solicitudes recibidas"
        titulo="Solicitudes recibidas"
        descripcion={`${pendientes.length} solicitudes pendientes · aceptar ocupa un cupo de los ${cupo} disponibles`}
        acciones={
          <div className="hu3-pestanas" role="tablist">
            <button
              role="tab"
              aria-selected={pestana === 'pendientes'}
              className={`hu3-pestana ${pestana === 'pendientes' ? 'hu3-pestana--activa' : ''}`}
              onClick={() => setPestana('pendientes')}
            >
              Pendientes ({pendientes.length})
            </button>
            <button
              role="tab"
              aria-selected={pestana === 'resueltas'}
              className={`hu3-pestana ${pestana === 'resueltas' ? 'hu3-pestana--activa' : ''}`}
              onClick={() => setPestana('resueltas')}
            >
              Resueltas ({resueltas.length})
            </button>
          </div>
        }
      />

      {asesor && cupo === 0 && pestana === 'pendientes' && (
        <div className="card card--warning" style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 600 }}>Cupo completo · 0 de {asesor.cupoMaximo}</p>
          <p className="text-aux">
            Para aceptar una nueva solicitud debes terminar una asesoría vigente o pedir a la coordinación ampliar tu
            cupo máximo. El botón «Aceptar asesoría» queda deshabilitado.
          </p>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
          {pestana === 'pendientes' ? (
            <EmptyState
              icono="✉"
              titulo="Sin solicitudes pendientes"
              texto={`Tienes ${cupo} cupos disponibles. Los estudiantes te encontrarán en el directorio según tus líneas de investigación.`}
            >
              <button className="btn btn--outline" onClick={() => navigate('/asesor/ficha')}>Revisar mi ficha</button>
            </EmptyState>
          ) : (
            <EmptyState icono="✉" titulo="Sin solicitudes resueltas" texto="Aquí verás las solicitudes que aceptes o rechaces." />
          )}
        </div>
      ) : (
        <div className="hu3-lista">
          {lista.map((solicitud) => (
            <SolicitudCard
              key={solicitud.id}
              solicitud={solicitud}
              cupo={cupo}
              onAceptar={aceptarSolicitud}
              onRechazar={setPorRechazar}
            />
          ))}
        </div>
      )}

      {pestana === 'pendientes' && (
        <div className="hu3-nota">
          <span>
            Rechazar una solicitud exige un motivo que el estudiante verá en su bandeja. Las solicitudes sin responder
            en 7 días se marcan como demoradas en el tablero de la coordinación.
          </span>
          <button className="link-button" style={{ fontWeight: 600, whiteSpace: 'nowrap' }} onClick={() => setPestana('resueltas')}>
            Ver solicitudes resueltas
          </button>
        </div>
      )}

      {porRechazar && (
        <ModalRechazarSolicitud
          solicitud={porRechazar}
          onConfirmar={confirmarRechazo}
          onCerrar={() => setPorRechazar(null)}
        />
      )}
    </PaginaAsesor>
  );
}

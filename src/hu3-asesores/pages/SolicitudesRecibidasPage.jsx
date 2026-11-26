import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useBandeja, useMiFicha } from '../hooks/useAsesorias.js';
import * as servicio from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import SolicitudCard from '../components/SolicitudCard.jsx';
import ModalRechazarSolicitud from '../components/modales/ModalRechazarSolicitud.jsx';

/** 3.4 Solicitudes recibidas · rol Asesor (diapositivas 24 y 28). Datos: GET /api/asesores/me/solicitudes */
export default function SolicitudesRecibidasPage() {
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const ficha = useMiFicha();
  const bandeja = useBandeja();

  const [pestana, setPestana] = useState('pendientes');
  const [porRechazar, setPorRechazar] = useState(null); // solicitud del modal de rechazo
  const [aceptando, setAceptando] = useState(null); // id de la solicitud que se está aceptando

  const todas = bandeja.datos?.solicitudes ?? [];
  const pendientes = todas.filter((s) => s.estado === 'pendiente');
  const resueltas = todas.filter((s) => s.estado !== 'pendiente');
  const cupo = bandeja.datos?.cupoDisponible ?? 0;
  const lista = pestana === 'pendientes' ? pendientes : resueltas;

  // Después de aceptar o rechazar se vuelven a pedir la bandeja y la ficha (cupo y contadores del menú)
  const recargarTodo = () => {
    bandeja.recargar();
    ficha.recargar();
  };

  // PATCH /api/solicitudes/:id/aceptar · si ya no hay cupo, el servidor responde 409 y se muestra el mensaje
  const aceptarSolicitud = async (solicitud) => {
    setAceptando(solicitud.id);
    try {
      await servicio.aceptarSolicitud(solicitud.id);
      mostrar({ tipo: 'exito', titulo: 'Asesoría aceptada', mensaje: `«${solicitud.trabajo.titulo}» ahora está en Mis asesorados.` });
      recargarTodo();
    } catch (e) {
      mostrar({ tipo: 'error', titulo: 'No se pudo aceptar', mensaje: e.message });
    } finally {
      setAceptando(null);
    }
  };

  // PATCH /api/solicitudes/:id/rechazar · si el motivo no es válido, el error llega al modal y lo muestra
  const confirmarRechazo = async (motivo) => {
    await servicio.rechazarSolicitud(porRechazar.id, motivo);
    setPorRechazar(null);
    mostrar({ tipo: 'exito', titulo: 'Solicitud rechazada', mensaje: 'El equipo verá el motivo en su bandeja.' });
    recargarTodo();
  };

  let contenido;
  if (!bandeja.datos && bandeja.cargando) {
    contenido = <p className="text-muted" style={{ padding: 24 }}>Cargando solicitudes…</p>;
  } else if (bandeja.error && !bandeja.datos) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
        <EmptyState icono="!" tono="warning" titulo="No pudimos cargar tus solicitudes" texto={bandeja.error.message}>
          <button className="btn btn--outline" onClick={bandeja.recargar}>Reintentar</button>
        </EmptyState>
      </div>
    );
  } else if (lista.length === 0) {
    contenido = (
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
    );
  } else {
    contenido = (
      <div className="hu3-lista">
        {lista.map((solicitud) => (
          <SolicitudCard
            key={solicitud.id}
            solicitud={solicitud}
            cupo={cupo}
            procesando={aceptando === solicitud.id}
            onAceptar={aceptarSolicitud}
            onRechazar={setPorRechazar}
          />
        ))}
      </div>
    );
  }

  return (
    <PaginaAsesor
      ficha={ficha.datos}
      cargando={ficha.cargando}
      error={ficha.error}
      onReintentar={ficha.recargar}
      footerDetalle={`${pendientes.length} solicitudes pendientes`}
    >
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

      {bandeja.datos && cupo === 0 && pestana === 'pendientes' && (
        <div className="card card--warning" style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 600 }}>Cupo completo · 0 de {bandeja.datos.cupoMaximo}</p>
          <p className="text-aux">
            Para aceptar una nueva solicitud debes terminar una asesoría vigente o pedir a la coordinación ampliar tu
            cupo máximo. El botón «Aceptar asesoría» queda deshabilitado.
          </p>
        </div>
      )}

      {contenido}

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

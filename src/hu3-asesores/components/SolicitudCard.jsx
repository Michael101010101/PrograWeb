import { HOY, diasEntre, formatearFecha } from '../utils/fechas.js';

const BADGE_ESTADO = {
  pendiente: { clase: 'badge--warning', texto: 'Pendiente' },
  aceptada: { clase: 'badge--success', texto: 'Aceptada' },
  rechazada: { clase: 'badge--danger', texto: 'Rechazada' },
  retirada: { clase: 'badge--neutral', texto: 'Retirada por el estudiante' },
};

/**
 * Tarjeta de una solicitud recibida (3.4).
 * `cupo`: cupos disponibles del asesor; si es 0, "Aceptar asesoría" queda deshabilitado.
 */
export default function SolicitudCard({ solicitud, cupo, onAceptar, onRechazar }) {
  const { trabajo } = solicitud;
  const pendiente = solicitud.estado === 'pendiente';
  const badge = BADGE_ESTADO[solicitud.estado];
  const equipo = trabajo.equipo.map((e) => (e.responsable ? `${e.nombre} (responsable)` : e.nombre)).join(', ');
  const quedan = cupo - 1;

  return (
    <article className="card hu3-solicitud">
      <div className="hu3-solicitud__head">
        <h2 className="hu3-solicitud__titulo">{trabajo.titulo}</h2>
        <span className={`badge ${badge.clase}`}>{badge.texto}</span>
      </div>

      <p className="hu3-solicitud__meta">
        {trabajo.linea} · recibida el {formatearFecha(solicitud.fecha)}
        {pendiente && ` · ${diasEntre(solicitud.fecha, HOY)} días en espera`}
        {!pendiente && ` · resuelta el ${formatearFecha(solicitud.resueltaEl)}`} · código {trabajo.codigo}
      </p>
      <p className="hu3-solicitud__equipo">Equipo: {equipo}</p>
      <blockquote className="hu3-cita">«{solicitud.mensaje}»</blockquote>

      {solicitud.motivo && (
        <p className="hu3-solicitud__meta"><strong>Motivo del rechazo:</strong> {solicitud.motivo}</p>
      )}

      {pendiente && (
        <div className="hu3-solicitud__pie">
          <span>
            {cupo > 0
              ? `Al aceptar quedarás con ${quedan} ${quedan === 1 ? 'cupo disponible' : 'cupos disponibles'} y deberás definir el plan de entregables`
              : 'Cupo completo · no puedes aceptar nuevas solicitudes'}
          </span>
          <div className="hu3-solicitud__acciones">
            <button className="btn btn--danger-outline" onClick={() => onRechazar(solicitud)}>Rechazar</button>
            <button className="btn btn--primary" disabled={cupo === 0} onClick={() => onAceptar(solicitud)}>
              Aceptar asesoría
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

import { formatearFecha } from '../utils/fechas.js';

/** Recuadro con las ampliaciones que pidió el equipo y que la asesora debe responder (pantalla 4.2). */
export default function SolicitudesAmpliacion({ solicitudes, onResponder }) {
  if (solicitudes.length === 0) return null;
  return (
    <section className="card card--warning hu4-ampliaciones">
      <h2>Solicitudes de ampliación</h2>
      {solicitudes.map((s) => (
        <div key={s.id} className="hu4-ampliaciones__fila">
          <div>
            <p><strong>{s.entregable.orden}. {s.entregable.nombre}</strong></p>
            <p className="text-aux">
              Fecha límite {formatearFecha(s.entregable.fechaLimite)} → propone {formatearFecha(s.nuevaFecha)} · pedida el {formatearFecha(s.fecha)}
            </p>
            <p className="text-aux">«{s.motivo}»</p>
          </div>
          <div className="hu4-ampliaciones__acciones">
            <button className="btn btn--danger-outline" onClick={() => onResponder(s, false)}>Rechazar</button>
            <button className="btn btn--primary" onClick={() => onResponder(s, true)}>Aceptar</button>
          </div>
        </div>
      ))}
    </section>
  );
}

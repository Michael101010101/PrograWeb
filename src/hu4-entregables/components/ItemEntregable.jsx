import { Link } from 'react-router-dom';
import { EstadoBadge, PuntoEstado } from './EstadoEntregable.jsx';
import { formatearFecha, textoDias } from '../utils/fechas.js';

// Línea de detalle debajo del nombre, según el estado del entregable.
function detalle(e) {
  const limite = `Fecha límite ${formatearFecha(e.fechaLimite)}`;
  const ultimo = e.avances.at(-1);
  switch (e.estado) {
    case 'aprobado':
      return `${limite} · entregado el ${formatearFecha(ultimo.fecha)} · versión ${ultimo.version} aprobada el ${formatearFecha(ultimo.revision.fecha)}`;
    case 'vencido':
      return `${limite} · ${textoDias(-e.diasParaVencer)} de retraso · sin avances registrados`;
    case 'entregado':
    case 'con_retraso': {
      const retraso = ultimo.diasRetraso > 0 ? ` · ${textoDias(ultimo.diasRetraso)} de retraso` : '';
      return `${limite} · versión ${ultimo.version} entregada el ${formatearFecha(ultimo.fecha)}${retraso} · en revisión`;
    }
    case 'observado':
      return `${limite} · versión ${ultimo.version} observada el ${formatearFecha(ultimo.revision.fecha)}`;
    default:
      if (e.bloqueado) return `${limite} · se habilita al aprobar el entregable ${e.orden - 1}`;
      return `${limite} · ${e.diasParaVencer >= 0 ? `faltan ${textoDias(e.diasParaVencer)}` : 'vence hoy'}`;
  }
}

/**
 * Un entregable de la línea de tiempo (pantalla 4.1).
 * `onRegistrar` y `onAmpliar` abren los modales; `trato` es "tu asesora" o "tu asesor".
 */
export default function ItemEntregable({ entregable: e, trato, onRegistrar, onAmpliar }) {
  const ultimo = e.avances.at(-1);
  const meta = [`Peso ${e.peso}`, e.obligatorio ? 'obligatorio' : 'opcional'];
  if (e.avances.length > 1) meta.push(`versión ${ultimo.version}`);
  const vencido = e.estado === 'vencido';

  return (
    <li className={`hu4-item ${vencido ? 'hu4-item--vencido' : ''} ${e.bloqueado ? 'hu4-item--bloqueado' : ''}`}>
      <PuntoEstado estado={e.estado} />

      <div className="hu4-item__cuerpo">
        <div className="hu4-item__meta">
          <EstadoBadge estado={e.estado} />
          <span>{meta.join(' · ')}</span>
        </div>
        <h3 className="hu4-item__nombre">{e.orden}. {e.nombre}</h3>
        <p className="hu4-item__detalle">{detalle(e)}</p>

        {e.estado === 'observado' && ultimo.revision?.comentario && (
          <p className="hu4-item__nota">«{ultimo.revision.comentario}» Corrige y registra una nueva versión.</p>
        )}
        {vencido && (
          <p className="hu4-item__nota">Debes registrar el avance cuanto antes; {trato} ve el retraso en su bandeja.</p>
        )}
        {e.ampliacionPendiente && (
          <p className="hu4-item__nota">
            Ampliación solicitada hasta el {formatearFecha(e.ampliacionPendiente.nuevaFecha)} · esperando respuesta de {trato}.
          </p>
        )}
      </div>

      <div className="hu4-item__acciones">
        {e.bloqueado && <span className="text-muted hu4-item__bloqueado">Bloqueado</span>}
        {!e.bloqueado && e.avances.length > 0 && !e.puedeRegistrar && (
          <Link to="/estudiante/retroalimentacion">Ver historial</Link>
        )}
        {e.puedeRegistrar && (
          <button className={`btn ${vencido ? 'btn--danger' : 'btn--primary'}`} onClick={() => onRegistrar(e)}>
            {e.estado === 'observado' ? 'Registrar nueva versión' : 'Registrar avance'}
          </button>
        )}
        {vencido && e.puedeRegistrar && !e.ampliacionPendiente && (
          <button className="btn btn--danger-outline" onClick={() => onAmpliar(e)}>Solicitar ampliación</button>
        )}
      </div>
    </li>
  );
}

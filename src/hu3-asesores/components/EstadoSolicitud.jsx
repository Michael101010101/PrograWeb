import Alert from '../../shared/components/Alert.jsx';
import { buscarAsesor, nombreAsesor, ultimaSolicitud, ultimoTermino } from '../services/asesoriasService.js';
import { HOY, diasEntre, formatearFecha } from '../utils/fechas.js';

/**
 * "Mi solicitud" · rol Estudiante (arriba del directorio).
 * Muestra en qué quedó la última solicitud del trabajo: pendiente, aceptada,
 * rechazada (con el motivo que escribió el asesor) o asesoría terminada.
 * Si nunca envió una solicitud, no muestra nada.
 */
export default function EstadoSolicitud({ datos, trabajo, onRetirar }) {
  const solicitud = ultimaSolicitud(datos, trabajo.codigo);
  if (!solicitud) return null;

  const asesor = buscarAsesor(datos, solicitud.asesorId);
  const nombre = asesor ? nombreAsesor(asesor) : 'el asesor';
  const termino = ultimoTermino(datos, trabajo.codigo);

  let contenido;
  if (solicitud.estado === 'pendiente') {
    contenido = (
      <Alert tipo="warning" titulo="Solicitud pendiente.">
        Enviaste tu solicitud a {nombre} el {formatearFecha(solicitud.fecha)} ({diasEntre(solicitud.fecha, HOY)} días en espera).
        Mientras esté pendiente no puedes solicitar a otro asesor.{' '}
        <button type="button" className="link-button" style={{ fontWeight: 600 }} onClick={onRetirar}>Retirar solicitud</button>
      </Alert>
    );
  } else if (solicitud.estado === 'aceptada' && trabajo.asesorId) {
    contenido = (
      <Alert tipo="success" titulo="Asesoría aceptada.">
        {nombre} aceptó tu solicitud el {formatearFecha(solicitud.resueltaEl)}. Ya es el asesor de tu trabajo.
      </Alert>
    );
  } else if (solicitud.estado === 'aceptada' && termino) {
    contenido = (
      <Alert tipo="error" titulo="Asesoría terminada.">
        {nombre} terminó la asesoría el {formatearFecha(termino.fecha)}. Motivo: «{termino.motivo}». Puedes solicitar a otro asesor.
      </Alert>
    );
  } else if (solicitud.estado === 'rechazada') {
    contenido = (
      <Alert tipo="error" titulo="Solicitud rechazada.">
        {nombre} rechazó tu solicitud el {formatearFecha(solicitud.resueltaEl)}. Motivo: «{solicitud.motivo}». Puedes solicitar a otro asesor.
      </Alert>
    );
  } else if (solicitud.estado === 'retirada') {
    contenido = (
      <Alert tipo="info">
        Retiraste tu solicitud a {nombre} el {formatearFecha(solicitud.resueltaEl)}. Puedes solicitar a otro asesor.
      </Alert>
    );
  } else {
    return null;
  }

  return (
    <section className="hu3-mi-solicitud" aria-label="Estado de mi solicitud">
      <p className="text-label" style={{ marginBottom: 8 }}>Mi solicitud</p>
      {contenido}
    </section>
  );
}

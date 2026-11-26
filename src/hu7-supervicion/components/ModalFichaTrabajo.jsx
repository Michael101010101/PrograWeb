import Modal from '../../shared/components/Modal.jsx';
import EstadoVista from './EstadoVista.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import { obtenerTrabajo } from '../api/clienteApiHu7.js';
import {
  CLASE_ESTADO_TRABAJO,
  ETIQUETA_ESTADO_SUSTENTACION,
  formatearFecha,
  formatearHora,
  textoONulo,
} from '../utils/formatoHu7.js';
import '../CargaAsesores.css';
import '../TableroAdmin.css';
import '../TrabajosAdmin.css';

const ETIQUETA_ESTADO_ENTREGABLE = {
  pendiente: 'Pendiente',
  entregado: 'Entregado',
  entregado_con_retraso: 'Entregado con retraso',
  observado: 'Observado',
  aprobado: 'Aprobado',
};

const ETIQUETA_ESTADO_ASESORIA = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  finalizada: 'Finalizada',
};

const ETIQUETA_RESULTADO = { aprobado: 'Aprobado', observado: 'Observado' };
const ETIQUETA_MODALIDAD = { presencial: 'Presencial', virtual: 'Virtual' };

/** Texto del último avance de un entregable: versión, fecha y resultado (o «sin revisar»). */
function textoUltimoAvance(avance) {
  if (!avance) return '—';
  const resultado = avance.resultado ? ETIQUETA_RESULTADO[avance.resultado] ?? avance.resultado : 'Sin revisar';
  return `v${avance.version} · ${formatearFecha(avance.fechaEntrega)} · ${resultado}`;
}

/** Ficha de detalle de un trabajo, pedida al API cada vez que se abre. */
export default function ModalFichaTrabajo({ trabajoId, etiquetaEstado, alCerrar }) {
  const peticion = usePeticion(() => obtenerTrabajo(trabajoId), [trabajoId]);
  const t = peticion.datos;

  return (
    <Modal
      abierto
      ancho="wide"
      onCerrar={alCerrar}
      titulo={t ? t.titulo : 'Ficha del trabajo'}
      acciones={
        <button type="button" className="btn btn--ghost" onClick={alCerrar}>Volver</button>
      }>
      <EstadoVista cargando={peticion.cargando} error={peticion.error} alReintentar={peticion.reintentar}>
        {t && (
          <>
            <dl className="hu7-detalle-lista">
              <dt>Código</dt><dd>{t.codigo}</dd>
              <dt>Estado</dt>
              <dd>
                <span className={`hu7-estado ${CLASE_ESTADO_TRABAJO[t.estado] ?? ''}`}>{etiquetaEstado(t.estado)}</span>
                {t.motivoEstado && <span className="field__hint"> · {t.motivoEstado}</span>}
              </dd>
              <dt>Carrera</dt><dd>{textoONulo(t.carrera)}</dd>
              <dt>Línea</dt><dd>{textoONulo(t.linea?.nombre)}</dd>
              <dt>Periodo</dt><dd>{textoONulo(t.periodo?.semestre)}</dd>
              <dt>Registro</dt><dd>{formatearFecha(t.fechaRegistro)}</dd>
              <dt>Avance</dt><dd>{t.avance}%</dd>
              <dt>Asesor</dt>
              <dd>
                {t.asesor
                  ? `${t.asesor.gradoAcademico ? `${t.asesor.gradoAcademico} ` : ''}${t.asesor.nombre} · ${t.asesor.correo}`
                  : <span className="hu7-sin-asesor">Sin asesor</span>}
              </dd>
              <dt>Palabras clave</dt><dd>{t.palabrasClave.length ? t.palabrasClave.join(', ') : '—'}</dd>
            </dl>

            <h3 className="hu7-detalle-subtitulo">Resumen</h3>
            <p>{textoONulo(t.resumen)}</p>

            <h3 className="hu7-detalle-subtitulo">Objetivos</h3>
            <p>{textoONulo(t.objetivos)}</p>

            <h3 className="hu7-detalle-subtitulo">Equipo</h3>
            <EstadoVista vacio={t.equipo.length === 0} tituloVacio="Sin integrantes registrados">
              <div className="hu7-tabla-scroll">
                <table className="hu7-tabla-asesores">
                  <thead>
                    <tr><th>Integrante</th><th>Código</th><th>Carrera</th><th>Rol</th></tr>
                  </thead>
                  <tbody>
                    {t.equipo.map((i) => (
                      <tr key={i.id}>
                        <td>{i.nombreCompleto}</td>
                        <td>{textoONulo(i.codigo)}</td>
                        <td>{textoONulo(i.carrera)}</td>
                        <td>{i.esResponsable ? 'Responsable' : 'Integrante'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EstadoVista>

            <h3 className="hu7-detalle-subtitulo">Entregables</h3>
            <EstadoVista vacio={t.entregables.length === 0} tituloVacio="Sin entregables" textoVacio="El trabajo aún no tiene un plan de entregables.">
              <div className="hu7-tabla-scroll">
                <table className="hu7-tabla-asesores">
                  <thead>
                    <tr><th>Entregable</th><th>Peso</th><th>Estado</th><th>Límite</th><th>Último avance</th></tr>
                  </thead>
                  <tbody>
                    {t.entregables.map((e) => (
                      <tr key={e.id}>
                        <td>{e.nombre}{e.obligatorio ? '' : ' (opcional)'}</td>
                        <td>{e.peso}%</td>
                        <td>
                          {ETIQUETA_ESTADO_ENTREGABLE[e.estado] ?? e.estado}
                          {e.vencido && <> <span className="badge-vencido">Vencido</span></>}
                        </td>
                        <td>{formatearFecha(e.fechaLimite)}</td>
                        <td>{textoUltimoAvance(e.ultimoAvance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EstadoVista>

            <h3 className="hu7-detalle-subtitulo">Sustentación</h3>
            <EstadoVista vacio={!t.sustentacion} tituloVacio="Sin sustentación programada">
              {t.sustentacion && (
                <dl className="hu7-detalle-lista">
                  <dt>Fecha</dt><dd>{formatearFecha(t.sustentacion.fecha)} · {formatearHora(t.sustentacion.hora)}</dd>
                  <dt>Modalidad</dt><dd>{ETIQUETA_MODALIDAD[t.sustentacion.modalidad] ?? t.sustentacion.modalidad}</dd>
                  <dt>Sala</dt><dd>{textoONulo(t.sustentacion.sala)}</dd>
                  <dt>Estado</dt><dd>{ETIQUETA_ESTADO_SUSTENTACION[t.sustentacion.estado] ?? t.sustentacion.estado}</dd>
                  <dt>Calificación</dt><dd>{textoONulo(t.sustentacion.calificacion)}</dd>
                  <dt>Jurado</dt>
                  <dd>
                    {t.sustentacion.jurado.length
                      ? t.sustentacion.jurado.map((j) => (j.cargo ? `${j.nombre} (${j.cargo})` : j.nombre)).join(', ')
                      : '—'}
                  </dd>
                </dl>
              )}
            </EstadoVista>

            <h3 className="hu7-detalle-subtitulo">Historial de asesorías</h3>
            <EstadoVista vacio={t.asesorias.length === 0} tituloVacio="Sin solicitudes de asesoría">
              <div className="hu7-tabla-scroll">
                <table className="hu7-tabla-asesores">
                  <thead>
                    <tr><th>Asesor</th><th>Estado</th><th>Solicitud</th><th>Inicio</th><th>Fin</th></tr>
                  </thead>
                  <tbody>
                    {t.asesorias.map((a) => (
                      <tr key={a.id}>
                        <td>{textoONulo(a.asesor?.nombre)}</td>
                        <td>{ETIQUETA_ESTADO_ASESORIA[a.estado] ?? a.estado}</td>
                        <td>{formatearFecha(a.fechaSolicitud)}</td>
                        <td>{formatearFecha(a.fechaInicio)}</td>
                        <td>{formatearFecha(a.fechaFin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EstadoVista>
          </>
        )}
      </EstadoVista>
    </Modal>
  );
}

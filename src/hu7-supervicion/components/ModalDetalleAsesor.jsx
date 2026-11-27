import Modal from '../../shared/components/Modal.jsx';
import EstadoVista from './EstadoVista.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import { obtenerAsesor } from '../api/clienteApiHu7.js';
import { textoONulo } from '../utils/formatoHu7.js';
import { nombreConGrado, plural } from '../utils/cargaAsesores.js';

const ORIGEN_CUPO = { perfil: 'perfil del asesor', periodo: 'ampliación del periodo' };

/** Ficha de carga del asesor, pedida al API cada vez que se abre. */
export default function ModalDetalleAsesor({ asesorId, alCerrar, alEscribir, alAmpliar }) {
  const peticion = usePeticion(() => obtenerAsesor(asesorId), [asesorId]);
  const a = peticion.datos;

  return (
    <Modal
      abierto
      ancho="wide"
      onCerrar={alCerrar}
      titulo={a ? nombreConGrado(a) : 'Detalle del asesor'}
      acciones={
        a && (
          <>
            <button type="button" className="btn btn--ghost" onClick={alCerrar}>Volver</button>
            <button type="button" className="btn btn--outline" onClick={() => alEscribir(a)} disabled={a.estado === 'bloqueado'}>
              Escribir al asesor
            </button>
            <button type="button" className="btn btn--primary" onClick={() => alAmpliar(a)} disabled={a.estado !== 'activo'}>
              Ampliar cupo
            </button>
          </>
        )
      }>
      <EstadoVista cargando={peticion.cargando} error={peticion.error} alReintentar={peticion.reintentar}>
        {a && (
          <>
            <dl className="hu7-detalle-lista">
              <dt>Departamento</dt><dd>{textoONulo(a.departamento)}</dd>
              <dt>Correo</dt><dd>{a.correo}</dd>
              <dt>Líneas</dt><dd>{a.lineas.length ? a.lineas.join(', ') : '—'}</dd>
              <dt>Cupo ocupado</dt>
              <dd>
                {a.trabajosACargo}/{textoONulo(a.cupoMaximo)}
                {a.cupoOrigen && <span className="field__hint"> · según {ORIGEN_CUPO[a.cupoOrigen] ?? a.cupoOrigen}</span>}
              </dd>
              <dt>Disponible</dt><dd>{textoONulo(a.cupoDisponible)}</dd>
              <dt>Por revisar</dt><dd>{plural(a.avancesPorRevisar, 'avance', 'avances')}</dd>
              <dt>Tiempo de revisión</dt><dd>{textoONulo(a.tiempoRevisionPromedioDias, ' días')}</dd>
              <dt>Experiencia</dt><dd>{textoONulo(a.experiencia)}</dd>
            </dl>

            <h3 className="hu7-detalle-subtitulo">Trabajos a cargo</h3>
            <EstadoVista vacio={a.trabajos.length === 0} tituloVacio="Sin trabajos a cargo" textoVacio="El asesor no tiene asesorías vigentes.">
              <div className="hu7-tabla-scroll">
                <table className="hu7-tabla-asesores">
                  <thead>
                    <tr><th>Código</th><th>Título</th><th>Avance</th></tr>
                  </thead>
                  <tbody>
                    {a.trabajos.map((t) => (
                      <tr key={t.id}>
                        <td>{t.codigo}</td>
                        <td>{t.titulo}</td>
                        <td>{t.avance}%</td>
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

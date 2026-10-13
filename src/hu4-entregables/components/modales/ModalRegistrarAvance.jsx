import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { HOY, diasEntre, formatearFecha, textoDias } from '../../utils/fechas.js';

const MAXIMO = 600;

/**
 * Modal 4.3 "Registrar avance". Tiene dos variantes según la fecha:
 *  a tiempo     -> aviso verde y botón "Registrar avance"
 *  con retraso  -> aviso ámbar, chip con los días y botón "Registrar con retraso"
 * `onConfirmar` recibe { enlace, descripcion }; si el servicio lanza un Error, se muestra aquí.
 */
export default function ModalRegistrarAvance({ entregable, trato, onConfirmar, onCerrar }) {
  const [enlace, setEnlace] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const version = entregable.avances.length + 1; // se calcula sola, el estudiante no la escribe
  const dias = diasEntre(HOY, entregable.fechaLimite); // negativo = días de retraso
  const conRetraso = dias < 0;
  const limite = formatearFecha(entregable.fechaLimite);

  const enviar = (evento) => {
    evento.preventDefault();
    try {
      onConfirmar({ enlace, descripcion });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="wide"
      titulo={
        <>
          Registrar avance
          <span className="hu4-modal__sub">{entregable.orden}. {entregable.nombre} · versión {version}</span>
        </>
      }
    >
      <form id="form-avance" className="stack" onSubmit={enviar} noValidate>
        {conRetraso ? (
          <Alert tipo="warning">
            Entrega con retraso: la fecha límite fue el {limite}, hace {textoDias(-dias)}. El entregable quedará marcado
            como «Entregado con retraso» y {trato} verá la diferencia de días.
          </Alert>
        ) : (
          <div className="hu4-aviso-ok">
            Entrega a tiempo · la fecha límite es el {limite} y {dias === 0 ? 'vence hoy' : `faltan ${textoDias(dias)}`}.
          </div>
        )}

        {error && <Alert tipo="error">{error}</Alert>}

        <div className="field">
          <label className="field__label" htmlFor="avance-enlace">Enlace al documento</label>
          <input
            id="avance-enlace"
            className="input"
            type="url"
            placeholder="https://drive.google.com/…"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
          />
          <span className="field__hint">Debe tener permiso de lectura para {trato}</span>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="avance-descripcion">Descripción de lo entregado</label>
          <textarea
            id="avance-descripcion"
            className="textarea"
            maxLength={MAXIMO}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <span className="field__hint hu4-contador">
            <span>{version > 1 ? 'Indica qué cambió respecto a la versión anterior' : 'Resume qué contiene esta versión'}</span>
            <span>{descripcion.length} / {MAXIMO}</span>
          </span>
        </div>

        <div className="hu4-version">
          <div>
            <p className="text-label">Versión</p>
            <p className="hu4-version__numero">{version}</p>
          </div>
          {conRetraso ? (
            <span className="hu4-badge hu4-badge--warning">{textoDias(-dias)} de retraso</span>
          ) : (
            <p className="text-aux text-muted hu4-version__nota">
              Calculada automáticamente
              <br />
              {version === 1 ? 'Primer avance de este entregable' : `Reemplaza a la versión ${version - 1} observada`}
            </p>
          )}
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className={`btn ${conRetraso ? 'btn--warning' : 'btn--primary'}`}>
            {conRetraso ? 'Registrar con retraso' : 'Registrar avance'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { useDatos } from '../../../shared/context/DatosContext.jsx';
import { HOY, formatearFecha, semestreDe } from '../../utils/fechas.js';

/** Modal "Solicitar ampliación": el estudiante propone una nueva fecha límite y explica el motivo. */
export default function ModalSolicitarAmpliacion({ entregable, trato, onConfirmar, onCerrar }) {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const semestre = semestreDe(useDatos().periodo); // límites del semestre desde la API (HU-1)

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await onConfirmar({ nuevaFecha, motivo });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={
        <>
          Solicitar ampliación
          <span className="hu4-modal__sub">{entregable.orden}. {entregable.nombre}</span>
        </>
      }
    >
      <form className="stack" onSubmit={enviar} noValidate>
        <p className="text-muted">
          La fecha límite actual es el {formatearFecha(entregable.fechaLimite)}. Tu solicitud le llega a {trato}, que
          puede aceptarla o rechazarla.
        </p>
        {error && <Alert tipo="error">{error}</Alert>}

        <div className="field">
          <label className="field__label" htmlFor="ampliacion-fecha">Nueva fecha propuesta</label>
          <input
            id="ampliacion-fecha"
            className="input"
            type="date"
            min={HOY}
            max={semestre.fin}
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="ampliacion-motivo">Motivo</label>
          <textarea
            id="ampliacion-motivo"
            className="textarea"
            maxLength={400}
            placeholder="Explica por qué necesitas más tiempo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <span className="field__hint">Mínimo 20 caracteres</span>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar solicitud'}</button>
        </div>
      </form>
    </Modal>
  );
}

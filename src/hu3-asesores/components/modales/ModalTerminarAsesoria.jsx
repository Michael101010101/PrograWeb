import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';

/** 3.5 Terminar asesoría · rol Asesor (diapositiva 29). El motivo es obligatorio. */
export default function ModalTerminarAsesoria({ trabajo, cupo, onConfirmar, onCerrar }) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  const confirmar = () => {
    try {
      onConfirmar(motivo);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Terminar la asesoría"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn--danger" disabled={motivo.trim() === ''} onClick={confirmar}>Terminar asesoría</button>
        </>
      }
    >
      <p>
        El trabajo «{trabajo.titulo}» quedará sin asesor y su plan de entregables se detendrá hasta que otro asesor
        acepte.
      </p>
      <div className="field">
        <label className="field__label" htmlFor="hu3-motivo-termino">Motivo (obligatorio)</label>
        <textarea
          id="hu3-motivo-termino"
          className={`textarea ${error ? 'input--error' : ''}`}
          placeholder="Explica el motivo para la coordinación..."
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            setError('');
          }}
        />
        {error && <span className="field__error" role="alert">{error}</span>}
      </div>
      <Alert tipo="error">
        Se notificará al equipo y a la coordinación. Tu cupo pasará de {cupo} a {cupo + 1} disponibles.
      </Alert>
    </Modal>
  );
}

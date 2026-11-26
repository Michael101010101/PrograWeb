import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';

/** Rechazar una solicitud · rol Asesor. El motivo es obligatorio (el estudiante lo verá). */
export default function ModalRechazarSolicitud({ solicitud, onConfirmar, onCerrar }) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // La página llama a la API; si el servidor rechaza el motivo (400), se muestra su mensaje
  const confirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(motivo);
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Rechazar la solicitud"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn--danger" disabled={motivo.trim() === '' || enviando} onClick={confirmar}>
            {enviando ? 'Rechazando…' : 'Rechazar solicitud'}
          </button>
        </>
      }
    >
      <p>
        El equipo de «{solicitud.trabajo.titulo}» verá el motivo en su bandeja y podrá solicitar a otro asesor.
      </p>
      <div className="field">
        <label className="field__label" htmlFor="hu3-motivo-rechazo">Motivo (obligatorio)</label>
        <textarea
          id="hu3-motivo-rechazo"
          className={`textarea ${error ? 'input--error' : ''}`}
          placeholder="Explica el motivo al estudiante..."
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            setError('');
          }}
        />
        {error && <span className="field__error" role="alert">{error}</span>}
      </div>
    </Modal>
  );
}

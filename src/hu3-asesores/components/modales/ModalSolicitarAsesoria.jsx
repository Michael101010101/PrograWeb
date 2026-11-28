import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';

const MAXIMO = 600;

/** 3.3 Solicitar asesoría · rol Estudiante (diapositiva 26). */
export default function ModalSolicitarAsesoria({ asesor, trabajo, onEnviar, onCerrar }) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // La página envía la solicitud a la API; si el servidor la rechaza (400/409), se muestra su mensaje
  const enviar = async () => {
    setEnviando(true);
    try {
      await onEnviar(mensaje);
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Solicitar asesoría"
      ancho="wide"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn--primary" onClick={enviar} disabled={mensaje.trim() === '' || enviando}>
            {enviando ? 'Enviando…' : 'Enviar solicitud'}
          </button>
        </>
      }
    >
      <p className="hu3-subtitulo-modal">
        {asesor.nombre} · cupo {asesor.cupoDisponible} de {asesor.cupoMaximo}
      </p>

      <div className="hu3-caja">
        <p className="text-label">Tu trabajo</p>
        <p className="hu3-caja__titulo">{trabajo.titulo}</p>
        <p className="text-muted text-aux">
          {trabajo.linea}{trabajo.carrera && ` · ${trabajo.carrera}`} · equipo de {trabajo.integrantes.length} integrantes
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="hu3-mensaje">Mensaje de sustento</label>
        <textarea
          id="hu3-mensaje"
          className={`textarea ${error ? 'input--error' : ''}`}
          rows={4}
          maxLength={MAXIMO}
          value={mensaje}
          onChange={(e) => {
            setMensaje(e.target.value);
            setError('');
          }}
        />
        {error ? (
          <span className="field__error" role="alert">{error}</span>
        ) : (
          <span className="hu3-contador">
            <span>Explica por qué elegiste a este asesor</span>
            <span>{mensaje.length} / {MAXIMO}</span>
          </span>
        )}
      </div>

      <Alert tipo="success">
        Solo se admite una solicitud activa por trabajo. Mientras esté pendiente no podrás solicitar a otro asesor.
      </Alert>
    </Modal>
  );
}

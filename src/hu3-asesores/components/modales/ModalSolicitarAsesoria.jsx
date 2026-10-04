import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { cupoDisponible, nombreAsesor } from '../../services/asesoriasService.js';

const MAXIMO = 600;

/** 3.3 Solicitar asesoría · rol Estudiante (diapositiva 26). */
export default function ModalSolicitarAsesoria({ asesor, trabajo, onEnviar, onCerrar }) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const enviar = () => {
    try {
      onEnviar(mensaje); // si el servicio rechaza la solicitud, lanza un Error
    } catch (e) {
      setError(e.message);
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
          <button className="btn btn--primary" onClick={enviar} disabled={mensaje.trim() === ''}>Enviar solicitud</button>
        </>
      }
    >
      <p className="hu3-subtitulo-modal">
        {nombreAsesor(asesor)} · cupo {cupoDisponible(asesor)} de {asesor.cupoMaximo}
      </p>

      <div className="hu3-caja">
        <p className="text-label">Tu trabajo</p>
        <p className="hu3-caja__titulo">{trabajo.titulo}</p>
        <p className="text-muted text-aux">
          {trabajo.linea} · {trabajo.carrera} · equipo de {trabajo.integrantes.length} integrantes
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

import { useState } from 'react';
import Alert from '../../shared/components/Alert.jsx';
import { ETIQUETA_ROL } from '../utils/formatoHu7.js';
import '../components/Modales.css';

const MOTIVO_MIN = 30;
const MOTIVO_MAX = 400;

/** Mismas reglas que el servidor: obligatorio, 30 a 400 caracteres tras recortar. */
function validarMotivo(texto) {
  const limpio = texto.trim();
  if (!limpio) return 'Indica el motivo del bloqueo.';
  if (limpio.length < MOTIVO_MIN) return `Escribe al menos ${MOTIVO_MIN} caracteres (llevas ${limpio.length}).`;
  if (limpio.length > MOTIVO_MAX) return `El motivo admite hasta ${MOTIVO_MAX} caracteres.`;
  return null;
}

/**
 * Pide el motivo y confirma el bloqueo. `alConfirmar(motivo)` hace la petición:
 * si falla, el error del servidor se muestra junto al campo (400) o arriba de los botones (403/409).
 */
export default function ModalBloquearUsuario({ usuario, alCerrar, alConfirmar }) {
  // estado para guardar lo que escribe el usuario
  const [motivo, setMotivo] = useState('');
  const [errorMotivo, setErrorMotivo] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleBloquear = async () => {
    const error = validarMotivo(motivo);
    setErrorMotivo(error);
    setErrorGeneral(null);
    if (error) return;

    setEnviando(true);
    try {
      await alConfirmar(motivo.trim());
    } catch (e) {
      if (e.campos?.motivo) setErrorMotivo(e.campos.motivo);
      else setErrorGeneral(e.message);
      setEnviando(false);
    }
  };

  return (
    <div className="hu7-modal-overlay">
      <div className="hu7-modal-contenedor" role="dialog" aria-modal="true" aria-labelledby="titulo-bloquear">

        <div className="hu7-modal-cabecera">
          <h2 id="titulo-bloquear">Bloquear usuario</h2>
          <button type="button" className="hu7-modal-cerrar" onClick={alCerrar} disabled={enviando}>
            &times;
          </button>
        </div>

        {/* tarjeta de información del usuario a bloquear */}
        <div className="hu7-modal-info-usuario">
          <strong>{usuario.nombreCompleto}</strong>
          <span>
            {[ETIQUETA_ROL[usuario.rol] ?? usuario.rol, usuario.carreraDepartamento, usuario.correo].filter(Boolean).join(' · ')}
          </span>
        </div>

        {/* campo de texto para el motivo */}
        <div className="hu7-modal-campo">
          <label htmlFor="motivo-bloqueo">MOTIVO DEL BLOQUEO (OBLIGATORIO)</label>
          <textarea
            id="motivo-bloqueo"
            rows="4"
            maxLength={MOTIVO_MAX}
            value={motivo}
            aria-invalid={Boolean(errorMotivo)}
            aria-describedby="contador-motivo"
            onChange={(e) => {
              setMotivo(e.target.value);
              if (errorMotivo) setErrorMotivo(null);
            }}
            className="hu7-modal-textarea"/>

          {errorMotivo && <span className="field__error" role="alert">{errorMotivo}</span>}
          <div className="hu7-modal-contador" id="contador-motivo">
            Mínimo {MOTIVO_MIN} caracteres · {motivo.trim().length} / {MOTIVO_MAX}
          </div>
        </div>

        {/* alerta roja con advertencia */}
        <div className="hu7-alerta-roja">
          <div className="hu7-alerta-icono">!</div>
          <div className="hu7-alerta-texto">
            El usuario perderá el acceso inmediatamente. Si tiene un trabajo registrado, seguirá visible para el equipo y el asesor.
          </div>
        </div>

        {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}

        {/* botones de accion */}
        <div className="hu7-modal-acciones">
          <button type="button" className="hu7-boton-cancelar-modal" onClick={alCerrar} disabled={enviando}>
            Cancelar
          </button>
          <button type="button" className="hu7-boton-bloquear-confirmar" onClick={handleBloquear} disabled={enviando}>
            {enviando ? 'Bloqueando…' : 'Bloquear usuario'}
          </button>
        </div>

      </div>
    </div>
  );
}

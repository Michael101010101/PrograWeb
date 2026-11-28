import { useState } from 'react';
import Alert from '../../shared/components/Alert.jsx';
import { formatearFecha } from '../utils/formatoHu7.js';
import '../components/Modales.css';

const CUPO_MIN = 1;
const CUPO_MAX = 10;
const AVISO_RECHAZAR = 'Rechazar aún no está disponible: el servidor no tiene esta acción.';

/** Mismas reglas que el servidor: entero de 1 a 10. Devuelve { valor } o { error }. */
function validarCupo(texto) {
  const limpio = String(texto).trim();
  if (!/^\d+$/.test(limpio)) return { error: `Ingresa un número entero de ${CUPO_MIN} a ${CUPO_MAX}.` };
  const valor = Number(limpio);
  if (valor < CUPO_MIN || valor > CUPO_MAX) return { error: `Ingresa un número entero de ${CUPO_MIN} a ${CUPO_MAX}.` };
  return { valor };
}

/**
 * Valida la cuenta de un asesor pendiente con su cupo inicial. `alConfirmar(cupoMaximo)` hace la petición:
 * si falla, campos.cupoMaximo va junto al campo y los demás errores arriba de los botones.
 */
export default function ModalValidarAsesor({ asesor, alCerrar, alConfirmar }) {
  // Estados para campos del formulario
  const [cupoInicial, setCupoInicial] = useState('');
  const [errorCupo, setErrorCupo] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleValidar = async () => {
    const { valor, error } = validarCupo(cupoInicial);
    setErrorCupo(error ?? null);
    setErrorGeneral(null);
    if (error) return;

    setEnviando(true);
    try {
      await alConfirmar(valor);
    } catch (e) {
      if (e.campos?.cupoMaximo) setErrorCupo(e.campos.cupoMaximo);
      else setErrorGeneral(e.message);
      setEnviando(false);
    }
  };

  return (
    <div className="hu7-modal-overlay">
      <div className="hu7-modal-contenedor" role="dialog" aria-modal="true" aria-labelledby="titulo-validar">

        <div className="hu7-modal-cabecera">
          <h2 id="titulo-validar">Validar cuenta de asesor</h2>
        </div>

        <div className="hu7-modal-info-usuario">
          <strong>{asesor.nombreCompleto}</strong>
          <span>
            {[asesor.correo, asesor.carreraDepartamento, asesor.gradoAcademico].filter(Boolean).join(' · ')}
          </span>
          {asesor.creadoEn && (
            <span className="hu7-fecha-solicitud">Solicitud recibida el {formatearFecha(asesor.creadoEn)}</span>
          )}
        </div>


        <div className="hu7-modal-grid-campos">
          <div className="hu7-modal-campo">
            <label htmlFor="cupo-inicial">CUPO MÁXIMO INICIAL</label>
            <input
              id="cupo-inicial"
              type="number"
              min={CUPO_MIN}
              max={CUPO_MAX}
              step="1"
              value={cupoInicial}
              aria-invalid={Boolean(errorCupo)}
              onChange={(e) => {
                setCupoInicial(e.target.value);
                if (errorCupo) setErrorCupo(null);
              }}
              className="hu7-modal-input"/>
            {errorCupo && <span className="field__error" role="alert">{errorCupo}</span>}
          </div>

          <div className="hu7-modal-campo">
            <label htmlFor="rol-asignado">ROL ASIGNADO</label>
            {/* El API valida la cuenta con el rol que ya tiene (asesor); no lo cambia */}
            <select
              id="rol-asignado"
              value="asesor"
              disabled
              className="hu7-modal-seleccionado">
              <option value="asesor">Asesor</option>
            </select>
          </div>
        </div>


        <div className="hu7-alerta-verde">
          Al validar, el asesor podrá declarar hasta 3 líneas de investigación y empezará a aparecer en el directorio público.
        </div>

        {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}

        {/* botones de accion */}
        <div className="hu7-modal-acciones">
          <button type="button" className="hu7-boton-cancelar-modal" onClick={alCerrar} disabled={enviando}>
            Cancelar
          </button>
          <span title={AVISO_RECHAZAR}>
            <button type="button" className="hu7-boton-rechazar-modal" disabled aria-describedby="aviso-rechazar">
              Rechazar
            </button>
          </span>
          <button type="button" className="hu7-boton-validar-confirmar" onClick={handleValidar} disabled={enviando}>
            {enviando ? 'Validando…' : 'Validar cuenta'}
          </button>
        </div>
        <span id="aviso-rechazar" hidden>{AVISO_RECHAZAR}</span>

      </div>
    </div>
  );
}

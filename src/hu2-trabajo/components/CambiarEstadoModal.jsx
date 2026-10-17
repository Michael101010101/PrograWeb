import { useState } from 'react';
import Hu2Modal from './Hu2Modal.jsx';
import EstadoBadge from './EstadoBadge.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import * as trabajoService from '../services/trabajoService.js';
import { ESTADOS, LIMITES } from '../config.js';
import { validarMotivo } from '../utils/validaciones.js';
import './estadosTrabajo.css';

export default function CambiarEstadoModal({ trabajo, onCerrar, onCambiado }) {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const opciones = trabajoService.transicionesPermitidas(trabajo);
  const [destino, setDestino] = useState(opciones[0]);
  const [motivo, setMotivo] = useState('');
  const [tocado, setTocado] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const esDesistir = destino === 'desistido';
  const largo = motivo.trim().length;
  const error = tocado ? validarMotivo(motivo) : null;

  const confirmar = async () => {
    setTocado(true);
    if (validarMotivo(motivo)) return;
    setProcesando(true);
    try {
      const { trabajo: actualizado, notificados } = await trabajoService.cambiarEstado(usuario, trabajo.id, destino, motivo);
      mostrar({
        tipo: 'exito',
        titulo: `Estado actualizado a ${ESTADOS[destino].label}`,
        mensaje: `Se notificó ${notificados}.`,
      });
      onCambiado(actualizado);
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo actualizar el estado', mensaje: err.message });
      setProcesando(false);
    }
  };

  const consecuencia = esDesistir
    ? `Desistir cierra el plan de entregables, cancela los avances pendientes de revisión${
        trabajo.asesor ? ` y libera el cupo ${trabajo.asesor.genero === 'f' ? 'de la' : 'del'} ${trabajo.asesor.nombre}` : ' y retira la propuesta'
      }. No se puede revertir sin la coordinación.`
    : 'Al concluir, el trabajo queda habilitado para programar sustentación y el plan pasa a modo lectura.';

  return (
    <Hu2Modal
      abierto
      onCerrar={procesando ? undefined : onCerrar}
      className="hu2-modal-estado"
      titulo={(id) => (
        <div className="hu2-modal-titulo">
          <h2 id={id}>Cambiar estado del trabajo</h2>
          <button type="button" className="hu2-modal-cerrar" onClick={onCerrar} disabled={procesando} aria-label="Cerrar">
            ×
          </button>
        </div>
      )}
    >
      {opciones.length > 1 && (
        <div className="hu2-opciones-estado" role="radiogroup" aria-label="Nuevo estado">
          {opciones.map((op) => (
            <label key={op} className={destino === op ? 'is-activa' : ''}>
              <input type="radio" name="destino" value={op} checked={destino === op} onChange={() => setDestino(op)} />
              {op === 'concluido' ? 'Marcar concluido' : 'Desistir del trabajo'}
            </label>
          ))}
        </div>
      )}

      <div className="hu2-cambio-estados">
        <EstadoBadge estado={trabajo.estado} />
        <span aria-hidden="true">→</span>
        <EstadoBadge estado={destino} />
      </div>

      <label className="hu2-label" htmlFor="hu2-motivo">
        MOTIVO (OBLIGATORIO)
      </label>

      <textarea
        id="hu2-motivo"
        className={`hu2-textarea-estado ${error ? 'hu2-con-error' : ''}`}
        value={motivo}
        maxLength={LIMITES.motivoMax}
        placeholder={esDesistir ? 'Explica por qué el equipo deja el trabajo…' : 'Ej.: Informe final aprobado por la asesora el 24/11/2026.'}
        onChange={(e) => setMotivo(e.target.value)}
        onBlur={() => setTocado(true)}
        aria-invalid={Boolean(error)}
      />

      <small className={`hu2-contador ${error ? 'hu2-con-error' : ''}`} role={error ? 'alert' : undefined}>
        {error ? `${error} · ` : `Mínimo ${LIMITES.motivoMin} caracteres · `}
        {largo} / {LIMITES.motivoMax}
      </small>

      <div className={`hu2-alerta ${esDesistir ? 'hu2-alerta-error' : 'hu2-alerta-exito'}`}>{consecuencia}</div>

      <div className="hu2-acciones-derecha">
        <button type="button" className="hu2-btn-texto" onClick={onCerrar} disabled={procesando}>
          Cancelar
        </button>

        <button type="button" className={esDesistir ? 'hu2-btn-peligro' : 'hu2-btn-principal'} onClick={confirmar} disabled={procesando}>
          {procesando ? 'Procesando…' : esDesistir ? 'Desistir del trabajo' : 'Marcar concluido'}
        </button>
      </div>
    </Hu2Modal>
  );
}
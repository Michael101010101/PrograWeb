import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { formatearFecha, horaFin } from '../../utils/fechas.js';

/**
 * 6.1 La sala ya está ocupada · rol Administrador (diapositiva 47).
 * "Usar" copia la alternativa al formulario; "Programar" queda deshabilitado.
 */
export default function ModalSalaOcupada({ salaId, fecha, hora, ocupante, alternativas, onUsar, onCerrar }) {
  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="La sala ya está ocupada"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cambiar datos</button>
          <button className="btn btn--primary" disabled>Programar</button>
        </>
      }
    >
      <Alert tipo="error">
        La sala {salaId} está ocupada el {formatearFecha(fecha)} de {hora} a {horaFin(hora)} por {ocupante}.
      </Alert>

      <div className="hu6-caja-gris">
        <p className="text-label" style={{ marginBottom: 10 }}>Alternativas disponibles</p>
        {alternativas.length === 0 ? (
          <p>No hay alternativas libres ese día. Prueba con otra fecha.</p>
        ) : (
          <div className="stack">
            {alternativas.map((alt) => (
              <div key={`${alt.salaId}-${alt.hora}`} className="hu6-bloque">
                <span style={{ color: 'var(--text)' }}>{alt.salaId} · {formatearFecha(alt.fecha)} · {alt.hora}</span>
                <button type="button" className="link-button" style={{ fontWeight: 600 }} onClick={() => onUsar(alt)}>Usar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

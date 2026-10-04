import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { cupoDisponible, nombreAsesor } from '../../services/asesoriasService.js';
import { formatearFecha } from '../../utils/fechas.js';

/**
 * 3.3 Asesor sin cupo · rol Estudiante (diapositiva 27).
 * `alternativas`: otros asesores de la misma línea que sí tienen cupo.
 */
export default function ModalAsesorSinCupo({ asesor, linea, alternativas, onSolicitarOtro, onCerrar }) {
  const articulo = asesor.titulo === 'Dra.' ? 'La' : 'El';

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Este asesor no tiene cupo"
      acciones={<button className="btn btn--ghost" onClick={onCerrar}>Cerrar</button>}
    >
      <Alert tipo="error">
        {articulo} {nombreAsesor(asesor)} ocupó sus {asesor.cupoMaximo} cupos
        {asesor.sinCupoDesde && ` el ${formatearFecha(asesor.sinCupoDesde)}`}. No es posible enviar la solicitud.
      </Alert>

      {alternativas.length > 0 ? (
        <>
          <p className="text-muted">Otros asesores de {linea} con cupo disponible:</p>
          {alternativas.map((otro) => (
            <div key={otro.id} className="hu3-fila-asesor">
              <div>
                <p style={{ fontWeight: 500 }}>{nombreAsesor(otro)}</p>
                <p className="text-muted text-aux">Cupo {cupoDisponible(otro)} de {otro.cupoMaximo}</p>
              </div>
              <button className="btn btn--outline" style={{ minHeight: 34, padding: '0 12px' }} onClick={() => onSolicitarOtro(otro)}>
                Solicitar
              </button>
            </div>
          ))}
        </>
      ) : (
        <p className="text-muted">No hay otros asesores de {linea} con cupo disponible por ahora.</p>
      )}
    </Modal>
  );
}

import Modal from '../../../shared/components/Modal.jsx';
import { VENTANA } from '../../data/datosSemilla.js';
import { formatearFecha } from '../../utils/fechas.js';

/** Requisitos para sustentar (botón "Ver requisitos de sustentación" del estado vacío 6.4). */
export default function ModalRequisitos({ onCerrar }) {
  return (
    <Modal abierto onCerrar={onCerrar} titulo="Requisitos de sustentación" acciones={<button className="btn btn--primary" onClick={onCerrar}>Entendido</button>}>
      <ul className="hu6-requisitos" style={{ marginTop: 0 }}>
        <li><span className="hu6-check hu6-check--pendiente" /> <span>Trabajo en estado <strong>Concluido</strong>, con todos los entregables del plan aprobados.</span></li>
        <li><span className="hu6-check hu6-check--pendiente" /> <span>Informe final aprobado por el asesor.</span></li>
        <li><span className="hu6-check hu6-check--pendiente" /> <span>Entrega del informe impreso en la oficina TFC, 5 días hábiles antes de la fecha.</span></li>
        <li><span className="hu6-check hu6-check--pendiente" /> <span>Constancia de no adeudo de Tesorería.</span></li>
      </ul>
      <p className="text-muted text-aux">
        Las sustentaciones se programan entre el {formatearFecha(VENTANA.inicio)} y el {formatearFecha(VENTANA.fin)}.
      </p>
    </Modal>
  );
}

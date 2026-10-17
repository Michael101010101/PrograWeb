import Modal from '../../../shared/components/Modal.jsx';
import { formatearFecha } from '../../utils/fechas.js';

/** "Ver requisitos": pasos de un requisito administrativo de la oficina TFC (no tiene peso). */
export default function ModalRequisitos({ requisito, onCerrar }) {
  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={
        <>
          {requisito.nombre}
          <span className="hu4-modal__sub">Vence el {formatearFecha(requisito.fechaLimite)} · {requisito.detalle}</span>
        </>
      }
      acciones={<button className="btn btn--primary" onClick={onCerrar}>Entendido</button>}
    >
      <ol className="hu4-requisitos">
        {requisito.pasos.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>
    </Modal>
  );
}

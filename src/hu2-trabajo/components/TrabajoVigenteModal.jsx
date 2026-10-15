import { useNavigate } from 'react-router-dom';
import Hu2Modal from './Hu2Modal.jsx';
import EstadoBadge from './EstadoBadge.jsx';
import './estadosTrabajo.css';

export default function TrabajoVigenteModal({ trabajo, onCerrar }) {
  const navigate = useNavigate();
  const avance = trabajo?.avance?.porcentaje ?? 0;

  return (
    <Hu2Modal abierto={Boolean(trabajo)} onCerrar={onCerrar} className="hu2-modal-centrado" titulo={null}>
      <div className="hu2-icono-aviso" aria-hidden="true">!</div>

      <h2>Ya tienes un trabajo vigente</h2>

      <p className="hu2-texto-centro">
        Solo puedes tener un trabajo en desarrollo a la vez. Para registrar uno
        nuevo debes concluir o desistir del actual.
      </p>

      {trabajo && (
        <div className="hu2-trabajo-actual">
          <strong>{trabajo.titulo}</strong>

          <div className="hu2-trabajo-avance">
            <EstadoBadge estado={trabajo.estado} />

            <div className="hu2-mini-barra">
              <div className="hu2-mini-barra-relleno" style={{ width: `${avance}%` }}></div>
            </div>

            <strong>{avance}%</strong>
          </div>
        </div>
      )}

      <div className="hu2-acciones-centro">
        <button type="button" className="hu2-btn-principal" onClick={() => navigate('/estudiante/mi-trabajo')}>
          Ver mi trabajo actual
        </button>

        <button type="button" className="hu2-btn-secundario" onClick={() => navigate('/estudiante/entregables')}>
          Ver entregables
        </button>
      </div>
    </Hu2Modal>
  );
}
import './estadosTrabajo.css';

export default function TrabajoVigenteModal() {
  return (
    <div className="hu2-modal hu2-modal-centrado">
      <div className="hu2-icono-aviso">!</div>

      <h2>Ya tienes un trabajo vigente</h2>

      <p className="hu2-texto-centro">
        Solo puedes tener un trabajo en desarrollo a la vez. Para registrar uno
        nuevo debes concluir o desistir del actual.
      </p>

      <div className="hu2-trabajo-actual">
        <strong>
          Modelo predictivo de deserción en estudiantes de primer ciclo
        </strong>

        <div className="hu2-trabajo-avance">
          <span className="hu2-badge-desarrollo">
            En desarrollo
          </span>

          <div className="hu2-mini-barra">
            <div className="hu2-mini-barra-relleno"></div>
          </div>

          <strong>55%</strong>
        </div>
      </div>

      <div className="hu2-acciones-centro">
        <button type="button" className="hu2-btn-principal">
          Ver mi trabajo actual
        </button>

        <button type="button" className="hu2-btn-secundario">
          Ver entregables
        </button>
      </div>
    </div>
  );
}
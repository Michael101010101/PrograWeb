import './estadosTrabajo.css';

export default function CambiarEstadoModal({ tipo = 'desistir' }) {
  const esDesistir = tipo === 'desistir';

  return (
    <div className="hu2-modal hu2-modal-estado">
      <div className="hu2-modal-titulo">
        <h2>Cambiar estado del trabajo</h2>
        <button type="button">×</button>
      </div>

      <div className="hu2-cambio-estados">
        <span className="hu2-badge-desarrollo">
          En desarrollo
        </span>

        <span>→</span>

        <span
          className={
            esDesistir
              ? 'hu2-badge-desistido'
              : 'hu2-badge-concluido'
          }
        >
          {esDesistir ? 'Desistido' : 'Concluido'}
        </span>
      </div>

      <label className="hu2-label">
        MOTIVO (OBLIGATORIO)
      </label>

      <textarea
        className="hu2-textarea-estado"
        value={
          esDesistir
            ? 'El equipo no logró acceso a los datos de asistencia requeridos para el modelo.'
            : 'Informe final aprobado por la asesora el 24/11/2026.'
        }
        readOnly
      />

      {esDesistir && (
        <>
          <small className="hu2-contador">
            Mínimo 40 caracteres · 76 / 500
          </small>

          <div className="hu2-alerta hu2-alerta-error">
            Desistir cierra el plan de entregables, cancela los avances
            pendientes de revisión y libera el cupo de la Dra. Mariela Quispe
            Ramos. No se puede revertir sin la coordinación.
          </div>
        </>
      )}

      {!esDesistir && (
        <div className="hu2-alerta hu2-alerta-exito">
          Al concluir, el trabajo queda habilitado para programar sustentación
          y el plan pasa a modo lectura.
        </div>
      )}

      <div className="hu2-acciones-derecha">
        <button type="button" className="hu2-btn-texto">
          Cancelar
        </button>

        <button
          type="button"
          className={
            esDesistir
              ? 'hu2-btn-peligro'
              : 'hu2-btn-principal'
          }
        >
          {esDesistir
            ? 'Desistir del trabajo'
            : 'Marcar concluido'}
        </button>
      </div>
    </div>
  );
}
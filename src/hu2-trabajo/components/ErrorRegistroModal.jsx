import './estadosTrabajo.css';

export default function ErrorRegistroModal() {
  return (
    <div className="hu2-modal hu2-modal-registro">
      <h2>No pudimos registrar el trabajo</h2>

      <div className="hu2-alerta hu2-alerta-error">
        Revisa 3 campos antes de continuar.
      </div>

      <div className="hu2-campo-error">
        <label>TÍTULO DEL TRABAJO</label>
        <input type="text" value="Tesis" readOnly />
        <small>El título debe tener al menos 20 caracteres</small>
      </div>

      <div className="hu2-campo-error">
        <label>LÍNEA DE INVESTIGACIÓN</label>

        <select value="" disabled>
          <option value="">Selecciona una línea</option>
        </select>

        <small>Debes elegir una línea de investigación</small>
      </div>

      <div className="hu2-campo-error">
        <label>RESUMEN</label>

        <textarea
          value="Trata sobre deserción universitaria."
          readOnly
        />

        <small>Faltan 264 caracteres para el mínimo · 36 / 1200</small>
      </div>
    </div>
  );
}
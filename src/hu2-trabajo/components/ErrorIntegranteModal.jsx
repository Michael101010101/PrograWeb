import './estadosTrabajo.css';

export default function ErrorIntegranteModal() {
  return (
    <div className="hu2-modal">
      <h2>No se pudo agregar al integrante</h2>

      <div className="hu2-alerta hu2-alerta-warning">
        <strong>Diana Carolina Rojas Tito</strong> ya participa en el trabajo
        «Optimización de rutas de reparto para comercios de Lima Metropolitana»,
        en desarrollo desde el 21/08/2026.
      </div>

      <div className="hu2-estudiante-bloqueado">
        <div>
          <strong>Diana Carolina Rojas Tito</strong>
          <p>20210466 · Ingeniería Industrial</p>
        </div>

        <span>No disponible</span>
      </div>

      <p className="hu2-nota">
        Si el estudiante desistió de su trabajo anterior, la coordinación debe
        liberarlo antes de agregarlo.
      </p>

      <div className="hu2-acciones-derecha">
        <button type="button" className="hu2-btn-texto">
          Cerrar
        </button>

        <button type="button" className="hu2-btn-principal">
          Buscar otro estudiante
        </button>
      </div>
    </div>
  );
}
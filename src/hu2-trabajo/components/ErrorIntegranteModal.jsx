import Hu2Modal from './Hu2Modal.jsx';
import { ESTADOS } from '../config.js';
import { fecha } from '../utils/fechas.js';
import './estadosTrabajo.css';

export default function ErrorIntegranteModal({ integrante, ocupadoEn, onCerrar, onBuscarOtro }) {
  return (
    <Hu2Modal abierto={Boolean(integrante)} onCerrar={onCerrar} titulo="No se pudo agregar al integrante">
      {integrante && (
        <>
          <div className="hu2-alerta hu2-alerta-warning" role="alert">
            <strong>{integrante.nombre}</strong> ya participa en el trabajo
            «{ocupadoEn?.titulo}», {ESTADOS[ocupadoEn?.estado]?.label.toLowerCase()} desde
            el {fecha(ocupadoEn?.desde)}.
          </div>

          <div className="hu2-estudiante-bloqueado">
            <div>
              <strong>{integrante.nombre}</strong>
              <p>{integrante.codigo} · {integrante.carrera}</p>
            </div>

            <span>No disponible</span>
          </div>
        </>
      )}

      <p className="hu2-nota">
        Si el estudiante desistió de su trabajo anterior, la coordinación debe
        liberarlo antes de agregarlo.
      </p>

      <div className="hu2-acciones-derecha">
        <button type="button" className="hu2-btn-texto" onClick={onCerrar}>
          Cerrar
        </button>

        <button type="button" className="hu2-btn-principal" onClick={onBuscarOtro}>
          Buscar otro estudiante
        </button>
      </div>
    </Hu2Modal>
  );
}
import React, { useState } from 'react';
import '../components/Modales.css';


export default function ModalValidarAsesor({ isOpen, onClose, asesor, onConfirmarValidacion, onRechazar }) {
  
  // Estados  para campos del formulario
  const [cupoInicial, setCupoInicial] = useState(6);
  const [rolAsignado, setRolAsignado] = useState('Asesor');



  if (!isOpen || !asesor) return null;

  const handleValidar = () => {
    onConfirmarValidacion(asesor.id, cupoInicial, rolAsignado);
    onClose();
  };

  return (
    <div className="hu7-modal-overlay">
      <div className="hu7-modal-contenedor">
        
        <div className="hu7-modal-cabecera">
          <h2>Validar cuenta de asesor</h2>
        </div>

        <div className="hu7-modal-info-usuario">
          <strong>{asesor.nombre}</strong>
          <span>
            {asesor.correo} · {asesor.carreraDepartamento} · magíster
          </span>
          <span className="hu7-fecha-solicitud">Solicitud recibida el 04/09/2026</span>
        </div>


        <div className="hu7-modal-grid-campos">
          <div className="hu7-modal-campo">
            <label htmlFor="cupo-inicial">CUPO MÁXIMO INICIAL</label>
            <input
              id="cupo-inicial"
              type="number"
              value={cupoInicial}
              onChange={(e) => setCupoInicial(e.target.value)}
              className="hu7-modal-input"/>
          </div>

          <div className="hu7-modal-campo">
            <label htmlFor="rol-asignado">ROL ASIGNADO</label>
            <select
              id="rol-asignado"
              value={rolAsignado}
              onChange={(e) => setRolAsignado(e.target.value)}
              className="hu7-modal-seleccionado">
                
              <option value="Asesor">Asesor</option>
              <option value="Coordinador">Coordinador</option>
            </select>
          </div>
        </div>


        <div className="hu7-alerta-verde">
          Al validar, el asesor podrá declarar hasta 3 líneas de investigación y empezará a aparecer en el directorio público.
        </div>

        {/* botones de accion */}
        <div className="hu7-modal-acciones">
          <button type="button" className="hu7-boton-rechazar-modal" onClick={onRechazar}>
            Rechazar
          </button>
          <button type="button" className="hu7-boton-validar-confirmar" onClick={handleValidar}>
            Validar cuenta
          </button>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import '../components/Modales.css';

export default function ModalBloquearUsuario({ isOpen, onClose, usuario, onConfirmarBloqueo }) {
  
    // estado para guardar lo que escribe el usuario 
  const [motivo, setMotivo] = useState(
    "Retiro del semestre 2026-2 solicitado en Registro Académico el 02/09/2026."
  );

  // si el modal esta cerrado no dibuja nada en pantalla
  if (!isOpen || !usuario) return null;

  const handleBloquear = () => {
    if (motivo.length < 30) {
      alert("El motivo debe tener al menos 30 caracteres.");
      return;
    }
    onConfirmarBloqueo(usuario.id, motivo);
    onClose();
  };

  return (
    <div className="hu7-modal-overlay">
      <div className="hu7-modal-contenedor">
        
        <div className="hu7-modal-cabecera">
          <h2>Bloquear usuario</h2>
          <button type="button" className="hu7-modal-cerrar" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* tarjeta de información del usuario a bloquear */}
        <div className="hu7-modal-info-usuario">
          <strong>{usuario.nombre}</strong>
          <span>
            {usuario.rol} · {usuario.carreraDepartamento} · {usuario.correo}
          </span>
        </div>

        {/* campo de texto para el motivo */}
        <div className="hu7-modal-campo">
          <label htmlFor="motivo-bloqueo">MOTIVO DEL BLOQUEO (OBLIGATORIO)</label>
          <textarea
            id="motivo-bloqueo"
            rows="4"
            maxLength={400}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="hu7-modal-textarea"/>

          <div className="hu7-modal-contador">
            Mínimo 30 caracteres · {motivo.length} / 400
          </div>
        </div>

        {/* creada la alerta roja con advertencia */}
        <div className="hu7-alerta-roja">
          <div className="hu7-alerta-icono">!</div>
          <div className="hu7-alerta-texto">
            El usuario perderá el acceso inmediatamente. Su trabajo «Optimización de rutas de reparto para comercios de Lima Metropolitana» seguirá visible para el equipo y el asesor.
          </div>
        </div>

        {/* botones de accion */}
        <div className="hu7-modal-acciones">
          <button type="button" className="hu7-boton-cancelar-modal" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="hu7-boton-bloquear-confirmar" onClick={handleBloquear}>
            Bloquear usuario
          </button>
        </div>

      </div>
    </div>
  );
}
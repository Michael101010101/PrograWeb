import React from 'react';
import '../components/Modales.css';

export default function ModalSinDatos({ 
  estaAbierto, 
  alCerrar, 
  periodo = "2027-1", 
  periodoAnterior = "2026-2" 
}) {
  if (!estaAbierto) return null;

  return (
    <div className="hu7-modal-overlay">
      <div className="hu7-tarjeta-sin-datos">
        
        {/* Ícono de hoja/tabla */}
        <div className="hu7-icono-sin-datos">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#66716B" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="12" y2="17" />
          </svg>
        </div>

        {/* Título y Mensaje */}
        <h2 className="hu7-titulo-sin-datos">Sin datos para {periodo}</h2>
        
        <p className="hu7-texto-sin-datos">
          El periodo seleccionado aún no tiene trabajos registrados. Las métricas se activan con el primer registro de propuesta.
        </p>

        {/* Botón para regresar al periodo activo */}
        <button 
          type="button" 
          className="hu7-boton-volver-periodo"
          onClick={alCerrar}
        >
          Volver a {periodoAnterior}
        </button>

      </div>
    </div>
  );
}
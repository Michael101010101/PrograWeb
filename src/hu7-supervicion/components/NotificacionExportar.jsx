import React from 'react';
import '../components/Modales.css';

export default function NotificacionExportar({ 
  estaVisible, 
  alCerrar, 
  mensaje = "tfc-2026-2-metricas.xlsx · 12 trabajos y 38 asesores" 
}) {
  if (!estaVisible) return null;

  return (
    <div className="hu7-notificacion-flotante">
      
      {/* Círculo verde con check */}
      <div className="hu7-notificacion-icono">
        ✓
      </div>

      {/* Texto de la notificación */}
      <div className="hu7-notificacion-contenido">
        <strong>Reporte exportado</strong>
        <span>{mensaje}</span>
      </div>

      {/* Botón X de cierre */}
      <button 
        type="button" 
        className="hu7-notificacion-cerrar"
        onClick={alCerrar}
      >
        &times;
      </button>

    </div>
  );
}
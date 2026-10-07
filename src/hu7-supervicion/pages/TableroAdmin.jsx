import React from 'react';
import '../hu7.css';

export default function TableroAdmin() {
    const totalTrabajs = 12;
    const periodo = "2026-2";

    return(
        <div className="hu7-contenedor">
            <h1 className="hu7-titulo-pantalla">HU7 - Supervision y metricas</h1>

            <div className="hu7-tarjeta-kpi">
                <h3>Trabajos del periodo 2026-2</h3>
                <p className="numero">cantidad dee trabajos: {totalTrabajs}</p>
            </div>

            
        </div>)
}
    
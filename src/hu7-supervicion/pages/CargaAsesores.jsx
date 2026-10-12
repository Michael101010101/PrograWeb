import React from 'react';
import Header from '/src/shared/components/Header.jsx';
import Footer from '/src/shared/components/Footer.jsx';
import '../css/hu7.css';
import '../css/CargaAsesores.css';

export default function CargaAsesores() {
  const periodo = "2026-2";

  return (
    <div className="hu7-pantalla-layout">
      <Header 
        slot={
          <div className="hu7-header-slot-asesores">
            <span>Asesores activos</span>
            <strong>38</strong>
          </div>
        } 
      />

      {/* Contenido Principal */}
      <main className="hu7-contenido-principal">
        
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Carga por asesor</h6>
            <h1 className="hu7-titulo-pantalla">Carga por asesor</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              6 asesores con trabajos a cargo · ordenados por cupo ocupado
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button type="button" className="hu7-btn-exportar">
              Exportar a Excel
            </button>
          </div>
        </div>

        <div className="hu7-contenedorINF">
          
            <div className="hu7-tarjeta-tabla-asesores">
            </div>

            <div className="hu7-fila-resumen-asesores">
            </div>

        </div>
      </main>





      <Footer detalle="6 asesores con carga" />
    </div>
  );
}
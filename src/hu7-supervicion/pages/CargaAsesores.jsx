import React from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import '../hu7.css';
import '../CargaAsesores.css';

export default function CargaAsesores() {
  const periodo = "2026-2";

  return (
    <PageLayout>
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
            {/*  la tabla de asesores */}
          </div>

          <div className="hu7-fila-resumen-asesores">
            {/*  indicadores globales de carga */}
          </div>

        </div>
      </main>
    </PageLayout>
  );
}
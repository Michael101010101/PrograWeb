import React from 'react';
import Header from '/src/shared/components/Header.jsx';
import Footer from '/src/shared/components/Footer.jsx';
import '../hu7.css';
import '../TrabajosAdmin.css';

export default function TrabajosAdmin() {
  return (
    <div className="hu7-pantalla-layout">
      <Header 
        slot={
          <div className="hu7-header-slot-trabajos">
            <span>Trabajos del periodo</span>
            <strong>12</strong>
          </div>
        } 
      />

      <main className="hu7-contenido-principal">
        
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Trabajos</h6>
            <h1 className="hu7-titulo-pantalla">Trabajos del periodo</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              12 trabajos · 9 activos · 2 sin asesor
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button type="button" className="hu7-btn-exportar">
              Exportar a Excel
            </button>
          </div>
        </div>

        <div className="hu7-contenedorINF">
          
          <div className="hu7-barra-filtros-trabajos">
            <div className="hu7-filtro-buscar">
              <label htmlFor="input-buscar">BUSCAR</label>
              <input 
                id="input-buscar" 
                type="text" 
                placeholder="Título, código o integrante..." 
                className="hu7-input-buscar"
              />
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-estado">ESTADO</label>
              <select id="select-estado" defaultValue="Todos" className="hu7-select-filtro">
                <option value="Todos">Todos</option>
                <option value="Propuesta">Propuesta</option>
                <option value="En desarrollo">En desarrollo</option>
                <option value="Concluido">Concluido</option>
                <option value="Desistido">Desistido</option>
              </select>
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-linea">LÍNEA</label>
              <select id="select-linea" defaultValue="Todas" className="hu7-select-filtro">
                <option value="Todas">Todas</option>
                <option value="Ciencia de datos">Ciencia de datos</option>
                <option value="Gestión de operaciones">Gestión de operaciones</option>
                <option value="Automatización y control">Automatización y control</option>
                <option value="Innovación educativa">Innovación educativa</option>
                <option value="Sostenibilidad urbana">Sostenibilidad urbana</option>
              </select>
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-asesor">ASESOR</label>
              <select id="select-asesor" defaultValue="Todos" className="hu7-select-filtro">
                <option value="Todos">Todos</option>
                <option value="Quispe Ramos">Quispe Ramos</option>
                <option value="Vargas Aliaga">Vargas Aliaga</option>
                <option value="Salazar Huamán">Salazar Huamán</option>
                <option value="Torres Anchante">Torres Anchante</option>
                <option value="Ocampo Salas">Ocampo Salas</option>
                <option value="Sin asesor">Sin asesor</option>
              </select>
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-carrera">CARRERA</label>
              <select id="select-carrera" defaultValue="Todas" className="hu7-select-filtro">
                <option value="Todas">Todas</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
              </select>
            </div>
          </div>

          <div className="hu7-tarjeta-tabla-trabajos">
            
            <table className="hu7-tabla-trabajos">
              <thead>
                <tr>
                  <th>TÍTULO</th>
                  <th>LÍNEA</th>
                  <th>EQUIPO</th>
                  <th>ASESOR</th>
                  <th>AVANCE</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {/* lasfilas dinámicas */}
              </tbody>
            </table>

            <div className="hu7-paginacion-trabajos">
              <span>Mostrando 1-12 de 12</span>
              <div className="hu7-botones-paginacion">
                <button type="button" className="hu7-btn-pag" disabled>Anterior</button>
                <button type="button" className="hu7-btn-pag active">1</button>
                <button type="button" className="hu7-btn-pag" disabled>Siguiente</button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer detalle="12 trabajos del periodo" />
    </div>
  );
}
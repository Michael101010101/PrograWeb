

import React from 'react';
import Header from '/src/shared/components/Header.jsx';
import Footer from '/src/shared/components/Footer.jsx';
import '../hu7.css';
import '../GestionUsuarios.css';

export default function GestionUsuarios() {
  return (
    <div className="hu7-pantalla-layout">
      <Header 
        slot={
          <div className="hu7-header-slot-usuarios">
            <span>Usuarios</span>
            <strong>86 · 3 bloqueados</strong>
          </div>
        } 
      />


      <main className="hu7-contenido-principal">
        
        {/* PARTE SUPERIOR: Títulos a la izquierda + Botones de acción a la derecha */}
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Usuarios</h6>
            <h1 className="hu7-titulo-pantalla">Gestión de usuarios</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              86 usuarios · 64 estudiantes · 38 asesores · 2 administradores · 3 bloqueados
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button type="button" className="hu7-btn-validar">
              Validar cuentas de asesor (2)
            </button>
            <button type="button" className="hu7-btn-registrar">
              Registrar usuario
            </button>
          </div>
        </div>

        {/* PARTE INFERIOR: Filtros + Tabla de Usuarios + Paginación */}
        <div className="hu7-contenedorINF">
          
          <div className="hu7-barra-filtros-usuarios">
            <div className="hu7-filtro-buscar">
              <label htmlFor="input-buscar-usuario">BUSCAR</label>
              <input 
                id="input-buscar-usuario" 
                type="text" 
                placeholder="Nombre, correo o código..." 
                className="hu7-input-buscar"
              />
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-rol">ROL</label>
              <select id="select-rol" defaultValue="Todos" className="hu7-select-filtro">
                <option value="Todos">Todos</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Asesor">Asesor</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-estado-usuario">ESTADO</label>
              <select id="select-estado-usuario" defaultValue="Todos" className="hu7-select-filtro">
                <option value="Todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Por validar">Por validar</option>
              </select>
            </div>

            <div className="hu7-filtro-select">
              <label htmlFor="select-carrera-dpto">CARRERA / DEPARTAMENTO</label>
              <select id="select-carrera-dpto" defaultValue="Todos" className="hu7-select-filtro">
                <option value="Todos">Todos</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Estudios Generales">Estudios Generales</option>
                <option value="Coordinación TFC">Coordinación TFC</option>
              </select>
            </div>
          </div>

          <div className="hu7-tarjeta-tabla-usuarios">
            
            {/* TABLA PRINCIPAL */}
            <table className="hu7-tabla-usuarios">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>ROL</th>
                  <th>CARRERA / DEPARTAMENTO</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>

            <div className="hu7-paginacion-usuarios">
              <span>Mostrando 1-8 de 86</span>
              <div className="hu7-botones-paginacion">
                <button type="button" className="hu7-btn-pag" disabled>Anterior</button>
                <button type="button" className="hu7-btn-pag active">1</button>
                <button type="button" className="hu7-btn-pag">2</button>
                <button type="button" className="hu7-btn-pag">3</button>
                <button type="button" className="hu7-btn-pag">Siguiente</button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer detalle="única sección con gestión de roles" />
    </div>
  );
}
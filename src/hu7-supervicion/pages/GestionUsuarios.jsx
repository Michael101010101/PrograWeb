import React, { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import ModalBloquearUsuario from '../components/ModalBloquearUsuario.jsx';
import ModalValidarAsesor from '../components/ModalValidarAsesor.jsx';
import '../hu7.css';
import '../GestionUsuarios.css';

// Datos iniciales de los usuarios
const usuariosIniciales = [
  {
    id: 1,
    nombre: "Jorge Luis Tapia Bendezú",
    correo: "jtapia@aloe.ulima.edu.pe",
    codigo: "20211357",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "Diego Alonso Ramírez Puente",
    correo: "dramirez@aloe.ulima.edu.pe",
    codigo: "20210984",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Activo"
  },
  {
    id: 3,
    nombre: "Dra. Mariela Quispe Ramos",
    correo: "mquispe@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Ingeniería de Sistemas",
    estado: "Activo"
  },
  {
    id: 4,
    nombre: "Ing. Luis Fernando Ocampo Salas",
    correo: "locampo@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Estudios Generales",
    estado: "Activo"
  },
  {
    id: 5,
    nombre: "Mg. Andrés Chávez Ninahuanca",
    correo: "achavez@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Departamento de Ingeniería Industrial",
    estado: "Por validar"
  },
  {
    id: 6,
    nombre: "Mg. Julio Vargas Aliaga",
    correo: "jvargas@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Por validar"
  },
  {
    id: 7,
    nombre: "Coordinación TFC General",
    correo: "tfc@ulima.edu.pe",
    codigo: "",
    rol: "Administrador",
    carreraDepartamento: "Coordinación TFC",
    estado: "Activo"
  },
  {
    id: 8,
    nombre: "Carlos Eduardo Ynga Solis",
    correo: "cynga@aloe.ulima.edu.pe",
    codigo: "20201122",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Civil",
    estado: "Bloqueado"
  }
];

export default function GestionUsuarios() {
  // 1. Estado para almacenar la lista de usuarios (permite modificar estados en vivo)
  const [listaUsuarios, setListaUsuarios] = useState(usuariosIniciales);

  // 2. Filtros de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroCarrera, setFiltroCarrera] = useState('Todos');

  // 3. Estados para controlar las ventanas emergentes (modales)
  const [modalBloquearAbierto, setModalBloquearAbierto] = useState(false);
  const [usuarioABloquear, setUsuarioABloquear] = useState(null);

  const [modalValidarAbierto, setModalValidarAbierto] = useState(false);
  const [asesorAValidar, setAsesorAValidar] = useState(null);

  // Lógica de filtrado en tiempo real
  const usuariosFiltrados = listaUsuarios.filter((u) => {
    const coincideTexto = 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.codigo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideRol = filtroRol === 'Todos' || u.rol === filtroRol;
    const coincideEstado = filtroEstado === 'Todos' || u.estado === filtroEstado;
    const coincideCarrera = filtroCarrera === 'Todos' || u.carreraDepartamento === filtroCarrera;

    return coincideTexto && coincideRol && coincideEstado && coincideCarrera;
  });

  // Helper para asignar clase CSS a las etiquetas de estado
  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'Activo': return 'estado-activo';
      case 'Bloqueado': return 'estado-bloqueado';
      case 'Por validar': return 'estado-pendiente';
      default: return '';
    }
  };

  // abrir ventana para validar el primer asesor pendiente
  const abrirValidarAsesores = () => {
    const candidato = listaUsuarios.find((u) => u.estado === 'Por validar') || listaUsuarios[4];
    setAsesorAValidar(candidato);
    setModalValidarAbierto(true);
  };

  // abrir ventana para bloquear un usuario específico
  const abrirBloquearUsuario = (usuario) => {
    setUsuarioABloquear(usuario);
    setModalBloquearAbierto(true);
  };

  const registrarNuevoUsuario = () => {
    alert("Abriendo formulario para registrar un nuevo usuario.");
  };

  // cambia el estado del usuario a "Bloqueado" en la tabla
  const confirmarBloqueo = (id, motivo) => {
    setListaUsuarios((usuariosPrevios) =>
      usuariosPrevios.map((u) =>
        u.id === id ? { ...u, estado: 'Bloqueado', motivoBloqueo: motivo } : u
      )
    );
    setModalBloquearAbierto(false);
  };

  // valida la cuenta del asesor, asigna rol y pasa su estado a "Activo"
  const confirmarValidacion = (id, cupoMaximo, rolAsignado) => {
    setListaUsuarios((usuariosPrevios) =>
      usuariosPrevios.map((u) =>
        u.id === id 
          ? { ...u, estado: 'Activo', rol: rolAsignado, cupoMaximo: cupoMaximo } 
          : u
      )
    );
    setModalValidarAbierto(false);
  };

  return (
    <PageLayout>
      <main className="hu7-contenido-principal">
        
        {/* Cabecera Superior */}
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Usuarios</h6>
            <h1 className="hu7-titulo-pantalla">Gestión de usuarios</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              86 usuarios · 64 estudiantes · 38 asesores · 2 administradores · 3 bloqueados
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button 
              type="button" 
              className="hu7-boton-validar"
              onClick={abrirValidarAsesores}
            >
              Validar cuentas de asesor (2)
            </button>
            <button 
              type="button" 
              className="hu7-boton-registrar"
              onClick={registrarNuevoUsuario}
            >
              Registrar usuario
            </button>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="hu7-contenedorINF">
          
          {/* Barra de Filtros */}
          <div className="hu7-barra-filtros-usuarios">
            <div className="hu7-filtro-buscar">
              <label htmlFor="input-buscar-usuario">BUSCAR</label>
              <input 
                id="input-buscar-usuario" 
                type="text" 
                placeholder="Nombre, correo o código..." 
                className="hu7-input-buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}/>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-rol">ROL</label>
              <select 
                id="seleccionar-rol" 
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                className="hu7-seleccionar-filtro">

                <option value="Todos">Todos</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Asesor">Asesor</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-estado-usuario">ESTADO</label>
              <select 
                id="seleccionar-estado-usuario" 
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="hu7-seleccionar-filtro">

                <option value="Todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Por validar">Por validar</option>
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-carrera-dpto">CARRERA / DEPARTAMENTO</label>
              <select 
                id="seleccionar-carrera-dpto" 
                value={filtroCarrera}
                onChange={(e) => setFiltroCarrera(e.target.value)}
                className="hu7-seleccionar-filtro">
                  
                <option value="Todos">Todos</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Estudios Generales">Estudios Generales</option>
                <option value="Coordinación TFC">Coordinación TFC</option>
              </select>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="hu7-tarjeta-tabla-usuarios">
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
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td className="hu7-col-usuario">
                        <div className="hu7-nombre-usuario">{u.nombre}</div>
                        <div className="hu7-meta-usuario">
                          {u.correo} {u.codigo ? `· ${u.codigo}` : ''}
                        </div>
                      </td>

                      <td>
                        <span className="hu7-texto-rol">{u.rol}</span>
                      </td>

                      <td>{u.carreraDepartamento}</td>

                      <td>
                        <span className={`hu7-estado ${obtenerClaseEstado(u.estado)}`}>
                          {u.estado}
                        </span>
                      </td>

                      <td>
                        <button 
                          type="button" 
                          className="hu7-boton-editar"
                          onClick={() => abrirBloquearUsuario(u)}
                        >
                          Bloquear
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="hu7-tabla-vacia">
                      No se encontraron usuarios con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="hu7-paginacion-usuarios">
              <span>
                Mostrando {usuariosFiltrados.length > 0 ? `1-${usuariosFiltrados.length}` : '0'} de 86
              </span>
              <div className="hu7-botones-paginacion">
                <button type="button" className="hu7-boton-pag" disabled>Anterior</button>
                <button type="button" className="hu7-boton-pag active">1</button>
                <button type="button" className="hu7-boton-pag">2</button>
                <button type="button" className="hu7-boton-pag">3</button>
                <button type="button" className="hu7-boton-pag">Siguiente</button>
              </div>
            </div>

          </div>

        </div>

        {/* Ventanas Emergentes (Modales) */}
        <ModalBloquearUsuario
          isOpen={modalBloquearAbierto}
          onClose={() => setModalBloquearAbierto(false)}
          usuario={usuarioABloquear}
          onConfirmarBloqueo={confirmarBloqueo}
        />

        <ModalValidarAsesor
          isOpen={modalValidarAbierto}
          onClose={() => setModalValidarAbierto(false)}
          asesor={asesorAValidar}
          onConfirmarValidacion={confirmarValidacion}
          onRechazar={() => setModalValidarAbierto(false)}
        />

      </main>
    </PageLayout>
  );
}
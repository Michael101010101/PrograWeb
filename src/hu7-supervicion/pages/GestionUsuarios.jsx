import React, { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import ModalBloquearUsuario from '../components/ModalBloquearUsuario.jsx';
import ModalValidarAsesor from '../components/ModalValidarAsesor.jsx';
import '../hu7.css';
import '../GestionUsuarios.css';


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
  },
  {
    id: 9,
    nombre: "Rosa Elena Quispe Mendoza",
    correo: "rquispe@aloe.ulima.edu.pe",
    codigo: "20211358",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería de Sistemas",
    estado: "Activo"
  },
  {
    id: 10,
    nombre: "Dr. Pedro Salazar Huamán",
    correo: "psalazar@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Ingeniería de Sistemas",
    estado: "Activo"
  },
  // --- A PARTIR DE AQUI SE MUESTRAN EN LA PAGINA 2 (8 USUARIOS) ---
  {
    id: 11,
    nombre: "Dra. Gabriela Torres Anchante",
    correo: "gtorres@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Estudios Generales",
    estado: "Activo"
  },
  {
    id: 12,
    nombre: "Mg. Sandra Bustamante Ríos",
    correo: "sbustamante@ulima.edu.pe",
    codigo: "",
    rol: "Asesor",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Activo"
  },
  {
    id: 13,
    nombre: "Andrea Sofía Ferreyra Palomino",
    correo: "aferreyra@aloe.ulima.edu.pe",
    codigo: "20213045",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería de Sistemas",
    estado: "Activo"
  },
  {
    id: 14,
    nombre: "Carmen Rosa Velásquez Ayala",
    correo: "cvelasquez@ulima.edu.pe",
    codigo: "",
    rol: "Administrador",
    carreraDepartamento: "Coordinación TFC",
    estado: "Activo"
  },
  {
    id: 15,
    nombre: "Luis Alberto Mendoza Loza",
    correo: "lmendoza@aloe.ulima.edu.pe",
    codigo: "20204512",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Civil",
    estado: "Activo"
  },
  {
    id: 16,
    nombre: "Valeria Nicole Rojas Ttito",
    correo: "vrojas@aloe.ulima.edu.pe",
    codigo: "20210089",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Bloqueado"
  },
  {
    id: 17,
    nombre: "Mateo Sebastián Aguirre Cárdenas",
    correo: "maguirre@aloe.ulima.edu.pe",
    codigo: "20212211",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería de Sistemas",
    estado: "Activo"
  },
  {
    id: 18,
    nombre: "Claudia María Solis Ccahuana",
    correo: "csolis@aloe.ulima.edu.pe",
    codigo: "20208834",
    rol: "Estudiante",
    carreraDepartamento: "Ingeniería Industrial",
    estado: "Bloqueado"
  }
];

export default function GestionUsuarios() {
  // estado para almacenar la lista de usuarios (permite modificar estados en vivo)
  const [listaUsuarios, setListaUsuarios] = useState(usuariosIniciales);

  // filtros de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroCarrera, setFiltroCarrera] = useState('Todos');

  //   estado para la paginacion dinamica (cambiamos a 10 elementos por pagina)
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10; // aca definimos 10 por vista para que salgan 10 en la pag 1 y 8 en la pag 2

  // estados para controlar las ventanas emergentes (modales)
  const [modalBloquearAbierto, setModalBloquearAbierto] = useState(false);
  const [usuarioABloquear, setUsuarioABloquear] = useState(null);

  const [modalValidarAbierto, setModalValidarAbierto] = useState(false);
  const [asesorAValidar, setAsesorAValidar] = useState(null);

  // estado para el modal de registrar nuevo usuario
  const [modalRegistrarAbierto, setModalRegistrarAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoRol, setNuevoRol] = useState('Estudiante');
  const [nuevaCarrera, setNuevaCarrera] = useState('Ingeniería de Sistemas');

  // logica de filtrado en tiempo real
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

  // Cacalculo de usuarios paginados
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

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
  const abrirValidarAsesores = (asesorEspecifico = null) => {
    const candidato = asesorEspecifico || listaUsuarios.find((u) => u.estado === 'Por validar') || listaUsuarios[4];
    setAsesorAValidar(candidato);
    setModalValidarAbierto(true);
  };

  // abrir ventana para bloquear un usuario específico
  const abrirBloquearUsuario = (usuario) => {
    setUsuarioABloquear(usuario);
    setModalBloquearAbierto(true);
  };

  // desbloquea un usuario directamente en la lista
  const desbloquearUsuario = (id) => {
    setListaUsuarios((prev) =>
      prev.map((u) => u.id === id ? { ...u, estado: 'Activo' } : u)
    );
  };

  // abre el modal para registrar nuevo usuario
  const registrarNuevoUsuario = () => {
    setModalRegistrarAbierto(true);
  };

  // guarda el nuevo usuario registrado
  const handleGuardarNuevoUsuario = (e) => {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      nombre: nuevoNombre,
      correo: nuevoCorreo,
      codigo: nuevoCodigo,
      rol: nuevoRol,
      carreraDepartamento: nuevaCarrera,
      estado: "Activo"
    };
    setListaUsuarios([nuevo, ...listaUsuarios]);
    setModalRegistrarAbierto(false);
    setNuevoNombre('');
    setNuevoCorreo('');
    setNuevoCodigo('');
  };

  // cambia el estado del usuario a "Bloqueado" en la tabla
  const confirmarBloqueo = (id, motivo) => {
    setListaUsuarios((usuariosPrevios) =>
      usuariosPrevios.map((u) =>
        u.id === id ? { ...u, estado: 'Bloqueado', motivoBloqueo: motivo } : u
      )  );
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
        
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Usuarios</h6>
            <h1 className="hu7-titulo-pantalla">Gestión de usuarios</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              {listaUsuarios.length} usuarios · {listaUsuarios.filter(u=>u.rol==='Estudiante').length} estudiantes · {listaUsuarios.filter(u=>u.rol==='Asesor').length} asesores · {listaUsuarios.filter(u=>u.rol==='Administrador').length} administradores · {listaUsuarios.filter(u=>u.estado==='Bloqueado').length} bloqueados
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button 
              type="button" 
              className="hu7-boton-validar"
              onClick={() => abrirValidarAsesores()}   >
              Validar cuentas de asesor ({listaUsuarios.filter(u => u.estado === 'Por validar').length})
            </button>
            <button 
              type="button" 
              className="hu7-boton-registrar"
              onClick={registrarNuevoUsuario}  >
              Registrar usuario
            </button>
          </div>
        </div>


        <div className="hu7-contenedorINF">
          
          {/*  barra de filtros */}
          <div className="hu7-barra-filtros-usuarios">
            <div className="hu7-filtro-buscar">
              <label htmlFor="input-buscar-usuario">BUSCAR</label>
              <input 
                id="input-buscar-usuario" 
                type="text" 
                placeholder="Nombre, correo o código..." 
                className="hu7-input-buscar"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);      }}/>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-rol">ROL</label>
              <select 
                id="seleccionar-rol" 
                value={filtroRol}
                onChange={(e) => {
                  setFiltroRol(e.target.value);
                  setPaginaActual(1);  }}
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
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setPaginaActual(1);
                }}
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
                onChange={(e) => {
                  setFiltroCarrera(e.target.value);
                  setPaginaActual(1); }}
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

          {/* tabla usuarios */}
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
                {usuariosPaginados.length > 0 ? (
                  usuariosPaginados.map((u) => (
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
                        {u.rol === 'Administrador' ? (
                          <span className="hu7-texto-tu-cuenta">Tu cuenta</span>
                        ) : u.estado === 'Por validar' ? (
                          <button 
                            type="button" 
                            className="hu7-boton-validar-tabla"
                            onClick={() => abrirValidarAsesores(u)}  >
                            Validar cuenta
                          </button>
                        ) : u.estado === 'Bloqueado' ? (
                          <button 
                            type="button" 
                            className="hu7-boton-desbloquear"
                            onClick={() => desbloquearUsuario(u.id)}   >
                            Desbloquear
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="hu7-boton-editar"
                            onClick={() => abrirBloquearUsuario(u)} >
                            Bloquear
                          </button>
                        )}
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
                Mostrando {usuariosFiltrados.length > 0 ? `${indiceInicio + 1}-${Math.min(indiceInicio + elementosPorPagina, usuariosFiltrados.length)}` : '0'} de {usuariosFiltrados.length}
              </span>
              <div className="hu7-botones-paginacion">
                <button 
                  type="button" 
                  className="hu7-boton-pag" 
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(prev => prev - 1)}   >
                  Anterior
                </button>
                
                {Array.from({ length: totalPaginas }, (_, index) => (
                  <button 
                    key={index + 1}
                    type="button" 
                    className={`hu7-boton-pag ${paginaActual === index + 1 ? 'active' : ''}`}   >
                    {index + 1}
                  </button>
                ))}

                <button 
                  type="button" 
                  className="hu7-boton-pag" 
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual(prev => prev + 1)}  >
                  Siguiente
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* modal para Registrar Nuevo Usuario */}
        {modalRegistrarAbierto && (
          <div className="hu7-modal-overlay">
            <div className="hu7-modal-contenido">
              <div className="hu7-modal-header">
                <h3>Registrar Nuevo Usuario</h3>
                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalRegistrarAbierto(false)}>×</button>
              </div>
              <form onSubmit={handleGuardarNuevoUsuario}>
                <div className="hu7-modal-body hu7-form-registrar">
                  <div className="hu7-campo-form">
                    <label>Nombre Completo:</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. Ana María Torres" 
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}   />
                  </div>
                  <div className="hu7-campo-form">
                    <label>Correo Institucional:</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="ejemplo@ulima.edu.pe" 
                      value={nuevoCorreo}
                      onChange={(e) => setNuevoCorreo(e.target.value)}/>
                  </div>
                  <div className="hu7-campo-form">
                    <label>Código (opcional):</label>
                    <input 
                      type="text" 
                      placeholder="Ej. 20214589" 
                      value={nuevoCodigo}
                      onChange={(e) => setNuevoCodigo(e.target.value)}/>
                  </div>
                  <div className="hu7-campo-form">
                    <label>Rol:</label>
                    <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Asesor">Asesor</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="hu7-campo-form">
                    <label>Carrera / Departamento:</label>
                    <select value={nuevaCarrera} onChange={(e) => setNuevaCarrera(e.target.value)}>
                      <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                      <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                      <option value="Ingeniería Civil">Ingeniería Civil</option>
                      <option value="Estudios Generales">Estudios Generales</option>
                      <option value="Coordinación TFC">Coordinación TFC</option>
                    </select>
                  </div>
                </div>
                <div className="hu7-modal-footer-botones">
                  <button type="button" className="hu7-boton-cancelar" onClick={() => setModalRegistrarAbierto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="hu7-boton-registrar">
                    Guardar usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ventanas emergentes */}
        <ModalBloquearUsuario
          isOpen={modalBloquearAbierto}
          onClose={() => setModalBloquearAbierto(false)}
          usuario={usuarioABloquear}
          onConfirmarBloqueo={confirmarBloqueo}/>

        <ModalValidarAsesor
          isOpen={modalValidarAbierto}
          onClose={() => setModalValidarAbierto(false)}
          asesor={asesorAValidar}
          onConfirmarValidacion={confirmarValidacion}
          onRechazar={() => setModalValidarAbierto(false)}/>

      </main>
    </PageLayout>
  );
}
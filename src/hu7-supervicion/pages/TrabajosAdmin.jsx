import React, { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import * as XLSX from 'xlsx';
import '../hu7.css';
import '../TrabajosAdmin.css';


const trabajosData = [
  {
    codigo: "TFC-2026-2-047",
    titulo: "Modelo predictivo de deserción en estudiantes de primer ciclo",
    linea: "Ciencia de datos",
    equipo: "Quispe, Ramirez",
    asesor: "Quispe Ramos",
    avance: 55,
    estado: "En desarrollo",
    carrera: "Ingeniería de Sistemas"
  },
  {
    codigo: "TFC-2026-2-012",
    titulo: "Optimización de rutas de reparto para comercios de Lima Metropolitana",
    linea: "Gestión de operaciones",
    equipo: "Rojas, Tapia",
    asesor: "Vargas Aliaga",
    avance: 100,
    estado: "Concluido",
    carrera: "Ingeniería Industrial"
  },

  {
    codigo: "TFC-2026-2-051",
    titulo: "Automatización del control de calidad en líneas de envasado de conservas",
    linea: "Automatización y control",
    equipo: "Tapia, Ferreyra",
    asesor: "Sin asesor",
    avance: 0,
    estado: "Propuesta",
    carrera: "Ingeniería Industrial"
  },
  {
    codigo: "TFC-2026-2-029",
    titulo: "Detección temprana de fallas en bombas de agua mediante señales de vibración",
    linea: "Ciencia de datos",
    equipo: "Aguirre, Palomino",
    asesor: "Salazar Huamán",
    avance: 15,
    estado: "En desarrollo",
    carrera: "Ingeniería de Sistemas"
  },
  {
    codigo: "TFC-2026-2-018",
    titulo: "Plataforma de tutoría entre pares para cursos de matemática básica",
    linea: "Innovación educativa",
    equipo: "Ccahuana",
    asesor: "Quispe Ramos",
    avance: 55,
    estado: "En desarrollo",
    carrera: "Ingeniería de Sistemas"
  },
  {
    codigo: "TFC-2026-2-006",
    titulo: "Clasificación automática de reclamos ciudadanos en municipalidades distritales",
    linea: "Ciencia de datos",
    equipo: "Palomino, Ferreyra",
    asesor: "Quispe Ramos",
    avance: 100,
    estado: "Concluido",
    carrera: "Ingeniería de Sistemas"
  },
  {
    codigo: "TFC-2026-2-033",
    titulo: "Tablero de indicadores de asistencia para colegios públicos de Lima Sur",
    linea: "Innovación educativa",
    equipo: "Ferreyra",
    asesor: "Torres Anchante",
    avance: 35,
    estado: "En desarrollo",
    carrera: "Ingeniería Industrial"
  },
  {
    codigo: "TFC-2026-2-021",
    titulo: "Evaluación de techos verdes en la reducción de isla de calor en San Isidro",
    linea: "Sostenibilidad urbana",
    equipo: "Mendoza, Ynga",
    asesor: "Ocampo Salas",
    avance: 35,
    estado: "En desarrollo",
    carrera: "Ingeniería Civil"
  },
  {
    codigo: "TFC-2026-2-040",
    titulo: "Reducción de mermas en almacenes de productos perecibles en Lima Norte",
    linea: "Gestión de operaciones",
    equipo: "Bustamante, Solis",
    asesor: "Vargas Aliaga",
    avance: 75,
    estado: "En desarrollo",
    carrera: "Ingeniería Industrial"
  },
  {
    codigo: "TFC-2026-2-055",
    titulo: "Monitoreo de calidad del aire con sensores de bajo costo en Ate",
    linea: "Automatización y control",
    equipo: "Ninahuanca",
    asesor: "Sin asesor",
    avance: 0,
    estado: "Propuesta",
    carrera: "Ingeniería Industrial"
  },
  {
    codigo: "TFC-2026-2-024",
    titulo: "Programación de turnos en policlínicos municipales con simulación discreta",
    linea: "Gestión de operaciones",
    equipo: "Ttito, Cárcamo",
    asesor: "Bustamante Ríos",
    avance: 20,
    estado: "Propuesta",
    carrera: "Ingeniería Industrial"
  },
  {
    codigo: "TFC-2026-2-009",
    titulo: "Refuerzo estructural de viviendas autoconstruidas en laderas de Carabayllo",
    linea: "Sostenibilidad urbana",
    equipo: "Ocampo, Loza",
    asesor: "Cárdenas Loayza",
    avance: 15,
    estado: "Desistido",
    carrera: "Ingeniería Civil"
  }
];

export default function TrabajosAdmin() {
  // Estados para controlar filtros 
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroLinea, setFiltroLinea] = useState('Todas');
  const [filtroAsesor, setFiltroAsesor] = useState('Todos');
  const [filtroCarrera, setFiltroCarrera] = useState('Todas');

  // logica del filtrado dinámico
  const trabajosFiltrados = trabajosData.filter((item) => {
    const coincideTexto = 
      item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.equipo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'Todos' || item.estado === filtroEstado;
    const coincideLinea = filtroLinea === 'Todas' || item.linea === filtroLinea;
    const coincideAsesor = filtroAsesor === 'Todos' || item.asesor === filtroAsesor;
    const coincideCarrera = filtroCarrera === 'Todas' || item.carrera === filtroCarrera;

    return coincideTexto && coincideEstado && coincideLinea && coincideAsesor && coincideCarrera;
  });

  // Función para exportar a Excel (tiene js)
  const handleExportarExcel = () => {
    const datosExcel = trabajosFiltrados.map((item) => ({
      "CÓDIGO": item.codigo,
      "TÍTULO": item.titulo,
      "LÍNEA": item.linea,
      "CARRERA": item.carrera,
      "EQUIPO": item.equipo,
      "ASESOR": item.asesor,
      "AVANCE (%)": `${item.avance}%`,
      "ESTADO": item.estado
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajos de periodo");

    XLSX.writeFile(workbook, "2026-2-TrabajosdePeriodo.xlsx");
  };

  const getClaseEstado = (estado) => {
    switch (estado) {
      case 'Propuesta': return 'estado-propuesta';
      case 'En desarrollo': return 'estado-desarrollo';
      case 'Concluido': return 'estado-concluido';
      case 'Desistido': return 'estado-desistido';
      default: return '';
    }
  };

  return (
    <PageLayout>
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
            <button 
              type="button" 
              className="hu7-boton-exportar"
              onClick={handleExportarExcel}
            >   Exportar a Excel
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
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}  
              />
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-estado">ESTADO</label>
              <select 
                id="select-estado" 
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="hu7-seleccionar-filtro"
              >
                <option value="Todos">Todos</option>
                <option value="Propuesta">Propuesta</option>
                <option value="En desarrollo">En desarrollo</option>
                <option value="Concluido">Concluido</option>
                <option value="Desistido">Desistido</option>
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-linea">LÍNEA</label>
              <select 
                id="seleccionar-linea" 
                value={filtroLinea} 
                onChange={(e) => setFiltroLinea(e.target.value)}
                className="hu7-seleccionar-filtro"
              >
                <option value="Todas">Todas</option>
                <option value="Ciencia de datos">Ciencia de datos</option>
                <option value="Gestión de operaciones">Gestión de operaciones</option>
                <option value="Automatización y control">Automatización y control</option>
                <option value="Innovación educativa">Innovación educativa</option>
                <option value="Sostenibilidad urbana">Sostenibilidad urbana</option>
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-asesor">ASESOR</label>
              <select 
                id="seleccionar-asesor" 
                value={filtroAsesor} 
                onChange={(e) => setFiltroAsesor(e.target.value)}
                className="hu7-seleccionar-filtro"
              >
                <option value="Todos">Todos</option>
                <option value="Quispe Ramos">Quispe Ramos</option>
                <option value="Vargas Aliaga">Vargas Aliaga</option>
                <option value="Salazar Huamán">Salazar Huamán</option>
                <option value="Torres Anchante">Torres Anchante</option>
                <option value="Ocampo Salas">Ocampo Salas</option>
                <option value="Bustamante Ríos">Bustamante Ríos</option>
                <option value="Sin asesor">Sin asesor</option>
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-carrera">CARRERA</label>
              <select 
                id="seleccionar-carrera" 
                value={filtroCarrera} 
                onChange={(e) => setFiltroCarrera(e.target.value)}
                className="hu7-seleccionar-filtro"
              >
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
                {trabajosFiltrados.length > 0 ? (
                  trabajosFiltrados.map((item) => (
                    <tr key={item.codigo}>
                      <td className="hu7-col-titulo">
                        <div className="hu7-titulo-trabajo">{item.titulo}</div>
                        <div className="hu7-codigo-trabajo">{item.codigo}</div>
                      </td>

                      <td>{item.linea}</td>
                      <td>{item.equipo}</td>

                      <td>
                        <span className={item.asesor === 'Sin asesor' ? 'hu7-sin-asesor' : ''}>
                          {item.asesor}
                        </span>
                      </td>

                      <td className="hu7-col-avance">
                        <span className="hu7-texto-avance">{item.avance}%</span>
                        <div className="hu7-barra-progreso-bg">
                          <div 
                            className="hu7-barra-progreso-fill" 
                            style={{ width: `${item.avance}%`, backgroundColor: '#1E4534' }}
                          />
                        </div>
                      </td>

                      <td>
                        <span className={`hu7-estado ${getClaseEstado(item.estado)}`}>
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="hu7-tabla-vacia">
                      No se encontraron trabajos con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginacion */}
            <div className="hu7-paginacion-trabajos">
              <span>Mostrando {trabajosFiltrados.length > 0 ? `1-${trabajosFiltrados.length}` : '0'} de {trabajosData.length}</span>
              <div className="hu7-botones-paginacion">
                <button type="button" className="hu7-boton-pag" disabled>Anterior</button>
                <button type="button" className="hu7-boton-pag active">1</button>
                <button type="button" className="hu7-boton-pag" disabled>Siguiente</button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </PageLayout>
  );
}
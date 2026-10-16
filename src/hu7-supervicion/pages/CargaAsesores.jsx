import React from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import * as XLSX from 'xlsx';
import '../hu7.css';
import '../CargaAsesores.css';


  // datos 
  const asesoresData = [
  {
    id: 1,
    nombre: "Ing. Luis Fernando Ocampo Salas",
    carrera: "Ingeniería Civil",
    ocupado: 5,
    total: 5,           
    disponible: 0,
    porRevisar: 3,
    tiempoRevision: "5.1 días"
  },
  {
    id: 2,
    nombre: "Mg. Sandra Bustamante Ríos",
    carrera: "Ingeniería Industrial",
    ocupado: 3,
    total: 4,
    disponible: 1,
    porRevisar: 2,
    tiempoRevision: "3.8 días"
  },
  {
    id: 3,
    nombre: "Dra. Mariela Quispe Ramos",
    carrera: "Ingeniería de Sistemas",
    ocupado: 3,
    total: 6,
    disponible: 3,
    porRevisar: 6,
    tiempoRevision: "2.4 días"
  },
  {
    id: 4,
    nombre: "Mg. Julio Vargas Aliaga",
    carrera: "Ingeniería Industrial",
    ocupado: 3,
    total: 5,
    disponible: 2,
    porRevisar: 1,
    tiempoRevision: "1.9 días"
  },
  {
    id: 5,
    nombre: "Dr. Pedro Salazar Huamán",
    carrera: "Ingeniería de Sistemas",
    ocupado: 3,
    total: 5,
    disponible: 2,
    porRevisar: 0,
    tiempoRevision: "2.0 días"
  },
  {
    id: 6,
    nombre: "Dra. Gabriela Torres Anchante",
    carrera: "Estudios Generales",
    ocupado: 2,
    total: 5,
    disponible: 3,
    porRevisar: 1,
    tiempoRevision: "2.7 días"
  }
  ];

export default function CargaAsesores() {

  const periodo = "2026-2";

  const handleExportarExcel = () => {
    // A. Mapear los datos para definir los nombres exactos de las columnas en el Excel
    const datosExcel = asesoresData.map((item) => ({
      "ASESOR": item.nombre,
      "CARRERA": item.carrera,
      "CUPO OCUPADO": `${item.ocupado}/${item.total}`,
      "DISPONIBLE": item.disponible,
      "POR REVISAR": item.porRevisar,
      "TIEMPO DE REVISIÓN": item.tiempoRevision
    }));

    // Convertir el arreglo de objetos a una hoja de cálculo (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Crear un nuevo libro de trabajo (Workbook) y adjuntar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Carga de Asesores");

    //  Descargar archivo con el nombre especificado en el requerimiento
    XLSX.writeFile(workbook, "tfc-2026-2-metricas.xlsx");
  };
  // estos const son de los botones para interactividad
  const handleExportar = () => {
    alert("Exportando reporte de carga de asesores a Excel...");
  };

  const handleVerDetalle = (nombre) => {
    alert(`Viendo detalle del asesor: ${nombre}`);
  };

  const handleEscribirAsesor = () => {
    alert("Abriendo ventana para escribir al Ing. Ocampo Salas...");
  };

  const handleAmpliarCupo = () => {
    alert("Solicitando ampliación de cupo máximo...");
  };

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
            <button type="button" className="hu7-boton-exportar" onClick={handleExportarExcel}>
              Exportar a Excel
            </button>
          </div>
        </div>


        <div className="hu7-contenedorINF">
          
          <div className="hu7-tarjeta-tabla-asesores">
              <table className="hu7-tabla-asesores">
                <thead>
                  <tr>
                    <th>ASESOR</th>
                    <th>CUPO OCUPADO</th>
                    <th>DISPONIBLE</th>
                    <th>POR REVISAR</th>
                    <th>TIEMPO DE REVISIÓN</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {asesoresData.map((asesor) => {
                    // Cálculo matemático del porcentaje ocupado
                    const porcentaje = (asesor.ocupado / asesor.total) * 100;

                    //Selección de color según el estado de ocupado
                    let colorBarra = '#1E7F4D'; 
                    if (porcentaje === 100) {
                      colorBarra = '#B4322B';   
                    } else if (porcentaje >= 70) {
                      colorBarra = '#B7791F';   
                    }

                    return (
                      <tr key={asesor.id}>
                        <td className="hu7-col-asesor">
                          <div className="hu7-nombre-asesor">{asesor.nombre}</div>
                          <div className="hu7-carrera-asesor">{asesor.carrera}</div>
                        </td>

                        <td className="hu7-col-cupo">
                          <div className="hu7-contenedor-cupo">
                            <span className="hu7-texto-cupo">
                              {asesor.ocupado}/{asesor.total}
                            </span>
                            <div className="hu7-barra-progreso-bg">
                              <div 
                                className="hu7-barra-progreso-fill" 
                                style={{ 
                                  width: `${porcentaje}%`, 
                                  backgroundColor: colorBarra 
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>{asesor.disponible}</td>
                        <td>{asesor.porRevisar}</td>
                        <td>{asesor.tiempoRevision}</td>
                        <td>
                          <button type="button" className="hu7-boton-detalle" onClick={() => handleVerDetalle(asesor.nombre)}>
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>


            <div className="hu7-fila-resumen-asesores">

              {/* Tarjeta de Recomendacion (lo de samarillo)*/}
              <div className="hu7-tarjeta-recomendacion">
                <div className="hu7-contenido-recomendacion">
                  <h3>Recomendación de redistribución</h3>
                  <p className='recomendacion-texto'>
                    El Ing. Ocampo Salas está al 100% de su cupo y con 3 avances en espera hace más de 5 días. 
                    Considera derivar las solicitudes de Automatización y control al Mg. Andrés Chávez Ninahuanca (4 cupos libres) 
                    o al Dr. Pedro Salazar Huamán (2 cupos libres).
                  </p>
                </div>
                <div className="hu7-botones-recomendacion">
                  <button 
                    type="button" 
                    className="hu7-boton-escribir"
                    onClick={handleEscribirAsesor}
                  >
                    Escribir al asesor
                  </button>
                  <button 
                    type="button" 
                    className="hu7-boton-ampliar"
                    onClick={handleAmpliarCupo}
                  >
                    Ampliar su cupo máximo
                  </button>
                </div>
              </div>

              {/* Tarjeta de Resumen de la facultad */}
              <div className="hu7-tarjeta-resumen-facultad">
                <h3>RESUMEN DE LA FACULTAD</h3>
                <div className="hu7-metricas-resumen">
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">CUPOS OCUPADOS</span>
                    <span className="hu7-metrica-valor">19 de 30</span>
                  </div>
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">ASESORES SIN CARGA</span>
                    <span className="hu7-metrica-valor">32</span>
                  </div>
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">REVISIÓN PROMEDIO</span>
                    <span className="hu7-metrica-valor">2.9 días</span>
                  </div>
                </div>


                <p className="hu7-nota-objetivo">
                  El objetivo institucional es responder cada avance en un máximo de 4 días hábiles.
                </p>
              </div>  
            </div>
            </div>
      </main>
    </PageLayout>
  );
}
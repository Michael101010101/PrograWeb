import React, { useState } from 'react'; 
import PageLayout from '../../shared/components/PageLayout.jsx';
import * as XLSX from 'xlsx'; // libreria para descargar en excel
import '../hu7.css';
import '../CargaAsesores.css';

// datosssssssss iniciales de los asesores (lo pasamos a estado para que se actualice al ampliar cupo)
const asesoresDataInicial = [
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
  // estado para verificar si ya se realizó la exportación
  const [exportado, setExportado] = useState(false);
  const periodo = "2026-2";

  // para manejar los datos dinámicos y los modales interactivos
  const [asesoresData, setAsesoresData] = useState(asesoresDataInicial);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null); // guarda el asesor para el modal de detalle
  const [modalEscribir, setModalEscribir] = useState(false); // modal para mandar mensaje al profe 
  const [modalAmpliar, setModalAmpliar] = useState(false); // modal para subir el cupo
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [notificacionEscribir, setNotificacionEscribir] = useState(false);

  const handleExportarExcel = () => {
    // mapear los datos para definir nombres de columnas en Excel:
    const datosExcel = asesoresData.map((item) => ({
      "ASESOR": item.nombre,
      "CARRERA": item.carrera,
      "CUPO OCUPADO": `${item.ocupado}/${item.total}`,
      "DISPONIBLE": item.disponible,
      "POR REVISAR": item.porRevisar,
      "TIEMPO DE REVISIÓN": item.tiempoRevision
    }));

    // convertir a hoja de cálculo y crear libro
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // esta linea es para crear un nuevo libro de trabajo y adjuntar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Carga de Asesores");

    // descargar archivo Excel
    XLSX.writeFile(workbook, `${periodo}-CargadeAsesores.xlsx`);

    setExportado(true);
  };

  // Abre la ventana con el resumen completo del asesor
  const handleVerDetalle = (asesorObj) => {
    setAsesorSeleccionado(asesorObj);
  };

  // Abre el modal para escribirle al Ing. Ocampo Salas
  const EscribirAsesor = () => {
    setModalEscribir(true);
  };

  // Abre el modal para ampliar el cupo del Ing. Ocampo
  const AmpliarCupo = () => {
    setModalAmpliar(true);
  };

  // Confirmar el envio de mensaje
  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    setModalEscribir(false);
    setMensajeTexto("");
    setNotificacionEscribir(true);
    setTimeout(() => setNotificacionEscribir(false), 4000);
  };

  // Confirmar la ampliación de cupo (de 5/5 a 5/6)
  const handleConfirmarAmpliacion = () => {
    setAsesoresData(prev => prev.map(a => {
      if (a.id === 1) {
        return {
          ...a,
          total: a.total + 1,
          disponible: a.disponible + 1
        };
      }
      return a;
    }));
    setModalAmpliar(false);
  };

  return (
    <PageLayout>
      <main className="hu7-contenido-principal">
        
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Carga por asesor</h6>
            <h1 className="hu7-titulo-pantalla">Carga por asesor</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              {asesoresData.length} asesores con trabajos a cargo · ordenados por cupo ocupado
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button type="button" className="hu7-boton-exportar" onClick={handleExportarExcel}>
              Exportar a Excel
            </button>

            {/* si se exporta, luego sale esta nota: */}
            {exportado && (
              <div className="hu7-textito-exportado">
                <div className="hu7-textito-icono">✓</div>
                <div className="hu7-textito-info">
                  <div className="hu7-textito-titulo">Reporte exportado</div>
                  <div className="hu7-textito-exportar">
                    {periodo}-CargaAsesores.xlsx · 6 asesores
                  </div>
                </div>
                <button 
                  type="button" 
                  className="hu7-banner-cerrar" 
                  onClick={() => setExportado(false)}
                  title="Cerrar aviso">
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notificación cuando se le envía un mensaje al asesor */}
        {notificacionEscribir && (
          <div className="hu7-alerta-mensaje-enviado">
            ✓ Mensaje enviado correctamente al Ing. Luis Fernando Ocampo Salas
          </div>
        )}

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
                  const porcentaje = (asesor.ocupado / asesor.total) * 100;

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
                              }}/>
                          </div>
                        </div>
                      </td>

                      <td className={asesor.disponible === 0 ? "texto-rojo-bold" : "texto-verde-bold"}>
                        {asesor.disponible}
                      </td>
                      <td>{asesor.porRevisar}</td>
                      <td className={parseFloat(asesor.tiempoRevision) > 4 ? "texto-rojo-bold" : ""}>
                        {asesor.tiempoRevision}
                      </td>
                      <td>
                        <button type="button" className="hu7-boton-detalle" onClick={() => handleVerDetalle(asesor)}>
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
            {/* Tarjeta de Recomendación */}
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
                  onClick={EscribirAsesor}>
                  Escribir al asesor
                </button>
                <button 
                  type="button" 
                  className="hu7-boton-ampliar"
                  onClick={AmpliarCupo}>
                  Ampliar su cupo máximo
                </button>
              </div>
            </div>

            {/* tarjeta de Resumen de la facultad */}
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

        {/* MODAL 1: Resumen de detalle del Asesor */}
        {asesorSeleccionado && (
          <div className="hu7-modal-overlay">
            <div className="hu7-modal-contenido hu7-modal-resumen">
              <div className="hu7-modal-header">
                <h3>Resumen de Carga de Asesor</h3>
                <button type="button" className="hu7-modal-cerrar" onClick={() => setAsesorSeleccionado(null)}>×</button>
              </div>
              <div className="hu7-modal-body">
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Asesor:</span>
                  <strong className="hu7-detalle-valor">{asesorSeleccionado.nombre}</strong>
                </div>
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Carrera:</span>
                  <span className="hu7-detalle-valor">{asesorSeleccionado.carrera}</span>
                </div>
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Cupo ocupado:</span>
                  <span className="hu7-detalle-valor">{asesorSeleccionado.ocupado}/{asesorSeleccionado.total}</span>
                </div>
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Disponible:</span>
                  <span className="hu7-detalle-valor">{asesorSeleccionado.disponible}</span>
                </div>
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Por revisar:</span>
                  <span className="hu7-detalle-valor">{asesorSeleccionado.porRevisar} trabajos</span>
                </div>
                <div className="hu7-detalle-fila">
                  <span className="hu7-detalle-etiqueta">Tiempo de revisión:</span>
                  <span className="hu7-detalle-valor">{asesorSeleccionado.tiempoRevision}</span>
                </div>
              </div>
              <div className="hu7-modal-footer">
                <button type="button" className="hu7-boton-volver" onClick={() => setAsesorSeleccionado(null)}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Escribir al asesor */}
        {modalEscribir && (
          <div className="hu7-modal-overlay">
            <div className="hu7-modal-contenido">
              <div className="hu7-modal-header">
                <h3>Escribir al Ing. Luis Fernando Ocampo Salas</h3>
                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalEscribir(false)}>×</button>
              </div>
              <form onSubmit={handleEnviarMensaje}>
                <div className="hu7-modal-body">
                  <label htmlFor="mensaje-asesor" style={{ fontSize: '13px', color: '#66716B', display: 'block', marginBottom: '8px' }}>
                    Mensaje / Indicación sobre la carga de trabajos:
                  </label>
                  <textarea
                    id="mensaje-asesor"
                    className="hu7-textarea-mensaje"
                    rows="4"
                    required
                    placeholder="Escribe aquí tu mensaje o solicitud de derivación de trabajos..."
                    value={mensajeTexto}
                    onChange={(e) => setMensajeTexto(e.target.value)}
                  />
                </div>
                <div className="hu7-modal-footer-botones">
                  <button type="button" className="hu7-boton-cancelar" onClick={() => setModalEscribir(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="hu7-boton-escribir">
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: Ampliar cupo máximo */}
        {modalAmpliar && (
          <div className="hu7-modal-overlay">
            <div className="hu7-modal-contenido">
              <div className="hu7-modal-header">
                <h3>Solicitar Ampliación de Cupo</h3>
                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalAmpliar(false)}>×</button>
              </div>
              <div className="hu7-modal-body">
                <p style={{ fontSize: '14px', color: '#1A211D', margin: '0 0 12px 0' }}>
                  ¿Confirmas la ampliación de 1 cupo adicional para el <strong>Ing. Luis Fernando Ocampo Salas</strong>?
                </p>
                <div style={{ fontSize: '13px', backgroundColor: '#FEFCE8', padding: '10px 12px', borderLeft: '4px solid #B7791F', borderRadius: '4px' }}>
                  El límite actual cambiará de <strong>5</strong> a <strong>6</strong> cupos máximos para este periodo.
                </div>
              </div>
              <div className="hu7-modal-footer-botones">
                <button type="button" className="hu7-boton-cancelar" onClick={() => setModalAmpliar(false)}>
                  Cancelar
                </button>
                <button type="button" className="hu7-boton-escribir" onClick={handleConfirmarAmpliacion}>
                  Confirmar ampliación
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </PageLayout>
  );
}
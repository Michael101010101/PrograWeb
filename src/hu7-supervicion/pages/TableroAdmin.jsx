import React, { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import "../hu7.css";
import "../TableroAdmin.css";

export default function TableroAdmin() {
    // aca agregamos el estado para cambiar de periodo (2026-2 o 2026-1)
    const [periodo, setPeriodo] = useState("2026-2");

    // esto es para abrir las ventanas emergentes al dar clic en ver detalle o ver calendario
    const [modalVencidos, setModalVencidos] = useState(false);
    const [modalCalendario, setModalCalendario] = useState(false);

    // datos simulados dinámicos por periodo para que el dropdown funcione
    const datosPorPeriodo = {
        "2026-2": {
            totalTrabajos: 12,
            Propuesta: 3,
            EnDesarrollo: 6,
            Concluido: 2,
            Desistido: 1,
            avancePromedio: 42,
            entregablesVencidos: 7,
            sustentacionesCount: 2,
            trabajosCienciadeDatos: 33, 
            trabajosGestionOperaciones: 25,
            trabajosAutomatizacionControl: 17,
            trabajosInnovacionEducativa: 17,
            trabajosSostenibilidadUrbana: 8,
            trabajosIngenieriaSoftware: 0,
            carreras: {
                sistemasCount: 5,
                industrialCount: 4,
                civilCount: 3
            },
            avancepromIngSistemas: 48,
            avancepromIngIndustrial: 39,
            avancepromIngCivil: 35,
            fechacierre: "11/09/2026",
            fechalimite: "19/12/2026"
        },
        "2026-1": {
            totalTrabajos: 15,
            Propuesta: 1,
            EnDesarrollo: 8,
            Concluido: 5,
            Desistido: 1,
            avancePromedio: 68,
            entregablesVencidos: 3,
            sustentacionesCount: 5,
            trabajosCienciadeDatos: 27, 
            trabajosGestionOperaciones: 33,
            trabajosAutomatizacionControl: 20,
            trabajosInnovacionEducativa: 13,
            trabajosSostenibilidadUrbana: 7,
            trabajosIngenieriaSoftware: 0,
            carreras: {
                sistemasCount: 6,
                industrialCount: 5,
                civilCount: 4
            },
            avancepromIngSistemas: 72,
            avancepromIngIndustrial: 65,
            avancepromIngCivil: 58,
            fechacierre: "15/03/2026",
            fechalimite: "20/07/2026"
        }
    };

    const datosActuales = datosPorPeriodo[periodo] || datosPorPeriodo["2026-2"];

    const totalTrabajos = datosActuales.totalTrabajos;
    const Propuesta = datosActuales.Propuesta;
    const EnDesarrollo = datosActuales.EnDesarrollo;
    const Concluido = datosActuales.Concluido;
    const Desistido = datosActuales.Desistido;

    const trabajosCienciadeDatos = datosActuales.trabajosCienciadeDatos; 
    const trabajosGestionOperaciones = datosActuales.trabajosGestionOperaciones;
    const trabajosAutomatizacionControl = datosActuales.trabajosAutomatizacionControl;
    const trabajosInnovacionEducativa = datosActuales.trabajosInnovacionEducativa;
    const trabajosSostenibilidadUrbana = datosActuales.trabajosSostenibilidadUrbana;
    const trabajosIngenieriaSoftware = datosActuales.trabajosIngenieriaSoftware;

    const avancePromedio = datosActuales.avancePromedio;
    const entregablesVencidos = datosActuales.entregablesVencidos;
    const avancepromIngSistemas = datosActuales.avancepromIngSistemas;
    const avancepromIngIndustrial = datosActuales.avancepromIngIndustrial;
    const avancepromIngCivil = datosActuales.avancepromIngCivil;

    const fechacierre = datosActuales.fechacierre;
    const fechalimite = datosActuales.fechalimite;

    // funcion para imprimir / descargar el reporte en pdf usando la funcion nativa del navegador
    const handleExportarPDF = () => {
        window.print();
    };

    return (
        <PageLayout> 
            <main className="hu7-contenido-principal">
                <div className="hu7-contenedorSUP">
                    <div className="hu7-titulo-seccion">
                        <h6 className="hu7-subtitulo-pantalla">Inicio · Tablero</h6>
                        <h1 className="hu7-titulo-pantalla">Tablero del Periodo</h1>
                        <h6 className="hu7-subtitulo-pantalla2">
                            Semestre {periodo} · datos al {new Date().toLocaleDateString()}
                        </h6>
                    </div>

                    <div className="hu7-barra-controles">
                        <div className="hu7-campo-periodo">
                            <label htmlFor="select-periodo">PERIODO</label>
                            <select 
                                id="select-periodo" 
                                className="hu7-select-periodo" 
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}>
                                    
                                <option value="2026-2">2026-2</option>
                                <option value="2026-1">2026-1</option>
                            </select>
                        </div>

                        <button 
                            type="button" 
                            className="hu7-btn-exportar"
                            onClick={handleExportarPDF}>
                            Exportar reporte
                        </button>
                    </div>
                </div>

                <div className="hu7-contenedorINF">

                    {/* FILA SUP DE 4 CAJAS */}
                    <div className="hu7-kpi-fila-superior">
                    
                        {/* Trabajos por Estado */}
                        <div className="hu7-tarjeta-kpi-TrabajoEstado">
                            <h6>TRABAJOS POR ESTADO</h6>
                            <p className="numero">{totalTrabajos}</p>
                            <div className="hu7-lista-estados">
                                <div className="hu7-item-estado"><span className="hu7-lista-Propuesta">Propuesta</span> <strong className="Numeronegrita">{Propuesta}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-EnDesarrollo">En Desarrollo</span> <strong className="Numeronegrita">{EnDesarrollo}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-Concluido">Concluido</span> <strong className="Numeronegrita">{Concluido}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-Desistido">Desistido</span> <strong className="Numeronegrita">{Desistido}</strong></div>
                            </div>
                        </div>

                        {/* Avance Promedio */}
                        <div className="hu7-tarjeta-kpi-AvancePromedio">
                            <h6>AVANCE PROMEDIO</h6>
                            <p className="numero">{avancePromedio}%</p>
                            <div className="hu7-barra-contenedor">
                                <div className="hu7-barra-relleno verde" style={{ width: `${avancePromedio}%` }}></div>
                            </div>
                            <div className="descripcion">De los 9 trabajos activos · +7 puntos frente a agosto</div>
                        </div>

                        {/* Entregables Vencidos */}
                        <div className="hu7-tarjeta-kpi-EntregablesVencidos">
                            <h6>ENTREGABLES VENCIDOS</h6>
                            <p className="numeroVencido">{entregablesVencidos}</p>
                            <div className="descripcion">En 5 trabajos · el más antiguo con 14 días de retraso</div>
                            
                            <button type="button" 
                                className="hu7-boton-texto" 
                                onClick={() => setModalVencidos(true)}>
                                Ver detalle
                            </button>
                        </div>

                        {/* Sustentaciones */}
                        <div className="hu7-tarjeta-kpi-Sustentaciones">
                            <h6>SUSTENTACIONES</h6>
                            <p className="numero">{datosActuales.sustentacionesCount}</p>
                            <div className="descripcion">1 programada · realizada · nota promedio 17</div>

                            <button type="button" 
                                className="hu7-boton-texto" 
                                onClick={() => setModalCalendario(true)}>
                                Ver calendario
                            </button>
                        </div>

                    </div>

                    {/* FILA INF DE 3 CAJAS */}
                    <div className="hu7-kpi-fila-inferior">

                        {/* Trabajos por Línea de Investigación */}
                        <div className="hu7-tarjeta-kpi-TrabajosLineaInvestigacion">
                            <h6>TRABAJOS POR LÍNEA DE INVESTIGACIÓN</h6>
                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Ciencia de datos aplicada</span> <strong className="Numeronegrita">4</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosCienciadeDatos}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Gestión de operaciones</span> <strong className="Numeronegrita">3</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosGestionOperaciones}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Automatización y control</span> <strong className="Numeronegrita">2</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosAutomatizacionControl}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Innovación educativa</span> <strong className="Numeronegrita">2</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosInnovacionEducativa}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Sostenibilidad urbana</span> <strong className="Numeronegrita">1</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosSostenibilidadUrbana}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-lista-lineas">
                                <div className="hu7-item-linea"><span>Ingeniería de software</span> <strong className="Numeronegrita">0</strong></div>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno verde" style={{ width: `${trabajosIngenieriaSoftware}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Trabajos por Carrera */}
                        <div className="hu7-tarjeta-kpi-TrabajosCarrera">
                            <h6>TRABAJOS POR CARRERA</h6>

                            <div className="hu7-carrera-bloque">
                                <div className="hu7-item-carrera"><span><strong>Ingeniería de Sistemas</strong></span> <strong>{datosActuales.carreras.sistemasCount}</strong></div>
                                <p className="avancepromedio">Avance promedio {avancepromIngSistemas}%</p>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno marron" style={{ width: `${avancepromIngSistemas}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-carrera-bloque">
                                <div className="hu7-item-carrera"><span><strong>Ingeniería Industrial</strong></span> <strong>{datosActuales.carreras.industrialCount}</strong></div>
                                <p className="avancepromedio">Avance promedio {avancepromIngIndustrial}%</p>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno marron" style={{ width: `${avancepromIngIndustrial}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-carrera-bloque">
                                <div className="hu7-item-carrera"><span><strong>Ingeniería Civil</strong></span> <strong>{datosActuales.carreras.civilCount}</strong></div>
                                <p className="avancepromedio">Avance promedio {avancepromIngCivil}%</p>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno marron" style={{ width: `${avancepromIngCivil}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Requiere Atención */}
                        <div className="hu7-tarjeta-kpi-RequiereAtencion">
                            <h6>REQUIERE ATENCIÓN</h6>

                            <div className="hu7-tarjeta-kpi-RequiereAtencion-rojo">
                                <h6>2 TRABAJOS SIN ASESOR</h6>
                                <p className="descripcion">La etapa de asignación cierra el {fechacierre}</p>
                            </div>

                            <div className="hu7-tarjeta-kpi-RequiereAtencion-amarillo1">
                                <h6>1 ASESOR CON CUPO COMPLETO</h6>
                                <p className="descripcion">Ing. Ocampo Salas · 3 avances en espera hace más de 5 días</p>
                            </div>

                            <div className="hu7-tarjeta-kpi-RequiereAtencion-amarillo2">
                                <h6>7 TRABAJOS CONCLUIDOS SIN SUSTENTACIÓN</h6>
                                <p className="descripcion">Programar antes de fecha límite {fechalimite}</p>
                            </div>

                            <div className="hu7-tarjeta-kpi-CuentasBloqueadas">
                                <h6>3 CUENTAS BLOQUEADAS</h6>
                                <p className="descripcion">Por retiro del semestre o solicitud de Secretaría</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Modal para ver la lista de los 7 entregables vencidos */}
                {modalVencidos && (
                    <div className="hu7-modal-overlay">
                        <div className="hu7-modal-contenido">
                            <div className="hu7-modal-header">
                                <h3>Entregables Vencidos ({entregablesVencidos})</h3>
                                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalVencidos(false)}>×</button>
                            </div>
                            <div className="hu7-modal-body">
                                <table className="hu7-tabla-modal">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Entregable</th>
                                            <th>Asesor</th>
                                            <th>Retraso</th>
                                            <th>Límite</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>TFC-010</td>
                                            <td>Avance 2 - Arquitectura</td>
                                            <td>Ing. Luis Ocampo</td>
                                            <td><span className="badge-vencido">14 días</span></td>
                                            <td>03/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-004</td>
                                            <td>Plan de Entregables</td>
                                            <td>Mg. Sandra Bustamante</td>
                                            <td><span className="badge-vencido">10 días</span></td>
                                            <td>07/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-012</td>
                                            <td>Estado del Arte</td>
                                            <td>Dra. Mariela Quispe</td>
                                            <td><span className="badge-vencido">8 días</span></td>
                                            <td>09/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-008</td>
                                            <td>Avance 1 - Diagramas</td>
                                            <td>Dr. Pedro Salazar</td>
                                            <td><span className="badge-vencido">6 días</span></td>
                                            <td>11/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-015</td>
                                            <td>Pruebas de Software</td>
                                            <td>Mg. Julio Vargas</td>
                                            <td><span className="badge-vencido">5 días</span></td>
                                            <td>12/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-003</td>
                                            <td>Informe Final Borrador</td>
                                            <td>Ing. Luis Ocampo</td>
                                            <td><span className="badge-vencido">3 días</span></td>
                                            <td>14/10/2026</td>
                                        </tr>
                                        <tr>
                                            <td>TFC-019</td>
                                            <td>Marco Teórico</td>
                                            <td>Dra. Gabriela Torres</td>
                                            <td><span className="badge-vencido">1 día</span></td>
                                            <td>16/10/2026</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para ver el calendario con las sustentaciones programadas */}
                {modalCalendario && (
                    <div className="hu7-modal-overlay">
                        <div className="hu7-modal-contenido">
                            <div className="hu7-modal-header">
                                <h3>Calendario de Sustentaciones</h3>
                                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalCalendario(false)}>×</button>
                            </div>
                            <div className="hu7-modal-body">
                                <div className="hu7-calendario-header">Octubre 2026</div>
                                <div className="hu7-calendario-grid">
                                    <div className="dia-header">Dom</div>
                                    <div className="dia-header">Lun</div>
                                    <div className="dia-header">Mar</div>
                                    <div className="dia-header">Mié</div>
                                    <div className="dia-header">Jue</div>
                                    <div className="dia-header">Vie</div>
                                    <div className="dia-header">Sáb</div>

                                    {/* Días previos de relleno */}
                                    <div className="dia vacio"></div>
                                    <div className="dia vacio"></div>
                                    <div className="dia vacio"></div>
                                    <div className="dia vacio"></div>
                                    <div className="dia">1</div>
                                    <div className="dia">2</div>
                                    <div className="dia">3</div>
                                    <div className="dia">4</div>
                                    <div className="dia">5</div>
                                    <div className="dia">6</div>
                                    <div className="dia">7</div>
                                    <div className="dia">8</div>
                                    <div className="dia">9</div>
                                    <div className="dia">10</div>
                                    <div className="dia">11</div>
                                    <div className="dia">12</div>
                                    <div className="dia">13</div>
                                    <div className="dia">14</div>
                                    <div className="dia">15</div>
                                    <div className="dia">16</div>
                                    <div className="dia">17</div>
                                    <div className="dia">18</div>
                                    <div className="dia">19</div>
                                    <div className="dia">20</div>
                                    <div className="dia">21</div>
                                    <div className="dia marcado">22</div>
                                    <div className="dia">23</div>
                                    <div className="dia">24</div>
                                    <div className="dia">25</div>
                                    <div className="dia">26</div>
                                    <div className="dia">27</div>
                                    <div className="dia marcado">28</div>
                                    <div className="dia">29</div>
                                    <div className="dia">30</div>
                                    <div className="dia">31</div>
                                </div>
                                <div className="hu7-calendario-leyenda">
                                    <div className="leyenda-item">
                                        <span className="dot marcado"></span>
                                        <span>22 Oct: Sustentación TFC-001 (Realizada - Nota 17)</span>
                                    </div>
                                    <div className="leyenda-item">
                                        <span className="dot marcado"></span>
                                        <span>28 Oct: Sustentación TFC-005 (Programada - 10:00 AM)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </PageLayout>
    );
}
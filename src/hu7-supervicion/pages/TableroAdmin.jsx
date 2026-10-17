import React from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import "../hu7.css";
import "../TableroAdmin.css";

export default function TableroAdmin() {
    const totalTrabajos = 12;
    const periodo = "2026-2";

    const Propuesta = 3;
    const EnDesarrollo = 6;
    const Concluido = 2;
    const Desistido = 1;

    const trabajosCienciadeDatos = 33; 
    const trabajosGestionOperaciones = 25;
    const trabajosAutomatizacionControl = 17;
    const trabajosInnovacionEducativa = 17;
    const trabajosSostenibilidadUrbana = 8;
    const trabajosIngenieriaSoftware = 0;

    const avancePromedio = 42;
    const entregablesVencidos = 7;
    const avancepromIngSistemas = 48;
    const avancepromIngIndustrial = 39;
    const avancepromIngCivil = 35;

    const fechacierre = "11/09/2026";
    const fechalimite = "19/12/2026";

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
                            <select id="select-periodo" className="hu7-select-periodo" defaultValue={periodo}>
                                <option value="2026-2">2026-2</option>
                                <option value="2026-1">2026-1</option>

                            </select>
                        </div>

                        <button type="button" className="hu7-btn-exportar">
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
                                onClick={() => alert("Mostrando detalle...")}
                            >
                                Ver detalle
                            </button>
                        </div>

                        {/* Sustentaciones */}
                        <div className="hu7-tarjeta-kpi-Sustentaciones">
                            <h6>SUSTENTACIONES</h6>
                            <p className="numero">2</p>
                            <div className="descripcion">1 programada · realizada · nota promedio 17</div>

                            <button type="button" 
                                className="hu7-boton-texto" 
                                onClick={() => alert("Mostrando detalle...")}
                            >
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
                                <div className="hu7-item-carrera"><span><strong>Ingeniería de Sistemas</strong></span> <strong>5</strong></div>
                                <p className="avancepromedio">Avance promedio {avancepromIngSistemas}%</p>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno marron" style={{ width: `${avancepromIngSistemas}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-carrera-bloque">
                                <div className="hu7-item-carrera"><span><strong>Ingeniería Industrial</strong></span> <strong>4</strong></div>
                                <p className="avancepromedio">Avance promedio {avancepromIngIndustrial}%</p>
                                <div className="hu7-barra-contenedor">
                                    <div className="hu7-barra-relleno marron" style={{ width: `${avancepromIngIndustrial}%` }}></div>
                                </div>
                            </div>

                            <div className="hu7-carrera-bloque">
                                <div className="hu7-item-carrera"><span><strong>Ingeniería Civil</strong></span> <strong>3</strong></div>
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
            </main>
        </PageLayout>
    );
}
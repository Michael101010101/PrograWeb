import React from 'react';
import '../hu7.css';

export default function TableroAdmin() {
    const totalTrabajos = 12;
    const periodo = "2026-2";
    const Propuesta = 3;
    const EnDesarrollo = 6;
    const Concluido = 2;
    const Desistido = 1;
    const avancePromedio = 42;
    const avancepromIngSistemas = 48;
    const avancepromIngIndustrial = 39;
    const avancepromIngCivil = 35;
    const fechacierre = "11/09/2026";
    const fechalimite = "19/12/2026";

    return (
        <>
        <div className="hu7-contenedorSUP">
            <h6 className="hu7-subtitulo-pantalla">Inicio . Tablero</h6>
            <h1 className="hu7-titulo-pantalla">Tablero del Periodo</h1>
            <h6 className="hu7-subtitulo-pantalla">
                {periodo} . datos al {new Date().toLocaleDateString()}
            </h6>

        </div>


        <div className="hu7-contenedorINF">


            <div className="hu7-kpi-grid">

                {/* KPI - Trabajos por Estado */}
                <div className="hu7-tarjeta-kpi-TrabajoEstado">
                    <h6>TRABAJOS POR ESTADO</h6>
                    <p className="numero">{totalTrabajos}</p>
                    <h6 className="Propuesta">Propuesta {Propuesta}</h6>
                    <h6 className="EnDesarrollo">En Desarrollo {EnDesarrollo}</h6>
                    <h6 className="Concluido">Concluido {Concluido}</h6>
                    <h6 className="Desistido">Desistido {Desistido}</h6>
                </div>


                {/* KPI - Avance promedio */}
                <div className="hu7-tarjeta-kpi-AvancePromedio">
                    <h6>AVANCE PROMEDIO</h6>
                    <p className="numero">{avancePromedio}%</p>
                </div>


                {/* KPI - Entregables Vencidos */}
                <div className="hu7-tarjeta-kpi-EntregablesVencidos">
                    <h6>ENTREGABLES VENCIDOS</h6>
                    <p className="numero">7</p>
                </div>


                {/* KPI - Sustentaciones */}
                <div className="hu7-tarjeta-kpi-Sustentaciones">
                    <h6>SUSTENTACIONES</h6>
                    <p className="numero">2</p>
                </div>


                {/* KPI - Trabajos por línea de investigación */}
                <div className="hu7-tarjeta-kpi-TrabajosLineaInvestigacion">
                    <h6>Ciencia de datos aplicada</h6>
                    <p className="numero">4</p>

                    <h6>Gestión de operaciones</h6>
                    <p className="numero">3</p>

                    <h6>Automatización y control</h6>
                    <p className="numero">2</p>

                    <h6>Innovación educativa</h6>
                    <p className="numero">2</p>

                    <h6>Sostenibilidad urbana</h6>
                    <p className="numero">1</p>

                    <h6>Ingeniería de software</h6>
                    <p className="numero">0</p>
                </div>


                {/* KPI - Trabajos por carrera */}
                <div className="hu7-tarjeta-kpi-TrabajosCarrera">
                    <h6>Ingeniería de Sistemas</h6>
                    <p className="numero">5</p>
                    <p className="avancepromedio"> Avance promedio: {avancepromIngSistemas}%
                    </p>

                    <h6>Ingeniería Industrial</h6>
                    <p className="numero">4</p>
                    <p className="avancepromedio"> Avance promedio: {avancepromIngIndustrial}%
                    </p>

                    <h6>Ingeniería Civil</h6>
                    <p className="numero">3</p>
                    <p className="avancepromedio"> Avance promedio: {avancepromIngCivil}%
                    </p>
                    </div>

                    {/* KPI - BLOQUE "REQUIERE ATENCIÓN" */}
                    <div className="hu7-tarjeta-kpi-RequiereAtencion">
                    <h6>Requiere Atención</h6>

                    {/* sub tarjeta - rojo */}
                    <div className="hu7-tarjeta-kpi-RequiereAtencion-rojo">
                        <h6>2 trabajos sin asesor</h6>
                        <p className="descripcion">La etapa de asignación cierra el {fechacierre}</p>
                </div>


                {/* sub tarjeta - amarillo1 */}
                <div className="hu7-tarjeta-kpi-RequiereAtencion-amarillo1">
                    <h6>1 asesor con cupo completo</h6>
                    <p className="descripcion">
                    Ing. Ocampo Salas . 3 avances en espera hace más de 5 días
                    </p>
                </div>

                {/* sub tarjeta - amarillo2 */}
                <div className="hu7-tarjeta-kpi-RequiereAtencion-amarillo2">
                    <h6>7 trabajos concluidos sin sustentación</h6>
                    <p className="descripcion">
                    Programar antes de fecha límite {fechalimite}
                    </p>
                </div>


                {/* sub tarjeta - gris */}
                <div className="hu7-tarjeta-kpi-CuentasBloqueadas">
                    <h6>3 cuentas bloqueadas</h6>
                    <p className="descripcion">
                    Por retiro del semestre o solicitud de Secretaría
                    </p>
                </div>
                </div>
        </div>
        </div>
        </>
    );
    }
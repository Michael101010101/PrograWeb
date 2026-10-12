import React from 'react';
import '../hu7.css';
import '../TableroAdmin.css';

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
        <h6 className="hu7-subtitulo-pantalla">Inicio · Tablero</h6>
        <h1 className="hu7-titulo-pantalla">Tablero del Periodo</h1>
        <h6 className="hu7-subtitulo-pantalla">
          {periodo} · datos al {new Date().toLocaleDateString()}
        </h6>
      </div>

      <div className="hu7-contenedorINF">
        <div className="hu7-contenedorINF">

            {/* FILA SUPERIorR de 4 CAJAS */}
            <div className="hu7-kpi-fila-superior">
                
                {/* 1. Trabajos por Estado */}
                <div className="hu7-tarjeta-kpi-TrabajoEstado">
                    <h6>TRABAJOS POR ESTADO</h6>
                    <p className="numero">{totalTrabajos}</p>
                        <div className="hu7-lista-Propuesta">
                            <div className="hu7-item-estado"><span>Propuesta</span> <strong>{Propuesta}</strong></div>
                        </div>

                        <div className="hu7-lista-EnDesarrollo">
                            <div className="hu7-item-estado"><span>En Desarrollo</span> <strong>{EnDesarrollo}</strong></div>
                        </div>

                        <div className="hu7-lista-Concluido">
                            <div className="hu7-item-estado"><span>Concluido</span> <strong>{Concluido}</strong></div>
                        </div>

                        <div className="hu7-lista-Desistido">
                            <div className="hu7-item-estado"><span>Desistido</span> <strong>{Desistido}</strong></div>
                        </div>


                </div>

                {/* 2. Avance Promedio */}
                <div className="hu7-tarjeta-kpi-AvancePromedio">
                    <h6>AVANCE PROMEDIO</h6>
                    <p className="numero">{avancePromedio}%</p>
                </div>

                {/* 3. Entregables Vencidos */}
                <div className="hu7-tarjeta-kpi-EntregablesVencidos">
                    <h6>ENTREGABLES VENCIDOS</h6>
                    <p className="numero">7</p>
                </div>

                {/* 4. Sustentaciones */}
                <div className="hu7-tarjeta-kpi-Sustentaciones">
                    <h6>SUSTENTACIONES</h6>
                    <p className="numero">2</p>
                </div>

            </div>


            {/* FILA INFERIOr de  3 CAJAS */}
            <div className="hu7-kpi-fila-inferior">

                {/* 1. Trabajos por Línea de Investigación */}
                <div className="hu7-tarjeta-kpi-TrabajosLineaInvestigacion">
                    <h6>TRABAJOS POR LÍNEA DE INVESTIGACIÓN</h6>
                        <div className="hu7-lista-lineas">
                            <p>Ciencia de datos aplicada: <strong>4</strong></p>
                            <p>Gestión de operaciones: <strong>3</strong></p>
                            <p>Automatización y control: <strong>2</strong></p>
                            <p>Innovación educativa: <strong>2</strong></p>
                            <p>Sostenibilidad urbana: <strong>1</strong></p>
                            <p>Ingeniería de software: <strong>0</strong></p>
                        </div>
                </div>

                {/* 2. Trabajos por Carrera */}
                <div className="hu7-tarjeta-kpi-TrabajosCarrera">
                    <h6>TRABAJOS POR CARRERA</h6>
                    <p><strong>Ingeniería de Sistemas: 5</strong></p>
                    <p className="avancepromedio">Avance promedio: {avancepromIngSistemas}%</p>

                    <p><strong>Ingeniería Industrial: 4</strong></p>
                    <p className="avancepromedio">Avance promedio: {avancepromIngIndustrial}%</p>

                    <p><strong>Ingeniería Civil: 3</strong></p>
                    <p className="avancepromedio">Avance promedio: {avancepromIngCivil}%</p>
                </div>

                {/* 3. Requiere Atención */}
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
      </div>
    </>
  );
}
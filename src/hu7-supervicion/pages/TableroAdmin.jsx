import { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EstadoVista from '../components/EstadoVista.jsx';
import ModalSinDatos from '../components/ModalSinDatos.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import {
    cargarTodosLosAsesores,
    contarTrabajos,
    contarUsuarios,
    obtenerDistribucion,
    obtenerFiltrosTrabajos,
    obtenerTablero,
} from '../api/clienteApiHu7.js';
import {
    ETIQUETA_ESTADO_SUSTENTACION,
    MESES,
    fechaLocal,
    formatearFecha,
    formatearHora,
    proporcion,
    textoONulo,
} from '../utils/formatoHu7.js';
import "../hu7.css";
import "../TableroAdmin.css";

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** "1 TRABAJO SIN ASESOR" / "3 TRABAJOS SIN ASESOR". */
const plural = (n, singular, varios) => `${n} ${n === 1 ? singular : varios}`;

/** Total de un estado dentro de [{ valor, total }]. */
const totalDe = (lista, valor) => lista.find((e) => e.valor === valor)?.total ?? 0;

/** Arma las celdas del mes de `fecha` (con relleno inicial) y marca los días con sustentación. */
function armarCalendario(proximas) {
    if (!proximas.length) return null;
    const primera = fechaLocal(proximas[0].fecha);
    const anio = primera.getFullYear();
    const mes = primera.getMonth();
    const diasConSustentacion = new Set(
        proximas
            .map((s) => fechaLocal(s.fecha))
            .filter((d) => d.getFullYear() === anio && d.getMonth() === mes)
            .map((d) => d.getDate())
    );
    const relleno = new Date(anio, mes, 1).getDay();
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();
    const dias = Array.from({ length: diasDelMes }, (_, i) => ({
        numero: i + 1,
        marcado: diasConSustentacion.has(i + 1),
    }));
    return { titulo: `${MESES[mes]} ${anio}`, relleno, dias };
}

/** Pide al API todo lo que muestra el tablero para un periodo. */
async function cargarTablero(periodoId) {
    const [tablero, sinAsesor, asesores, bloqueados] = await Promise.all([
        obtenerTablero({ periodoId }),
        contarTrabajos({ periodoId, asesorId: 'sin_asesor' }),
        cargarTodosLosAsesores({ estado: 'activo' }),
        contarUsuarios({ estado: 'bloqueado' }),
    ]);
    const cupoCompleto = asesores
        .filter((a) => a.cupoDisponible === 0)
        .sort((a, b) => b.avancesPorRevisar - a.avancesPorRevisar);
    return { tablero, sinAsesor, cupoCompleto, bloqueados };
}

export default function TableroAdmin() {
    // periodo elegido en el selector (null = el periodo activo)
    const [periodoId, setPeriodoId] = useState(null);

    // rango de fechas para la distribución (AAAA-MM-DD)
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');

    // esto es para abrir las ventanas emergentes al dar clic en ver detalle o ver calendario
    const [modalVencidos, setModalVencidos] = useState(false);
    const [modalCalendario, setModalCalendario] = useState(false);

    const peticionFiltros = usePeticion(() => obtenerFiltrosTrabajos(), []);
    const periodos = peticionFiltros.datos?.periodos ?? [];
    const periodoActivo = periodos.find((p) => p.activo) ?? null;
    const periodoElegido = periodoId ?? periodoActivo?.id;
    const filtrosListos = Boolean(peticionFiltros.datos);

    const peticionTablero = usePeticion(
        () => (filtrosListos ? cargarTablero(periodoElegido) : undefined),
        [filtrosListos, periodoElegido]
    );

    // validación del rango en el cliente (el servidor la repite)
    const errorRangoCliente = desde && hasta && desde > hasta ? 'Debe ser igual o posterior a la fecha de inicio.' : null;

    const peticionDistribucion = usePeticion(
        () =>
            filtrosListos && !errorRangoCliente
                ? obtenerDistribucion({ desde, hasta, periodoId: periodoElegido })
                : undefined,
        [filtrosListos, periodoElegido, desde, hasta, errorRangoCliente]
    );
    const camposRango = peticionDistribucion.error?.status === 400 ? peticionDistribucion.error.campos ?? {} : {};
    const errorDesde = camposRango.desde;
    const errorHasta = errorRangoCliente ?? camposRango.hasta;

    // funcion para imprimir / descargar el reporte en pdf usando la funcion nativa del navegador
    const handleExportarPDF = () => {
        window.print();
    };

    const cargando = peticionFiltros.cargando || peticionTablero.cargando;
    const error = peticionFiltros.error ?? peticionTablero.error;
    const reintentar = peticionFiltros.error ? peticionFiltros.reintentar : peticionTablero.reintentar;

    // 409 = no hay periodo activo: es un estado vacío, no un error
    const sinPeriodo = !peticionFiltros.error && (periodos.length === 0 || peticionTablero.error?.status === 409);

    const datos = peticionTablero.datos;
    const tablero = datos?.tablero;
    const porEstado = tablero?.trabajosPorEstado ?? [];
    const totalTrabajos = porEstado.reduce((suma, e) => suma + e.total, 0);
    const enDesarrollo = totalDe(porEstado, 'en_desarrollo');
    const avancePromedio = tablero?.avancePromedio ?? null;
    const vencidos = tablero?.entregablesVencidos ?? { total: 0, lista: [] };
    const sustentaciones = tablero?.sustentaciones ?? { porEstado: [], programadas: 0, realizadas: 0, proximas: [] };
    const totalSustentaciones = sustentaciones.porEstado.reduce((suma, e) => suma + e.total, 0);
    const calendario = armarCalendario(sustentaciones.proximas);

    const periodoVacio = Boolean(tablero) && totalTrabajos === 0;
    const esPeriodoActivo = periodoElegido === periodoActivo?.id;
    const semestre = tablero?.periodo?.semestre ?? periodos.find((p) => p.id === periodoElegido)?.semestre ?? '';

    const distribucion = peticionDistribucion.datos;

    return (
        <PageLayout>
            <main className="hu7-contenido-principal">
                <div className="hu7-contenedorSUP">
                    <div className="hu7-titulo-seccion">
                        <h6 className="hu7-subtitulo-pantalla">Inicio · Tablero</h6>
                        <h1 className="hu7-titulo-pantalla">Tablero del Periodo</h1>
                        <h6 className="hu7-subtitulo-pantalla2">
                            {semestre ? `Semestre ${semestre} · ` : ''}datos al {new Date().toLocaleDateString('es-PE')}
                        </h6>
                    </div>

                    <div className="hu7-barra-controles">
                        <div className="hu7-campo-periodo">
                            <label htmlFor="select-periodo">PERIODO</label>
                            <select
                                id="select-periodo"
                                className="hu7-select-periodo"
                                value={periodoElegido ?? ''}
                                disabled={!periodos.length}
                                onChange={(e) => setPeriodoId(Number(e.target.value))}>

                                {periodos.map((p) => (
                                    <option key={p.id} value={p.id}>{p.semestre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="hu7-campo-periodo">
                            <label htmlFor="input-desde">DESDE</label>
                            <input
                                id="input-desde"
                                type="date"
                                className="hu7-select-periodo"
                                value={desde}
                                max={hasta || undefined}
                                aria-invalid={Boolean(errorDesde)}
                                onChange={(e) => setDesde(e.target.value)} />
                            {errorDesde && <span className="field__error" role="alert">{errorDesde}</span>}
                        </div>

                        <div className="hu7-campo-periodo">
                            <label htmlFor="input-hasta">HASTA</label>
                            <input
                                id="input-hasta"
                                type="date"
                                className="hu7-select-periodo"
                                value={hasta}
                                min={desde || undefined}
                                aria-invalid={Boolean(errorHasta)}
                                onChange={(e) => setHasta(e.target.value)} />
                            {errorHasta && <span className="field__error" role="alert">{errorHasta}</span>}
                        </div>

                        <button
                            type="button"
                            className="hu7-btn-exportar"
                            disabled={!tablero}
                            onClick={handleExportarPDF}>
                            Exportar reporte
                        </button>
                    </div>
                </div>

                <div className="hu7-contenedorINF">
                  <EstadoVista
                    cargando={cargando}
                    error={sinPeriodo ? null : error}
                    alReintentar={reintentar}
                    vacio={sinPeriodo || (periodoVacio && esPeriodoActivo)}
                    tituloVacio={sinPeriodo ? 'No hay un periodo activo' : `Sin datos para ${semestre}`}
                    textoVacio={
                        sinPeriodo
                            ? 'Cuando la coordinación active un periodo, aquí verás sus métricas.'
                            : 'El periodo aún no tiene trabajos registrados. Las métricas se activan con el primer registro de propuesta.'
                    }>
                  {tablero && (
                  <>
                    {/* FILA SUP DE 4 CAJAS */}
                    <div className="hu7-kpi-fila-superior">

                        {/* Trabajos por Estado */}
                        <div className="hu7-tarjeta-kpi-TrabajoEstado">
                            <h6>TRABAJOS POR ESTADO</h6>
                            <p className="numero">{totalTrabajos}</p>
                            <div className="hu7-lista-estados">
                                <div className="hu7-item-estado"><span className="hu7-lista-Propuesta">Propuesta</span> <strong className="Numeronegrita">{totalDe(porEstado, 'propuesta')}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-EnDesarrollo">En Desarrollo</span> <strong className="Numeronegrita">{enDesarrollo}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-Concluido">Concluido</span> <strong className="Numeronegrita">{totalDe(porEstado, 'concluido')}</strong></div>
                                <div className="hu7-item-estado"><span className="hu7-lista-Desistido">Desistido</span> <strong className="Numeronegrita">{totalDe(porEstado, 'desistido')}</strong></div>
                            </div>
                        </div>

                        {/* Avance Promedio */}
                        <div className="hu7-tarjeta-kpi-AvancePromedio">
                            <h6>AVANCE PROMEDIO</h6>
                            <p className="numero">{textoONulo(avancePromedio, '%')}</p>
                            <div className="hu7-barra-contenedor">
                                <div className="hu7-barra-relleno verde" style={{ width: `${avancePromedio ?? 0}%` }}></div>
                            </div>
                            <div className="descripcion">
                                {plural(enDesarrollo, 'trabajo en desarrollo', 'trabajos en desarrollo')}
                            </div>
                        </div>

                        {/* Entregables Vencidos */}
                        <div className="hu7-tarjeta-kpi-EntregablesVencidos">
                            <h6>ENTREGABLES VENCIDOS</h6>
                            <p className="numeroVencido">{vencidos.total}</p>
                            {vencidos.lista.length > 0 && (
                                <div className="descripcion">
                                    El más antiguo con {plural(vencidos.lista[0].diasVencido, 'día', 'días')} de retraso
                                </div>
                            )}

                            <button type="button"
                                className="hu7-boton-texto"
                                onClick={() => setModalVencidos(true)}>
                                Ver detalle
                            </button>
                        </div>

                        {/* Sustentaciones */}
                        <div className="hu7-tarjeta-kpi-Sustentaciones">
                            <h6>SUSTENTACIONES</h6>
                            <p className="numero">{totalSustentaciones}</p>
                            <div className="descripcion">
                                {plural(sustentaciones.programadas, 'programada', 'programadas')} · {plural(sustentaciones.realizadas, 'realizada', 'realizadas')}
                            </div>

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
                            <EstadoVista
                                cargando={peticionDistribucion.cargando}
                                error={peticionDistribucion.error}
                                alReintentar={peticionDistribucion.reintentar}
                                vacio={!errorRangoCliente && Boolean(distribucion) && distribucion.porLinea.length === 0}
                                tituloVacio="Sin líneas de investigación">
                                {distribucion?.porLinea.map((l) => (
                                    <div className="hu7-lista-lineas" key={l.lineaId}>
                                        <div className="hu7-item-linea"><span>{l.nombre}</span> <strong className="Numeronegrita">{l.total}</strong></div>
                                        <div className="hu7-barra-contenedor">
                                            <div className="hu7-barra-relleno verde" style={{ width: `${proporcion(l.total, distribucion.totalTrabajos)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </EstadoVista>
                        </div>

                        {/* Trabajos por Carrera */}
                        <div className="hu7-tarjeta-kpi-TrabajosCarrera">
                            <h6>TRABAJOS POR CARRERA</h6>
                            <EstadoVista
                                cargando={peticionDistribucion.cargando}
                                error={peticionDistribucion.error}
                                alReintentar={peticionDistribucion.reintentar}
                                vacio={!errorRangoCliente && Boolean(distribucion) && distribucion.porCarrera.length === 0}
                                tituloVacio="Sin carreras">
                                {distribucion?.porCarrera.map((c) => (
                                    <div className="hu7-carrera-bloque" key={c.carrera}>
                                        <div className="hu7-item-carrera"><span><strong>{c.carrera}</strong></span> <strong>{c.total}</strong></div>
                                        <div className="hu7-barra-contenedor">
                                            <div className="hu7-barra-relleno marron" style={{ width: `${proporcion(c.total, distribucion.totalTrabajos)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </EstadoVista>
                        </div>

                        {/* Requiere Atención */}
                        <div className="hu7-tarjeta-kpi-RequiereAtencion">
                            <h6>REQUIERE ATENCIÓN</h6>

                            <div className="hu7-tarjeta-kpi-RequiereAtencion-rojo">
                                <h6>{plural(datos.sinAsesor, 'TRABAJO SIN ASESOR', 'TRABAJOS SIN ASESOR')}</h6>
                            </div>

                            <div className="hu7-tarjeta-kpi-RequiereAtencion-amarillo1">
                                <h6>{plural(datos.cupoCompleto.length, 'ASESOR CON CUPO COMPLETO', 'ASESORES CON CUPO COMPLETO')}</h6>
                                {datos.cupoCompleto.length > 0 && (
                                    <p className="descripcion">
                                        {datos.cupoCompleto[0].nombreCompleto} · {plural(datos.cupoCompleto[0].avancesPorRevisar, 'avance por revisar', 'avances por revisar')}
                                    </p>
                                )}
                            </div>

                            <div className="hu7-tarjeta-kpi-CuentasBloqueadas">
                                <h6>{plural(datos.bloqueados, 'CUENTA BLOQUEADA', 'CUENTAS BLOQUEADAS')}</h6>
                            </div>
                        </div>

                    </div>
                  </>
                  )}
                  </EstadoVista>
                </div>

                {/* Periodo elegido sin trabajos: ofrece volver al periodo activo */}
                <ModalSinDatos
                    estaAbierto={periodoVacio && !esPeriodoActivo && Boolean(periodoActivo)}
                    alCerrar={() => setPeriodoId(periodoActivo.id)}
                    periodo={semestre}
                    periodoAnterior={periodoActivo?.semestre} />

                {/* Modal para ver la lista de entregables vencidos */}
                {modalVencidos && (
                    <div className="hu7-modal-overlay">
                        <div className="hu7-modal-contenido">
                            <div className="hu7-modal-header">
                                <h3>Entregables Vencidos ({vencidos.total})</h3>
                                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalVencidos(false)}>×</button>
                            </div>
                            <div className="hu7-modal-body">
                                <EstadoVista vacio={vencidos.lista.length === 0} tituloVacio="No hay entregables vencidos">
                                    <table className="hu7-tabla-modal">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Entregable</th>
                                                <th>Retraso</th>
                                                <th>Límite</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vencidos.lista.map((e) => (
                                                <tr key={e.id}>
                                                    <td>{e.trabajo.codigo}</td>
                                                    <td>{e.nombre}</td>
                                                    <td><span className="badge-vencido">{plural(e.diasVencido, 'día', 'días')}</span></td>
                                                    <td>{formatearFecha(e.fechaLimite)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {vencidos.total > vencidos.lista.length && (
                                        <p className="descripcion">Se muestran los {vencidos.lista.length} más antiguos.</p>
                                    )}
                                </EstadoVista>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para ver el calendario con las próximas sustentaciones */}
                {modalCalendario && (
                    <div className="hu7-modal-overlay">
                        <div className="hu7-modal-contenido">
                            <div className="hu7-modal-header">
                                <h3>Calendario de Sustentaciones</h3>
                                <button type="button" className="hu7-modal-cerrar" onClick={() => setModalCalendario(false)}>×</button>
                            </div>
                            <div className="hu7-modal-body">
                                <EstadoVista vacio={!calendario} tituloVacio="No hay sustentaciones próximas">
                                    {calendario && (
                                        <>
                                            <div className="hu7-calendario-header">{calendario.titulo}</div>
                                            <div className="hu7-calendario-grid">
                                                {DIAS_SEMANA.map((d) => (
                                                    <div className="dia-header" key={d}>{d}</div>
                                                ))}

                                                {/* Días previos de relleno */}
                                                {Array.from({ length: calendario.relleno }, (_, i) => (
                                                    <div className="dia vacio" key={`vacio-${i}`}></div>
                                                ))}
                                                {calendario.dias.map((d) => (
                                                    <div className={d.marcado ? 'dia marcado' : 'dia'} key={d.numero}>{d.numero}</div>
                                                ))}
                                            </div>
                                            <div className="hu7-calendario-leyenda">
                                                {sustentaciones.proximas.map((s) => (
                                                    <div className="leyenda-item" key={s.id}>
                                                        <span className="dot marcado"></span>
                                                        <span>
                                                            {formatearFecha(s.fecha)}: Sustentación {s.trabajo.codigo} ({ETIQUETA_ESTADO_SUSTENTACION[s.estado] ?? s.estado} - {formatearHora(s.hora)} · {s.lugar ?? (s.modalidad === 'virtual' ? 'Virtual' : '—')})
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </EstadoVista>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </PageLayout>
    );
}

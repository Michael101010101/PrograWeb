import { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import * as XLSX from 'xlsx';
import EstadoVista from '../components/EstadoVista.jsx';
import ModalFichaTrabajo from '../components/ModalFichaTrabajo.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import { useRetardo } from '../hooks/useRetardo.js';
import {
  cargarTodosLosTrabajos,
  contarTrabajos,
  listarTrabajos,
  obtenerFiltrosTrabajos,
} from '../api/clienteApiHu7.js';
import { CLASE_ESTADO_TRABAJO } from '../utils/formatoHu7.js';
import '../hu7.css';
import '../TrabajosAdmin.css';

const TRABAJOS_POR_PAGINA = 20;
const SIN_ASESOR = 'sin_asesor';
const FILTROS_INICIALES = { estado: '', lineaId: '', asesorId: '', carrera: '' };

/** Pide los conteos del subtítulo (sin filtrar por periodo: se ven todos los trabajos). */
async function cargarConteos() {
  const [total, activos, sinAsesor] = await Promise.all([
    contarTrabajos({}),
    contarTrabajos({ estado: 'en_desarrollo' }),
    contarTrabajos({ asesorId: SIN_ASESOR }),
  ]);
  return { total, activos, sinAsesor };
}

/** Nombre del archivo de Excel con la fecha de hoy (AAAA-MM-DD). */
function nombreArchivoExcel() {
  const hoy = new Date();
  const dd = (n) => String(n).padStart(2, '0');
  return `Trabajos-${hoy.getFullYear()}-${dd(hoy.getMonth() + 1)}-${dd(hoy.getDate())}.xlsx`;
}

export default function TrabajosAdmin() {
  const { mostrar } = useToast();

  // Estados para controlar filtros (se envían al servidor)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const busquedaRetardada = useRetardo(busqueda.trim(), 400);

  // La página se guarda junto con los filtros con los que se eligió:
  // si cambia cualquier filtro o la búsqueda, se vuelve a la página 1 sin efectos extra.
  const claveFiltros = JSON.stringify({ ...filtros, q: busquedaRetardada });
  const [paginaElegida, setPaginaElegida] = useState({ clave: claveFiltros, numero: 1 });
  const pagina = paginaElegida.clave === claveFiltros ? paginaElegida.numero : 1;
  const irAPagina = (numero) => setPaginaElegida({ clave: claveFiltros, numero });

  // trabajo abierto en la ficha de detalle
  const [trabajoAbierto, setTrabajoAbierto] = useState(null);

  // estado de la exportación a Excel
  const [exportando, setExportando] = useState(false);
  const [exportado, setExportado] = useState(null);

  const peticionFiltros = usePeticion(() => obtenerFiltrosTrabajos(), []);
  const opciones = peticionFiltros.datos;
  const filtrosListos = Boolean(opciones);

  const peticionConteos = usePeticion(() => cargarConteos(), []);
  const conteos = peticionConteos.datos;

  const peticionLista = usePeticion(
    () => listarTrabajos({ ...filtros, q: busquedaRetardada, page: pagina, limit: TRABAJOS_POR_PAGINA }),
    [claveFiltros, pagina]
  );
  const trabajos = peticionLista.datos?.trabajos ?? [];
  const paginacion = peticionLista.datos?.paginacion ?? { pagina: 1, total: 0, totalPaginas: 0 };

  const cambiarFiltro = (campo) => (e) => setFiltros((previos) => ({ ...previos, [campo]: e.target.value }));

  const etiquetaEstado = (valor) => opciones?.estados.find((e) => e.valor === valor)?.etiqueta ?? valor;

  // Función para exportar a Excel: recorre todas las páginas con los filtros actuales
  const handleExportarExcel = async () => {
    setExportando(true);
    try {
      const todos = await cargarTodosLosTrabajos({ ...filtros, q: busquedaRetardada });
      if (todos.length === 0) {
        mostrar({ tipo: 'aviso', titulo: 'Sin datos', mensaje: 'No hay trabajos para exportar con los filtros actuales.' });
        return;
      }

      const datosExcel = todos.map((item) => ({
        "CÓDIGO": item.codigo,
        "TÍTULO": item.titulo,
        "LÍNEA": item.linea?.nombre ?? '',
        "CARRERA": item.carrera,
        "EQUIPO": item.equipo.join(', '),
        "ASESOR": item.asesor?.nombre ?? 'Sin asesor',
        "AVANCE (%)": `${item.avance}%`,
        "ESTADO": etiquetaEstado(item.estado),
        "PERIODO": item.periodo?.semestre ?? '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajos");

      const archivo = nombreArchivoExcel();
      XLSX.writeFile(workbook, archivo);

      // activa la banderita de exportado
      setExportado({ archivo, cantidad: todos.length });
    } catch (error) {
      mostrar({ tipo: 'error', titulo: 'No se pudo exportar', mensaje: error.message });
    } finally {
      setExportando(false);
    }
  };

  const abrirConTeclado = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTrabajoAbierto(id);
    }
  };

  const primeraFila = paginacion.total ? (paginacion.pagina - 1) * TRABAJOS_POR_PAGINA + 1 : 0;
  const ultimaFila = primeraFila ? primeraFila + trabajos.length - 1 : 0;
  const textoTodos = filtrosListos ? 'Todos' : 'Cargando…';
  const textoTodas = filtrosListos ? 'Todas' : 'Cargando…';

  return (
    <PageLayout>
      <main className="hu7-contenido-principal">

        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Trabajos</h6>
            <h1 className="hu7-titulo-pantalla">Trabajos del periodo</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              {conteos
                ? `${conteos.total} trabajos · ${conteos.activos} activos · ${conteos.sinAsesor} sin asesor`
                : peticionConteos.cargando ? 'Cargando…' : ''}
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button
              type="button"
              className="hu7-boton-exportar"
              disabled={exportando || !peticionLista.datos}
              onClick={handleExportarExcel} >
              {exportando ? 'Exportando…' : 'Exportar a Excel'}
            </button>

            {/* banner de confirmación tras exportar a excel */}
            {exportado && (
              <div className="hu7-textito-exportado">
                <div className="hu7-textito-icono">✓</div>
                <div className="hu7-textito-info">
                  <div className="hu7-textito-titulo">Reporte exportado</div>
                  <div className="hu7-textito-exportar">
                    {exportado.archivo} · {exportado.cantidad} {exportado.cantidad === 1 ? 'trabajo exportado' : 'trabajos exportados'}
                  </div>
                </div>
                <button
                  type="button"
                  className="hu7-textito-cerrar"
                  onClick={() => setExportado(null)}
                  title="Cerrar aviso" >
                  ×
                </button>
              </div>
            )}
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
                maxLength={100}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="select-estado">ESTADO</label>
              <select
                id="select-estado"
                value={filtros.estado}
                disabled={!filtrosListos}
                onChange={cambiarFiltro('estado')}
                className="hu7-seleccionar-filtro"  >
                <option value="">{textoTodos}</option>
                {opciones?.estados.map((e) => (
                  <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                ))}
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-linea">LÍNEA</label>
              <select
                id="seleccionar-linea"
                value={filtros.lineaId}
                disabled={!filtrosListos}
                onChange={cambiarFiltro('lineaId')}
                className="hu7-seleccionar-filtro">
                <option value="">{textoTodas}</option>
                {opciones?.lineas.map((l) => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))}
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-asesor">ASESOR</label>
              <select
                id="seleccionar-asesor"
                value={filtros.asesorId}
                disabled={!filtrosListos}
                onChange={cambiarFiltro('asesorId')}
                className="hu7-seleccionar-filtro"  >
                <option value="">{textoTodos}</option>
                {opciones?.asesores.map((a) => (
                  <option key={a.id} value={a.id}>{a.apellidos}</option>
                ))}
                {filtrosListos && <option value={SIN_ASESOR}>Sin asesor</option>}
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-carrera">CARRERA</label>
              <select
                id="seleccionar-carrera"
                value={filtros.carrera}
                disabled={!filtrosListos}
                onChange={cambiarFiltro('carrera')}
                className="hu7-seleccionar-filtro">
                <option value="">{textoTodas}</option>
                {opciones?.carreras.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Si no cargan las opciones de los filtros, se avisa y se puede reintentar */}
          {peticionFiltros.error && (
            <EstadoVista error={peticionFiltros.error} alReintentar={peticionFiltros.reintentar} />
          )}

          <div className="hu7-tarjeta-tabla-trabajos">
            <EstadoVista
              cargando={peticionLista.cargando && !peticionLista.datos}
              error={peticionLista.error}
              alReintentar={peticionLista.reintentar}>
            <table className="hu7-tabla-trabajos" aria-busy={peticionLista.cargando}>
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
                {trabajos.length > 0 ? (
                  trabajos.map((item) => (
                    <tr key={item.id}>
                      <td className="hu7-col-titulo">
                        <div
                          className="hu7-titulo-trabajo"
                          role="button"
                          tabIndex={0}
                          title="Ver ficha del trabajo"
                          onClick={() => setTrabajoAbierto(item.id)}
                          onKeyDown={abrirConTeclado(item.id)}>
                          {item.titulo}
                        </div>
                        <div className="hu7-codigo-trabajo">{item.codigo}</div>
                      </td>

                      <td>{item.linea?.nombre ?? '—'}</td>
                      <td>{item.equipo.length ? item.equipo.join(', ') : '—'}</td>

                      <td>
                        <span className={item.asesor ? '' : 'hu7-sin-asesor'}>
                          {item.asesor?.apellidos ?? 'Sin asesor'}
                        </span>
                      </td>

                      <td className="hu7-col-avance">
                        <div className="hu7-contenedor-avance-fila">
                          <div className="hu7-barra-progreso-bg">
                            <div
                              className="hu7-barra-progreso-fill"
                              style={{
                                width: `${item.avance}%`,
                                backgroundColor: item.avance === 100 ? '#1E7F4D' : '#1E4534'
                              }}
                            />
                          </div>
                          <span className="hu7-texto-avance">{item.avance}%</span>
                        </div>
                      </td>

                      <td>
                        <span className={`hu7-estado ${CLASE_ESTADO_TRABAJO[item.estado] ?? ''}`}>
                          {etiquetaEstado(item.estado)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="hu7-tabla-vacia">
                      {busquedaRetardada || Object.values(filtros).some(Boolean)
                        ? 'No se encontraron trabajos con los filtros seleccionados.'
                        : 'Aún no hay trabajos registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación del servidor */}
            <div className="hu7-paginacion-trabajos">
              <span>
                Mostrando {primeraFila ? `${primeraFila}-${ultimaFila}` : '0'} de {paginacion.total}
              </span>
              <div className="hu7-botones-paginacion">
                <button
                  type="button"
                  className="hu7-boton-pag"
                  disabled={pagina <= 1 || peticionLista.cargando}
                  onClick={() => irAPagina(pagina - 1)}>
                  Anterior
                </button>
                {Array.from({ length: paginacion.totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={`hu7-boton-pag ${pagina === i + 1 ? 'active' : ''}`}
                    disabled={peticionLista.cargando}
                    onClick={() => irAPagina(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="hu7-boton-pag"
                  disabled={pagina >= paginacion.totalPaginas || peticionLista.cargando}
                  onClick={() => irAPagina(pagina + 1)}>
                  Siguiente
                </button>
              </div>
            </div>
            </EstadoVista>
          </div>

        </div>

        {/* Ficha de detalle del trabajo */}
        {trabajoAbierto && (
          <ModalFichaTrabajo
            trabajoId={trabajoAbierto}
            etiquetaEstado={etiquetaEstado}
            alCerrar={() => setTrabajoAbierto(null)} />
        )}
      </main>
    </PageLayout>
  );
}

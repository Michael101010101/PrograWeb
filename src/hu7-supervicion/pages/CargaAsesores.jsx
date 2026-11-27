import { useState } from 'react';
import * as XLSX from 'xlsx'; // librería para descargar en Excel
import PageLayout from '../../shared/components/PageLayout.jsx';
import EstadoVista from '../components/EstadoVista.jsx';
import ModalDetalleAsesor from '../components/ModalDetalleAsesor.jsx';
import ModalEscribirAsesor from '../components/ModalEscribirAsesor.jsx';
import ModalAmpliarCupo from '../components/ModalAmpliarCupo.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import { cargarAsesoresConPeriodo } from '../api/clienteApiHu7.js';
import { textoONulo } from '../utils/formatoHu7.js';
import {
  colorOcupacion,
  nombreConGrado,
  ocupacion,
  ordenarPorOcupacion,
  plural,
  recomendacion,
  resumenFacultad,
} from '../utils/cargaAsesores.js';
import '../hu7.css';
import '../CargaAsesores.css';

const OBJETIVO_DIAS = 4;

const textoCupo = (a) => `${a.trabajosACargo}/${a.cupoMaximo ?? '—'}`;

/** "Mg. Ana Pérez (2 cupos libres)" */
const candidatoTexto = (c) => `${nombreConGrado(c)} (${plural(c.cupoDisponible, 'cupo libre', 'cupos libres')})`;

export default function CargaAsesores() {
  const peticion = usePeticion(() => cargarAsesoresConPeriodo({ estado: 'activo' }), []);

  // filas actualizadas tras ampliar un cupo (las devuelve el API), por id
  const [actualizados, setActualizados] = useState({});
  const [exportado, setExportado] = useState(null); // { archivo, total } del último Excel
  const [detalleId, setDetalleId] = useState(null);
  const [escribirA, setEscribirA] = useState(null);
  const [ampliarA, setAmpliarA] = useState(null);

  const semestre = peticion.datos?.periodo?.semestre ?? '';
  const asesores = ordenarPorOcupacion((peticion.datos?.asesores ?? []).map((a) => actualizados[a.id] ?? a));
  const resumen = resumenFacultad(asesores);
  const sugerencia = recomendacion(asesores);

  const handleExportarExcel = () => {
    const datosExcel = asesores.map((a) => ({
      ASESOR: nombreConGrado(a),
      DEPARTAMENTO: a.departamento ?? '',
      'CUPO OCUPADO': textoCupo(a),
      DISPONIBLE: a.cupoDisponible ?? '',
      'POR REVISAR': a.avancesPorRevisar,
      'TIEMPO DE REVISIÓN (DÍAS)': a.tiempoRevisionPromedioDias ?? '',
    }));
    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Carga de Asesores');
    const archivo = `${semestre || 'periodo'}-CargaAsesores.xlsx`;
    XLSX.writeFile(libro, archivo);
    setExportado({ archivo, total: asesores.length });
  };

  const handleAmpliado = (asesor) => {
    setActualizados((previo) => ({ ...previo, [asesor.id]: asesor }));
    setAmpliarA(null);
  };

  return (
    <PageLayout>
      <main className="hu7-contenido-principal">
        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Carga por asesor</h6>
            <h1 className="hu7-titulo-pantalla">Carga por asesor</h1>
            {peticion.datos && (
              <h6 className="hu7-subtitulo-pantalla2">
                {plural(asesores.length, 'asesor activo', 'asesores activos')}
                {semestre ? ` · periodo ${semestre}` : ' · sin periodo activo'}
              </h6>
            )}
          </div>

          <div className="hu7-barra-controles">
            <button type="button" className="hu7-boton-exportar" onClick={handleExportarExcel} disabled={!asesores.length}>
              Exportar a Excel
            </button>

            {exportado && (
              <div className="hu7-textito-exportado" role="status">
                <div className="hu7-textito-icono">✓</div>
                <div className="hu7-textito-info">
                  <div className="hu7-textito-titulo">Reporte exportado</div>
                  <div className="hu7-textito-exportar">
                    {exportado.archivo} · {plural(exportado.total, 'asesor', 'asesores')}
                  </div>
                </div>
                <button type="button" className="hu7-banner-cerrar" onClick={() => setExportado(null)} aria-label="Cerrar aviso">
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hu7-contenedorINF">
          <EstadoVista
            cargando={peticion.cargando}
            error={peticion.error}
            alReintentar={peticion.reintentar}
            vacio={Boolean(peticion.datos) && asesores.length === 0}
            tituloVacio="No hay asesores activos"
            textoVacio="Cuando se valide un asesor, aquí verás su carga de trabajos.">
            <div className="hu7-tarjeta-tabla-asesores hu7-tabla-scroll">
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
                  {asesores.map((a) => {
                    const valor = ocupacion(a);
                    const tiempo = a.tiempoRevisionPromedioDias;
                    return (
                      <tr key={a.id}>
                        <td className="hu7-col-asesor">
                          <div className="hu7-nombre-asesor">{nombreConGrado(a)}</div>
                          <div className="hu7-carrera-asesor">{a.departamento ?? '—'}</div>
                        </td>
                        <td className="hu7-col-cupo">
                          <div className="hu7-contenedor-cupo">
                            <span className="hu7-texto-cupo">{textoCupo(a)}</span>
                            {valor !== null && (
                              <div className="hu7-barra-progreso-bg">
                                <div
                                  className={`hu7-barra-progreso-fill ${colorOcupacion(valor)}`}
                                  style={{ width: `${Math.min(100, Math.round(valor * 100))}%` }} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={a.cupoDisponible === 0 ? 'texto-rojo-bold' : a.cupoDisponible ? 'texto-verde-bold' : ''}>
                          {textoONulo(a.cupoDisponible)}
                        </td>
                        <td>{a.avancesPorRevisar}</td>
                        <td className={tiempo !== null && tiempo > OBJETIVO_DIAS ? 'texto-rojo-bold' : ''}>
                          {textoONulo(tiempo, ' días')}
                        </td>
                        <td>
                          <button type="button" className="hu7-boton-detalle" onClick={() => setDetalleId(a.id)}>
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
              <div className="hu7-tarjeta-recomendacion">
                <div className="hu7-contenido-recomendacion">
                  <h3>Recomendación de redistribución</h3>
                  {sugerencia ? (
                    <p className="recomendacion-texto">
                      {nombreConGrado(sugerencia.critico)} está al 100% de su cupo
                      {sugerencia.critico.avancesPorRevisar > 0 &&
                        ` y con ${plural(sugerencia.critico.avancesPorRevisar, 'avance', 'avances')} por revisar`}
                      .{' '}
                      {sugerencia.candidatos.length > 0
                        ? `Considera derivar sus nuevas solicitudes a ${sugerencia.candidatos.map(candidatoTexto).join(' o a ')}, que comparten su línea de investigación.`
                        : 'Ningún asesor con cupo libre comparte sus líneas de investigación; considera ampliar su cupo.'}
                    </p>
                  ) : (
                    <p className="recomendacion-texto">Ningún asesor tiene el cupo completo.</p>
                  )}
                </div>
                {sugerencia && (
                  <div className="hu7-botones-recomendacion">
                    <button type="button" className="hu7-boton-escribir" onClick={() => setEscribirA(sugerencia.critico)}>
                      Escribir al asesor
                    </button>
                    <button type="button" className="hu7-boton-ampliar" onClick={() => setAmpliarA(sugerencia.critico)}>
                      Ampliar su cupo máximo
                    </button>
                  </div>
                )}
              </div>

              <div className="hu7-tarjeta-resumen-facultad">
                <h3>RESUMEN DE LA FACULTAD</h3>
                <div className="hu7-metricas-resumen">
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">CUPOS OCUPADOS</span>
                    <span className="hu7-metrica-valor">{resumen.cuposOcupados} de {resumen.cuposTotales}</span>
                  </div>
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">ASESORES SIN CARGA</span>
                    <span className="hu7-metrica-valor">{resumen.sinCarga}</span>
                  </div>
                  <div className="hu7-metrica-item">
                    <span className="hu7-metrica-titulo">REVISIÓN PROMEDIO</span>
                    <span className="hu7-metrica-valor">{textoONulo(resumen.revisionPromedio, ' días')}</span>
                  </div>
                </div>
                <p className="hu7-nota-objetivo">
                  El objetivo institucional es responder cada avance en un máximo de {OBJETIVO_DIAS} días hábiles.
                </p>
              </div>
            </div>
          </EstadoVista>
        </div>

        {/* Las acciones de la ficha cierran la ficha para no apilar dos modales */}
        {detalleId && (
          <ModalDetalleAsesor
            asesorId={detalleId}
            alCerrar={() => setDetalleId(null)}
            alEscribir={(a) => {
              setDetalleId(null);
              setEscribirA(a);
            }}
            alAmpliar={(a) => {
              setDetalleId(null);
              setAmpliarA(a);
            }} />
        )}

        {escribirA && <ModalEscribirAsesor key={escribirA.id} asesor={escribirA} alCerrar={() => setEscribirA(null)} />}

        {ampliarA && (
          <ModalAmpliarCupo
            key={ampliarA.id}
            asesor={ampliarA}
            semestre={semestre}
            alCerrar={() => setAmpliarA(null)}
            alAmpliar={handleAmpliado} />
        )}
      </main>
    </PageLayout>
  );
}

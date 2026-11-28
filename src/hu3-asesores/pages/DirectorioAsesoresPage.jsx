import { useEffect, useRef, useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useDatos } from '../../shared/context/DatosContext.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { useDirectorio, useMiSolicitud } from '../hooks/useAsesorias.js';
import * as servicio from '../services/asesoriasService.js';
import { formatearFecha } from '../utils/fechas.js';
import AsesorCard from '../components/AsesorCard.jsx';
import FiltrosDirectorio from '../components/FiltrosDirectorio.jsx';
import EstadoSolicitud from '../components/EstadoSolicitud.jsx';
import Paginacion from '../components/Paginacion.jsx';
import { SlotTrabajo } from '../components/SlotsCabecera.jsx';
import ModalSolicitarAsesoria from '../components/modales/ModalSolicitarAsesoria.jsx';
import ModalSolicitudActiva from '../components/modales/ModalSolicitudActiva.jsx';
import ModalAsesorSinCupo from '../components/modales/ModalAsesorSinCupo.jsx';
import '../styles/hu3.css';

const POR_PAGINA = 6;
const ESPERA_BUSQUEDA = 400; // ms sin escribir antes de pedir a la API

/**
 * 3.2 Directorio de asesores (diapositiva 23).
 * Rol Estudiante: puede solicitar asesoría. Visitante (sin sesión): solo lectura.
 * Los asesores llegan paginados desde GET /api/asesores; los filtros se aplican en el servidor.
 */
export default function DirectorioAsesoresPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const { periodo } = useDatos();
  const esEstudiante = usuario?.rol === 'estudiante';

  // "Mi solicitud": trabajo del estudiante, su última solicitud, el asesor y el término (GET /api/solicitudes/mia)
  const mia = useMiSolicitud(esEstudiante);
  const trabajo = mia.datos?.trabajo ?? null;
  const ultima = mia.datos?.solicitud ?? null;
  const activa = ultima?.estado === 'pendiente' ? ultima : null;

  // Filtros: por defecto, solo asesores con cupo (y, cuando llega el trabajo, su línea)
  const [filtros, setFiltros] = useState({ texto: '', linea: '', departamento: '', soloConCupo: true });
  const [textoBuscado, setTextoBuscado] = useState('');
  const [orden, setOrden] = useState('cupo');
  const [pagina, setPagina] = useState(1);
  // Modal abierto: null o { tipo: 'solicitar' | 'activa' | 'sinCupo', asesor, alternativas?, linea? }
  const [modal, setModal] = useState(null);

  // Cuando llega el trabajo del estudiante, el directorio arranca filtrado por su línea (una sola vez)
  const lineaPuesta = useRef(false);
  useEffect(() => {
    if (trabajo && !lineaPuesta.current) {
      lineaPuesta.current = true;
      setFiltros((f) => ({ ...f, linea: trabajo.linea }));
    }
  }, [trabajo]);

  // La búsqueda por nombre espera a que el usuario deje de escribir (evita una petición por tecla)
  useEffect(() => {
    const nuevo = filtros.texto.trim();
    if (nuevo === textoBuscado) return undefined; // el texto no cambió: no hay nada que buscar
    const espera = setTimeout(() => {
      setTextoBuscado(nuevo);
      setPagina(1);
    }, ESPERA_BUSQUEDA);
    return () => clearTimeout(espera);
  }, [filtros.texto, textoBuscado]);

  const directorio = useDirectorio({ ...filtros, texto: textoBuscado }, orden, pagina, POR_PAGINA);
  const resultado = directorio.datos;

  const cambiarFiltro = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
    if (campo !== 'texto') setPagina(1); // al filtrar se vuelve a la primera página
  };
  const limpiarFiltros = () => {
    setFiltros({ texto: '', linea: '', departamento: '', soloConCupo: false });
    setPagina(1);
  };

  // Chips de "Filtros activos"
  const chips = [
    filtros.texto && { campo: 'texto', texto: `“${filtros.texto}”`, valorVacio: '' },
    filtros.linea && { campo: 'linea', texto: filtros.linea, valorVacio: '' },
    filtros.departamento && { campo: 'departamento', texto: filtros.departamento, valorVacio: '' },
    filtros.soloConCupo && { campo: 'soloConCupo', texto: 'Solo con cupo', valorVacio: false },
  ].filter(Boolean);

  // Abre "Este asesor no tiene cupo" y pide a la API otros asesores de la misma línea con cupo
  const abrirSinCupo = async (asesor) => {
    const linea = trabajo?.linea ?? asesor.lineas[0];
    setModal({ tipo: 'sinCupo', asesor, alternativas: null, linea });
    try {
      const r = await servicio.obtenerAlternativas(asesor.id, linea);
      setModal((m) => (m?.tipo === 'sinCupo' && m.asesor.id === asesor.id ? { ...m, alternativas: r.asesores, linea: r.linea } : m));
    } catch {
      setModal((m) => (m?.tipo === 'sinCupo' ? { ...m, alternativas: [] } : m));
    }
  };

  // Decide qué modal abrir al pulsar "Solicitar asesoría"
  const pedirAsesoria = (asesor) => {
    if (!trabajo) {
      mostrar({ tipo: 'aviso', titulo: 'Aún no tienes un trabajo registrado', mensaje: 'Registra tu trabajo en «Mi trabajo» para poder solicitar asesor.' });
    } else if (trabajo.asesorId) {
      mostrar({ tipo: 'aviso', titulo: 'Tu trabajo ya tiene asesor', mensaje: 'No es posible enviar otra solicitud.' });
    } else if (activa) {
      setModal({ tipo: 'activa', asesor: mia.datos.asesor });
    } else if (asesor.cupoDisponible === 0) {
      abrirSinCupo(asesor);
    } else {
      setModal({ tipo: 'solicitar', asesor });
    }
  };

  // POST /api/solicitudes. Si el servidor la rechaza (400/409), el error llega al modal y lo muestra.
  const enviarSolicitud = async (mensaje) => {
    await servicio.solicitarAsesoria(modal.asesor.id, mensaje);
    mostrar({ tipo: 'exito', titulo: 'Solicitud enviada', mensaje: `${modal.asesor.nombre} la verá en su bandeja.` });
    setModal(null);
    mia.recargar();
  };

  const retirarActiva = async () => {
    try {
      await servicio.retirarSolicitud(activa.id);
      mostrar({ tipo: 'exito', titulo: 'Solicitud retirada', mensaje: 'Ya puedes solicitar a otro asesor.' });
      setModal(null);
      mia.recargar();
    } catch (e) {
      mostrar({ tipo: 'error', titulo: 'No se pudo retirar', mensaje: e.message });
    }
  };

  // Textos que dependen del estado
  let estadoTrabajo = 'Sin asesor';
  if (trabajo?.asesorId) estadoTrabajo = 'Con asesor';
  else if (activa) estadoTrabajo = 'Solicitud pendiente';

  // Fecha de cierre de la etapa "Asignación de asesores" (viene del cronograma del periodo, GET /api/periodo)
  const etapaAsignacion = periodo.etapas.find((e) => e.nombre === 'Asignación de asesores');
  const navInfo = esEstudiante && etapaAsignacion ? `Asignación de asesores cierra el ${formatearFecha(etapaAsignacion.fin)}` : undefined;

  let footerDetalle;
  if (esEstudiante) footerDetalle = activa ? 'con solicitud activa' : 'sin solicitud activa';

  const textoVacio =
    `No hay asesores${filtros.linea ? ` de ${filtros.linea}` : ''}${filtros.soloConCupo ? ' con cupo' : ''}` +
    `${filtros.departamento ? ` en ${filtros.departamento}` : ''}${textoBuscado ? ` con el nombre “${textoBuscado}”` : ''}. ` +
    (filtros.departamento ? 'Prueba quitando el filtro de departamento.' : 'Prueba quitando algún filtro.');

  // Lista: cargando la primera vez · error · sin resultados · tarjetas + paginación
  let lista;
  if (!resultado && directorio.cargando) {
    lista = <p className="text-muted" style={{ padding: '24px 0' }}>Cargando asesores…</p>;
  } else if (directorio.error && !resultado) {
    lista = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
        <EmptyState icono="!" tono="warning" titulo="No pudimos cargar el directorio" texto={directorio.error.message}>
          <button className="btn btn--outline" onClick={directorio.recargar}>Reintentar</button>
        </EmptyState>
      </div>
    );
  } else if (resultado.total === 0) {
    lista = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
        <EmptyState icono="⌕" titulo="Ningún asesor coincide" texto={textoVacio}>
          <button className="btn btn--outline" onClick={limpiarFiltros}>Quitar filtros</button>
        </EmptyState>
      </div>
    );
  } else {
    lista = (
      <>
        <div className="hu3-grid" style={{ opacity: directorio.cargando ? 0.6 : 1 }}>
          {resultado.asesores.map((asesor) => (
            <AsesorCard key={asesor.id} asesor={asesor} modoLectura={!esEstudiante} onSolicitar={pedirAsesoria} />
          ))}
        </div>
        <Paginacion pagina={resultado.pagina} porPagina={POR_PAGINA} total={resultado.total} onCambiar={setPagina} />
      </>
    );
  }

  return (
    <PageLayout
      headerSlot={trabajo && <SlotTrabajo trabajo={trabajo} estado={estadoTrabajo} />}
      navInfo={navInfo}
      footerDetalle={footerDetalle}
    >
      <PageHead
        migas="Inicio · Directorio de asesores"
        titulo="Directorio de asesores"
        descripcion={
          resultado
            ? `${resultado.totalAsesores} asesores · ${resultado.conCupo} con cupo disponible · ${resultado.total} coinciden con tus filtros`
            : 'Cargando…'
        }
        acciones={
          <div className="hu3-orden">
            <label className="field__label" htmlFor="hu3-orden">Ordenar por</label>
            <select
              id="hu3-orden"
              className="select"
              value={orden}
              onChange={(e) => {
                setOrden(e.target.value);
                setPagina(1);
              }}
            >
              <option value="cupo">Cupo disponible</option>
              <option value="experiencia">Trabajos asesorados</option>
              <option value="nombre">Apellido (A–Z)</option>
            </select>
          </div>
        }
      />

      {trabajo && (
        <EstadoSolicitud
          trabajo={trabajo}
          solicitud={ultima}
          asesor={mia.datos.asesor}
          termino={mia.datos.termino}
          onRetirar={() => setModal({ tipo: 'activa', asesor: mia.datos.asesor })}
        />
      )}

      <FiltrosDirectorio filtros={filtros} onCambiar={cambiarFiltro} />

      {chips.length > 0 && (
        <div className="hu3-filtros-activos">
          <span className="text-label">Filtros activos</span>
          {chips.map((chip) => (
            <span key={chip.campo} className="hu3-chip">
              {chip.texto}
              <button
                type="button"
                className="hu3-chip__quitar"
                aria-label={`Quitar filtro ${chip.texto}`}
                onClick={() => cambiarFiltro(chip.campo, chip.valorVacio)}
              >
                ×
              </button>
            </span>
          ))}
          <button type="button" className="link-button" style={{ fontSize: 14 }} onClick={limpiarFiltros}>
            Limpiar todo
          </button>
        </div>
      )}

      {lista}

      {modal?.tipo === 'solicitar' && (
        <ModalSolicitarAsesoria
          asesor={modal.asesor}
          trabajo={trabajo}
          onEnviar={enviarSolicitud}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal?.tipo === 'activa' && activa && (
        <ModalSolicitudActiva
          solicitud={activa}
          asesor={modal.asesor}
          onRetirar={retirarActiva}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal?.tipo === 'sinCupo' && (
        <ModalAsesorSinCupo
          asesor={modal.asesor}
          linea={modal.linea}
          alternativas={modal.alternativas}
          onSolicitarOtro={(otro) => setModal({ tipo: 'solicitar', asesor: otro })}
          onCerrar={() => setModal(null)}
        />
      )}
    </PageLayout>
  );
}

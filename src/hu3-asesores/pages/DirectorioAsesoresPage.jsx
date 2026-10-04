import { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useAsesorias from '../hooks/useAsesorias.js';
import {
  buscarAsesor,
  cupoDisponible,
  filtrarAsesores,
  nombreAsesor,
  ordenarAsesores,
  solicitudActiva,
  trabajoDeEstudiante,
} from '../services/asesoriasService.js';
import AsesorCard from '../components/AsesorCard.jsx';
import FiltrosDirectorio from '../components/FiltrosDirectorio.jsx';
import Paginacion from '../components/Paginacion.jsx';
import { SlotTrabajo } from '../components/SlotsCabecera.jsx';
import ModalSolicitarAsesoria from '../components/modales/ModalSolicitarAsesoria.jsx';
import ModalSolicitudActiva from '../components/modales/ModalSolicitudActiva.jsx';
import ModalAsesorSinCupo from '../components/modales/ModalAsesorSinCupo.jsx';
import '../styles/hu3.css';

const POR_PAGINA = 6;

/**
 * 3.2 Directorio de asesores (diapositiva 23).
 * Rol Estudiante: puede solicitar asesoría. Visitante (sin sesión): solo lectura.
 */
export default function DirectorioAsesoresPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const { datos, solicitar, retirar } = useAsesorias();

  const esEstudiante = usuario?.rol === 'estudiante';
  const trabajo = esEstudiante ? trabajoDeEstudiante(datos, usuario.id) : null;
  const activa = trabajo ? solicitudActiva(datos, trabajo.codigo) : null;

  // Filtros: por defecto, la línea del trabajo del estudiante y solo asesores con cupo.
  const filtrosIniciales = { texto: '', linea: trabajo?.linea ?? '', departamento: '', soloConCupo: true };
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [orden, setOrden] = useState('cupo');
  const [pagina, setPagina] = useState(1);
  // Modal abierto: null o { tipo: 'solicitar' | 'activa' | 'sinCupo', asesor }
  const [modal, setModal] = useState(null);

  const cambiarFiltro = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
    setPagina(1); // al filtrar se vuelve a la primera página
  };
  const limpiarFiltros = () => {
    setFiltros({ texto: '', linea: '', departamento: '', soloConCupo: false });
    setPagina(1);
  };

  // filter → sort → slice: resultados de la página actual
  const resultados = ordenarAsesores(filtrarAsesores(datos.asesores, filtros), orden);
  const paginaActual = resultados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const conCupo = datos.asesores.filter((a) => cupoDisponible(a) > 0).length;

  // Chips de "Filtros activos"
  const chips = [
    filtros.texto && { campo: 'texto', texto: `“${filtros.texto}”`, valorVacio: '' },
    filtros.linea && { campo: 'linea', texto: filtros.linea, valorVacio: '' },
    filtros.departamento && { campo: 'departamento', texto: filtros.departamento, valorVacio: '' },
    filtros.soloConCupo && { campo: 'soloConCupo', texto: 'Solo con cupo', valorVacio: false },
  ].filter(Boolean);

  // Decide qué modal abrir al pulsar "Solicitar asesoría"
  const pedirAsesoria = (asesor) => {
    if (!trabajo) {
      mostrar({ tipo: 'aviso', titulo: 'Aún no tienes un trabajo registrado', mensaje: 'Registra tu trabajo en «Mi trabajo» para poder solicitar asesor.' });
    } else if (trabajo.asesorId) {
      mostrar({ tipo: 'aviso', titulo: 'Tu trabajo ya tiene asesor', mensaje: 'No es posible enviar otra solicitud.' });
    } else if (activa) {
      setModal({ tipo: 'activa', asesor: buscarAsesor(datos, activa.asesorId) });
    } else if (cupoDisponible(asesor) === 0) {
      setModal({ tipo: 'sinCupo', asesor });
    } else {
      setModal({ tipo: 'solicitar', asesor });
    }
  };

  const enviarSolicitud = (mensaje) => {
    solicitar({ codigoTrabajo: trabajo.codigo, asesorId: modal.asesor.id, mensaje }); // puede lanzar Error
    setModal(null);
    mostrar({ tipo: 'exito', titulo: 'Solicitud enviada', mensaje: `${nombreAsesor(modal.asesor)} la verá en su bandeja.` });
  };

  const retirarActiva = () => {
    retirar(activa.id);
    setModal(null);
    mostrar({ tipo: 'exito', titulo: 'Solicitud retirada', mensaje: 'Ya puedes solicitar a otro asesor.' });
  };

  // Otros asesores de la misma línea con cupo (para el modal "sin cupo")
  const lineaBuscada = trabajo?.linea ?? modal?.asesor?.lineas[0];
  const alternativas =
    modal?.tipo === 'sinCupo'
      ? ordenarAsesores(
          datos.asesores.filter((a) => a.lineas.includes(lineaBuscada) && cupoDisponible(a) > 0),
          'cupo'
        ).slice(0, 2)
      : [];

  // Textos que dependen del estado
  let estadoTrabajo = 'Sin asesor';
  if (trabajo?.asesorId) estadoTrabajo = 'Con asesor';
  else if (activa) estadoTrabajo = 'Solicitud pendiente';

  let footerDetalle;
  if (esEstudiante) footerDetalle = activa ? 'con solicitud activa' : 'sin solicitud activa';

  const textoVacio =
    `No hay asesores${filtros.linea ? ` de ${filtros.linea}` : ''}${filtros.soloConCupo ? ' con cupo' : ''}` +
    `${filtros.departamento ? ` en ${filtros.departamento}` : ''}${filtros.texto ? ` con el nombre “${filtros.texto}”` : ''}. ` +
    (filtros.departamento ? 'Prueba quitando el filtro de departamento.' : 'Prueba quitando algún filtro.');

  return (
    <PageLayout
      headerSlot={trabajo && <SlotTrabajo trabajo={trabajo} estado={estadoTrabajo} />}
      navInfo={esEstudiante ? 'Asignación de asesores cierra el 11/09/2026' : undefined}
      footerDetalle={footerDetalle}
    >
      <PageHead
        migas="Inicio · Directorio de asesores"
        titulo="Directorio de asesores"
        descripcion={`${datos.asesores.length} asesores · ${conCupo} con cupo disponible · ${resultados.length} coinciden con tus filtros`}
        acciones={
          <div className="hu3-orden">
            <label className="field__label" htmlFor="hu3-orden">Ordenar por</label>
            <select id="hu3-orden" className="select" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="cupo">Cupo disponible</option>
              <option value="experiencia">Trabajos asesorados</option>
              <option value="nombre">Apellido (A–Z)</option>
            </select>
          </div>
        }
      />

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

      {resultados.length === 0 ? (
        <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
          <EmptyState icono="⌕" titulo="Ningún asesor coincide" texto={textoVacio}>
            <button className="btn btn--outline" onClick={limpiarFiltros}>Quitar filtros</button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="hu3-grid">
            {paginaActual.map((asesor) => (
              <AsesorCard key={asesor.id} asesor={asesor} modoLectura={!esEstudiante} onSolicitar={pedirAsesoria} />
            ))}
          </div>
          <Paginacion pagina={pagina} porPagina={POR_PAGINA} total={resultados.length} onCambiar={setPagina} />
        </>
      )}

      {modal?.tipo === 'solicitar' && (
        <ModalSolicitarAsesoria
          asesor={modal.asesor}
          trabajo={trabajo}
          onEnviar={enviarSolicitud}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal?.tipo === 'activa' && (
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
          linea={lineaBuscada}
          alternativas={alternativas}
          onSolicitarOtro={(otro) => setModal({ tipo: 'solicitar', asesor: otro })}
          onCerrar={() => setModal(null)}
        />
      )}
    </PageLayout>
  );
}

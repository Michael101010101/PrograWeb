import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import useEntregables from '../hooks/useEntregables.js';
import { simularSuma } from '../services/entregablesService.js';
import { formatearFecha } from '../utils/fechas.js';
import FormularioEntregable from '../components/FormularioEntregable.jsx';
import TablaPlan from '../components/TablaPlan.jsx';
import SolicitudesAmpliacion from '../components/SolicitudesAmpliacion.jsx';
import ModalPesosExcedidos from '../components/modales/ModalPesosExcedidos.jsx';
import '../styles/hu4.css';

const VACIO = { nombre: '', descripcion: '', fechaLimite: '', peso: '', obligatorio: true };
const acortar = (texto, maximo = 32) => (texto.length > maximo ? `${texto.slice(0, maximo).trim()}...` : texto);

/** Pantalla 4.2 · Definir el plan de entregables (rol Asesor). Ruta: /asesor/asesorados/:codigo/plan */
export default function DefinirPlanPage() {
  const { codigo: trabajoId } = useParams(); // 'TFC-2026-2-047' (enlace de la HU-3) o 't-047'
  const { mostrar } = useToast();
  // GET /api/planes/:trabajoId. El servidor responde 404 si el trabajo no es de esta asesora.
  const { plan, cargando, error: errorCarga, guardarEntregable, eliminarEntregable, aplicarPlantilla, responderAmpliacion } =
    useEntregables(trabajoId);

  const [valores, setValores] = useState(VACIO); // lo que está escrito en el formulario
  const [editandoId, setEditandoId] = useState(null); // null = entregable nuevo
  const [error, setError] = useState('');
  const [modalPesos, setModalPesos] = useState(false);
  const [porEliminar, setPorEliminar] = useState(null);

  const trabajo = plan?.trabajo ?? null;

  const layout = (contenido) => (
    <PageLayout footerDetalle={`editando el plan de ${trabajo?.codigo ?? trabajoId}`}>{contenido}</PageLayout>
  );

  if (cargando) return layout(<p className="text-muted">Cargando el plan…</p>);

  // Solo la asesora a cargo puede ver y editar el plan (lo verifica el servidor).
  if (errorCarga || !trabajo) {
    return layout(
      <div className="card hu4-vacio">
        <EmptyState icono="?" titulo="Trabajo no encontrado" texto={errorCarga || `El trabajo ${trabajoId} no está a tu cargo.`}>
          <Link to="/asesor/asesorados" className="btn btn--outline">Volver a Mis asesorados</Link>
        </EmptyState>
      </div>
    );
  }

  const { items } = plan;
  const soloLectura = trabajo.estado === 'concluido';
  const editando = items.find((e) => e.id === editandoId) ?? null;

  // Suma "en vivo": el plan actual sin el entregable en edición + lo que está escrito en el formulario.
  const { suma } = simularSuma(items, valores, editandoId);
  // Pesos que se muestran sumados ("15 + 20 + …"), en el orden del plan y con el valor del formulario.
  const pesoFormulario = valores.obligatorio ? Number(valores.peso) || 0 : 0;
  const pesosVisibles = items
    .map((e) => (e.id === editandoId ? pesoFormulario : e.obligatorio ? e.peso : 0))
    .concat(editandoId ? [] : [pesoFormulario])
    .filter((peso) => peso > 0);

  const ampliaciones = plan.ampliacionesPendientes;

  const limpiar = () => {
    setValores(VACIO);
    setEditandoId(null);
    setError('');
  };

  const cambiar = (campo, valor) => setValores((actual) => ({ ...actual, [campo]: valor }));

  const empezarEdicion = (e) => {
    setEditandoId(e.id);
    setValores({ nombre: e.nombre, descripcion: e.descripcion, fechaLimite: e.fechaLimite, peso: String(e.peso), obligatorio: e.obligatorio });
    setError('');
  };

  // Llama a la API; si el servidor valida, avisa con un toast y limpia el formulario.
  const guardar = async (formulario) => {
    try {
      await guardarEntregable(formulario, editandoId);
      const cambioFecha = editando && editando.fechaLimite !== formulario.fechaLimite;
      mostrar({
        tipo: 'exito',
        titulo: editando ? 'Entregable actualizado' : 'Entregable agregado',
        mensaje: cambioFecha ? `Se notificó al equipo la nueva fecha límite: ${formatearFecha(formulario.fechaLimite)}.` : formulario.nombre.trim(),
      });
      setModalPesos(false);
      limpiar();
    } catch (err) {
      setModalPesos(false);
      setError(err.message);
    }
  };

  // Si la suma pasa de 100 se abre el modal 4.2 en lugar de mostrar el error en el formulario.
  const intentarGuardar = () => {
    if (suma > 100) setModalPesos(true);
    else guardar(valores);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarEntregable(porEliminar.id);
      mostrar({ tipo: 'exito', titulo: 'Entregable eliminado', mensaje: `${porEliminar.nombre} se quitó del plan.` });
      if (porEliminar.id === editandoId) limpiar();
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: err.message });
    }
    setPorEliminar(null);
  };

  const usarPlantilla = async () => {
    try {
      await aplicarPlantilla();
      mostrar({ tipo: 'exito', titulo: 'Plantilla aplicada', mensaje: 'Se crearon 5 entregables que suman 100. Ajusta las fechas si lo necesitas.' });
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo aplicar la plantilla', mensaje: err.message });
    }
  };

  const responder = async (solicitud, aceptar) => {
    try {
      await responderAmpliacion(solicitud.id, aceptar);
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo responder', mensaje: err.message });
      return;
    }
    mostrar({
      tipo: aceptar ? 'exito' : 'aviso',
      titulo: aceptar ? 'Ampliación aceptada' : 'Ampliación rechazada',
      mensaje: aceptar
        ? `${solicitud.entregable.nombre} vence ahora el ${formatearFecha(solicitud.nuevaFecha)}.`
        : `${solicitud.entregable.nombre} mantiene su fecha límite.`,
    });
  };

  // Filas para el modal de pesos, con el peso que se intentó guardar.
  const filasModal = editandoId
    ? items.filter((e) => e.obligatorio)
    : [...items.filter((e) => e.obligatorio), { id: 'nuevo', orden: items.length + 1, nombre: valores.nombre.trim() || 'Nuevo entregable', peso: Number(valores.peso) }];

  return layout(
    <>
      <PageHead
        migas={`Mis asesorados · ${acortar(trabajo.titulo)} · Plan de entregables`}
        titulo="Definir el plan de entregables"
        descripcion="Los pesos deben sumar exactamente 100. El avance del trabajo se calcula con el peso de los entregables aprobados."
      />

      {soloLectura && (
        <div className="hu4-espacio">
          <Alert tipo="info">El trabajo está concluido: el plan queda en modo lectura.</Alert>
        </div>
      )}

      <SolicitudesAmpliacion solicitudes={soloLectura ? [] : ampliaciones} onResponder={responder} />

      <div className={soloLectura ? '' : 'hu4-plan-grid'}>
        {!soloLectura && (
          <FormularioEntregable
            valores={valores}
            editando={editando}
            error={error}
            suma={suma}
            pesos={pesosVisibles}
            onCambiar={cambiar}
            onGuardar={intentarGuardar}
            onCancelar={limpiar}
          />
        )}

        <TablaPlan
          items={items}
          suma={plan.suma}
          editandoId={editandoId}
          soloLectura={soloLectura}
          puedeUsarPlantilla={!soloLectura && items.length === 0}
          onEditar={empezarEdicion}
          onEliminar={setPorEliminar}
          onPlantilla={usarPlantilla}
        />
      </div>

      {modalPesos && (
        <ModalPesosExcedidos
          filas={filasModal}
          resaltadoId={editandoId ?? 'nuevo'}
          pesoInicial={valores.peso}
          sumaSinEste={suma - Number(valores.peso)}
          onGuardar={(peso) => {
            setValores((actual) => ({ ...actual, peso: String(peso) }));
            guardar({ ...valores, peso });
          }}
          onCerrar={() => setModalPesos(false)}
        />
      )}

      <ConfirmDialog
        abierto={Boolean(porEliminar)}
        titulo="Eliminar entregable"
        mensaje={porEliminar ? `¿Quitar «${porEliminar.nombre}» del plan? Los entregables siguientes se vuelven a numerar.` : ''}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

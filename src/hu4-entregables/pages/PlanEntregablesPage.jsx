import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import useEntregables from '../hooks/useEntregables.js';
import { alertasDe, detallePlan, trabajoDeEstudiante, ultimaRetroalimentacion } from '../services/entregablesService.js';
import { formatearFecha } from '../utils/fechas.js';
import { capitalizar, unirConY } from '../utils/texto.js';
import SlotTrabajo from '../components/SlotTrabajo.jsx';
import BarraAvance from '../components/BarraAvance.jsx';
import ItemEntregable from '../components/ItemEntregable.jsx';
import ComposicionAvance from '../components/ComposicionAvance.jsx';
import ModalRegistrarAvance from '../components/modales/ModalRegistrarAvance.jsx';
import ModalSolicitarAmpliacion from '../components/modales/ModalSolicitarAmpliacion.jsx';
import '../styles/hu4.css';

/** Pantalla 4.1 · Plan de entregables (rol Estudiante). Ruta: /estudiante/entregables */
export default function PlanEntregablesPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const { datos, registrarAvance, solicitarAmpliacion } = useEntregables();
  // Qué modal está abierto: { tipo: 'avance' | 'ampliacion', entregable } o null
  const [modal, setModal] = useState(null);

  const trabajo = trabajoDeEstudiante(datos, usuario.id);
  const plan = trabajo ? detallePlan(datos, trabajo.codigo) : null;
  const avance = plan?.avance.porcentaje ?? 0;

  const layout = (contenido) => (
    <PageLayout
      headerSlot={<SlotTrabajo trabajo={trabajo} avance={avance} />}
      navInfo={PERIODO.etapaActual}
      footerDetalle={trabajo ? `${trabajo.codigo} · avance ${avance}%` : undefined}
    >
      {contenido}
    </PageLayout>
  );

  // Sin trabajo con asesor: el plan todavía no existe.
  if (!trabajo) {
    return layout(
      <div className="card hu4-vacio">
        <EmptyState icono="⋮" titulo="Aún no tienes un trabajo con asesor" texto="El plan de entregables se habilita cuando registras tu trabajo y un asesor acepta tu solicitud.">
          <Link to="/estudiante/mi-trabajo" className="btn btn--outline">Ir a mi trabajo</Link>
        </EmptyState>
      </div>
    );
  }

  const { trato, nombre: nombreAsesor, correo } = trabajo.asesor;
  const { items, suma } = plan;

  // Estado 4.1 "Aún no hay plan definido".
  if (items.length === 0) {
    return layout(
      <div className="card hu4-vacio">
        <EmptyState
          icono="⋮"
          titulo="Aún no hay plan definido"
          texto={`${capitalizar(trato)} debe definir los entregables con sus fechas límite y pesos. Te avisaremos por correo cuando el plan esté listo.`}
        >
          <a href={`mailto:${correo}`} className="btn btn--outline">Escribir a {trato.replace('tu ', 'mi ')}</a>
        </EmptyState>
      </div>
    );
  }

  const concluido = trabajo.estado === 'concluido';
  const aprobados = plan.avance.aprobados;
  const alertas = alertasDe(datos, trabajo.codigo);
  // Próximo entregable por presentar (pendiente u observado), para el texto de la alerta.
  const siguiente = items.find((e) => ['pendiente', 'observado'].includes(e.estado));
  const retro = ultimaRetroalimentacion(datos, trabajo.codigo);

  const confirmarAvance = (valores) => {
    registrarAvance(modal.entregable.id, valores); // si hay error, el modal lo muestra
    mostrar({ tipo: 'exito', titulo: 'Avance registrado', mensaje: `${modal.entregable.nombre} pasó a revisión de ${trato}.` });
    setModal(null);
  };

  const confirmarAmpliacion = (valores) => {
    solicitarAmpliacion(modal.entregable.id, valores);
    mostrar({ tipo: 'exito', titulo: 'Solicitud enviada', mensaje: `${capitalizar(trato)} verá tu pedido de ampliación.` });
    setModal(null);
  };

  return layout(
    <>
      <section className="card hu4-cabecera">
        <div>
          <p className="page-head__crumbs">Mi trabajo · Plan de entregables</p>
          <h1>Plan de entregables</h1>
          <p className="page-head__desc">
            {items.length} entregables · pesos suman {suma} · definido por {nombreAsesor.replace('Dra.', 'la Dra.').replace('Mg.', 'el Mg.')}
          </p>
        </div>
        <div className="hu4-cabecera__avance">
          <p className="hu4-cabecera__fila">
            <span className="text-label">Avance acumulado</span>
            <strong>{avance}%</strong>
          </p>
          <BarraAvance valor={avance} />
          <p className="text-aux text-muted">
            {aprobados.length === 0
              ? 'Aún no hay entregables aprobados'
              : `${aprobados.length === 1 ? 'Entregable' : 'Entregables'} ${unirConY(aprobados.map((e) => e.orden))} ${aprobados.length === 1 ? 'aprobado' : 'aprobados'} (${aprobados.map((e) => e.peso).join(' + ')})`}
          </p>
        </div>
        <span className="hu4-chip">{concluido ? 'Plan en modo lectura' : `Solo ${trato} puede editar el plan`}</span>
      </section>

      {suma !== 100 && (
        <div className="hu4-espacio">
          <Alert tipo="info">{capitalizar(trato)} aún está completando el plan: los pesos suman {suma} de 100.</Alert>
        </div>
      )}

      <div className="layout-aside">
        <section className="card">
          <ol className="hu4-linea">
            {items.map((e) => (
              <ItemEntregable
                key={e.id}
                entregable={e}
                trato={trato}
                onRegistrar={(entregable) => setModal({ tipo: 'avance', entregable })}
                onAmpliar={(entregable) => setModal({ tipo: 'ampliacion', entregable })}
              />
            ))}
          </ol>
          {concluido && <p className="text-aux text-muted">Ya no se admiten nuevos avances. El historial de versiones y los comentarios siguen disponibles.</p>}
        </section>

        <aside className="layout-aside__side">
          <ComposicionAvance items={items} avance={avance} />

          {(alertas.vencidos.length > 0 || alertas.proximos.length > 0) && (
            <section className="card card--warning hu4-alerta">
              <h2>Alerta de vencimiento</h2>
              <p>
                {alertas.vencidos.map((e) => `${e.nombre} vencía el ${formatearFecha(e.fechaLimite)}. `)}
                {siguiente && `${siguiente.nombre} vence el ${formatearFecha(siguiente.fechaLimite)}.`}
                {!siguiente && alertas.vencidos.length === 0 && `${alertas.proximos[0].nombre} vence el ${formatearFecha(alertas.proximos[0].fechaLimite)}.`}
              </p>
              <Link to="/estudiante/entregables/alertas" className="btn btn--warning btn--block">Ver alertas</Link>
            </section>
          )}

          {retro && (
            <section className="card hu4-retro">
              <h2 className="text-label">Última retroalimentación</h2>
              <p className="hu4-retro__titulo">
                {retro.entregable.nombre} · v{retro.version} · {retro.estado}
              </p>
              <p className="text-muted">«{retro.revision.comentario}»</p>
              <Link to="/estudiante/retroalimentacion">Ver todas las revisiones</Link>
            </section>
          )}
        </aside>
      </div>

      {modal?.tipo === 'avance' && (
        <ModalRegistrarAvance entregable={modal.entregable} trato={trato} onConfirmar={confirmarAvance} onCerrar={() => setModal(null)} />
      )}
      {modal?.tipo === 'ampliacion' && (
        <ModalSolicitarAmpliacion entregable={modal.entregable} trato={trato} onConfirmar={confirmarAmpliacion} onCerrar={() => setModal(null)} />
      )}
    </>
  );
}

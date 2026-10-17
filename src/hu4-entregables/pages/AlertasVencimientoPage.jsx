import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import useEntregables from '../hooks/useEntregables.js';
import { DIAS_ALERTA, alertasDe, detallePlan, trabajoDeEstudiante } from '../services/entregablesService.js';
import { HOY, formatearFecha, textoDias } from '../utils/fechas.js';
import { capitalizar, plural, unirConY } from '../utils/texto.js';
import SlotTrabajo from '../components/SlotTrabajo.jsx';
import { PuntoEstado } from '../components/EstadoEntregable.jsx';
import ModalRegistrarAvance from '../components/modales/ModalRegistrarAvance.jsx';
import ModalSolicitarAmpliacion from '../components/modales/ModalSolicitarAmpliacion.jsx';
import ModalRequisitos from '../components/modales/ModalRequisitos.jsx';
import '../styles/hu4.css';

/** Pantalla 4.4 · Alertas de vencimiento (rol Estudiante). Ruta: /estudiante/entregables/alertas */
export default function AlertasVencimientoPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const { datos, registrarAvance, solicitarAmpliacion } = useEntregables();
  // Modal abierto: { tipo: 'avance' | 'ampliacion' | 'requisitos', item } o null
  const [modal, setModal] = useState(null);

  const trabajo = trabajoDeEstudiante(datos, usuario.id);
  const plan = trabajo ? detallePlan(datos, trabajo.codigo) : null;
  const avance = plan?.avance.porcentaje ?? 0;
  const hoy = formatearFecha(HOY);

  const layout = (contenido) => (
    <PageLayout
      headerSlot={<SlotTrabajo trabajo={trabajo} avance={avance} />}
      navInfo={PERIODO.etapaActual}
      footerDetalle={`alertas calculadas al ${hoy}`}
    >
      {contenido}
    </PageLayout>
  );

  const botonPlan = (texto) => <Link to="/estudiante/entregables" className="btn btn--outline">{texto}</Link>;

  if (!trabajo || plan.items.length === 0) {
    return layout(
      <div className="card hu4-vacio">
        <EmptyState icono="⋮" titulo="Aún no hay plan definido" texto="Las alertas aparecen cuando tu asesor define los entregables con sus fechas límite.">
          {botonPlan('Ver plan de entregables')}
        </EmptyState>
      </div>
    );
  }

  const { vencidos, proximos, aprobados, pendientes } = alertasDe(datos, trabajo.codigo);
  const trato = trabajo.asesor.trato;

  const head = (
    <PageHead
      migas="Entregables · Alertas"
      titulo="Alertas de vencimiento"
      descripcion={`Al ${hoy} · ${vencidos.length} ${vencidos.length === 1 ? 'vencido' : 'vencidos'} y ${proximos.length} ${proximos.length === 1 ? 'próximo' : 'próximos'} a vencer en los siguientes ${DIAS_ALERTA} días`}
      acciones={botonPlan('Ver plan completo')}
    />
  );

  // Estado 4.4 "Todo al día": no hay vencidos ni próximos.
  if (vencidos.length === 0 && proximos.length === 0) {
    return layout(
      <>
        {head}
        <div className="card hu4-vacio">
          <EmptyState titulo="Todo al día" texto={`No tienes entregables vencidos ni próximos a vencer en los siguientes ${DIAS_ALERTA} días.`}>
            {botonPlan('Ver plan de entregables')}
          </EmptyState>
        </div>
      </>
    );
  }

  const confirmarAvance = (valores) => {
    registrarAvance(modal.item.id, valores);
    mostrar({ tipo: 'exito', titulo: 'Avance registrado', mensaje: `${modal.item.nombre} pasó a revisión de ${trato}.` });
    setModal(null);
  };

  const confirmarAmpliacion = (valores) => {
    solicitarAmpliacion(modal.item.id, valores);
    mostrar({ tipo: 'exito', titulo: 'Solicitud enviada', mensaje: `${capitalizar(trato)} verá tu pedido de ampliación.` });
    setModal(null);
  };

  const subtitulo = (e) => `${trabajo.titulo} · peso ${e.peso}`;

  return layout(
    <>
      {head}

      {vencidos.length > 0 && (
        <section className="hu4-grupo hu4-grupo--danger">
          <header className="hu4-grupo__head">
            <h2>Vencidos sin presentar</h2>
            <span className="hu4-grupo__conteo">{plural(vencidos.length, 'entregable')}</span>
          </header>
          {vencidos.map((e) => (
            <div key={e.id} className="hu4-alerta-fila">
              <PuntoEstado estado={e.estado} />
              <div className="hu4-alerta-fila__texto">
                <h3>{e.orden}. {e.nombre}</h3>
                <p className="text-muted">{subtitulo(e)}</p>
                <p className="hu4-tono--danger">
                  Vencía el {formatearFecha(e.fechaLimite)} · {textoDias(-e.diasParaVencer)} de retraso · sin avances registrados
                </p>
                {e.ampliacionPendiente && (
                  <p className="text-aux text-muted">Ampliación solicitada hasta el {formatearFecha(e.ampliacionPendiente.nuevaFecha)} · esperando respuesta.</p>
                )}
              </div>
              <div className="hu4-alerta-fila__acciones">
                {!e.ampliacionPendiente && (
                  <button className="btn btn--danger-outline" onClick={() => setModal({ tipo: 'ampliacion', item: e })}>Solicitar ampliación</button>
                )}
                <button className="btn btn--danger" onClick={() => setModal({ tipo: 'avance', item: e })}>Registrar avance</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {proximos.length > 0 && (
        <section className="hu4-grupo hu4-grupo--warning">
          <header className="hu4-grupo__head">
            <h2>Próximos a vencer · siguientes {DIAS_ALERTA} días</h2>
            <span className="hu4-grupo__conteo">{plural(proximos.length, proximos.every((p) => p.tipo === 'requisito') ? 'requisito' : 'entregable')}</span>
          </header>
          {proximos.map((p) =>
            p.tipo === 'requisito' ? (
              <div key={p.id} className="hu4-alerta-fila">
                <PuntoEstado estado="observado" />
                <div className="hu4-alerta-fila__texto">
                  <h3>{p.nombre}</h3>
                  <p className="text-muted">{p.detalle}</p>
                  <p className="hu4-tono--warning">Vence el {formatearFecha(p.fechaLimite)} · faltan {textoDias(p.diasParaVencer)}</p>
                </div>
                <div className="hu4-alerta-fila__acciones">
                  <button className="btn btn--outline" onClick={() => setModal({ tipo: 'requisitos', item: p })}>Ver requisitos</button>
                </div>
              </div>
            ) : (
              <div key={p.id} className="hu4-alerta-fila">
                <PuntoEstado estado={p.estado} />
                <div className="hu4-alerta-fila__texto">
                  <h3>{p.orden}. {p.nombre}</h3>
                  <p className="text-muted">{subtitulo(p)}</p>
                  <p className="hu4-tono--warning">
                    Vence el {formatearFecha(p.fechaLimite)} · {p.diasParaVencer === 0 ? 'vence hoy' : `faltan ${textoDias(p.diasParaVencer)}`}
                    {p.bloqueado && ` · se habilita al aprobar el entregable ${p.orden - 1}`}
                  </p>
                </div>
                <div className="hu4-alerta-fila__acciones">
                  <button className="btn btn--outline" disabled={!p.puedeRegistrar} onClick={() => setModal({ tipo: 'avance', item: p })}>
                    Registrar avance
                  </button>
                </div>
              </div>
            )
          )}
        </section>
      )}

      <section className="card hu4-resumen">
        <span className="empty-state__icon" aria-hidden="true">✓</span>
        <div className="hu4-resumen__texto">
          <h2>{aprobados.length > 0 ? 'Sin alertas para los entregables ya aprobados' : 'Aún no hay entregables aprobados'}</h2>
          {aprobados.length > 0 && (
            <p className="text-muted">
              {unirConY(aprobados.map((e) => e.nombre))} {aprobados.length === 1 ? 'está aprobado y no genera' : 'están aprobados y no generan'} avisos.
            </p>
          )}
        </div>
        <dl className="hu4-resumen__cifras">
          <div><dt className="text-label">Aprobados</dt><dd className="hu4-tono--success">{aprobados.length}</dd></div>
          <div><dt className="text-label">Vencidos</dt><dd className="hu4-tono--danger">{vencidos.length}</dd></div>
          <div><dt className="text-label">Pendientes</dt><dd>{pendientes.length}</dd></div>
        </dl>
      </section>

      {modal?.tipo === 'avance' && (
        <ModalRegistrarAvance entregable={modal.item} trato={trato} onConfirmar={confirmarAvance} onCerrar={() => setModal(null)} />
      )}
      {modal?.tipo === 'ampliacion' && (
        <ModalSolicitarAmpliacion entregable={modal.item} trato={trato} onConfirmar={confirmarAmpliacion} onCerrar={() => setModal(null)} />
      )}
      {modal?.tipo === 'requisitos' && <ModalRequisitos requisito={modal.item} onCerrar={() => setModal(null)} />}
    </>
  );
}

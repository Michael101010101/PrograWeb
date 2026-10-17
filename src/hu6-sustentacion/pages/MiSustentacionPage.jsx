import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import {
  buscarSala,
  estaPendiente,
  notaFinal,
  sustentacionDeTrabajo,
  trabajoDeEstudiante,
} from '../services/sustentacionesService.js';
import { VENTANA } from '../data/datosSemilla.js';
import { HOY, diaSemana, diasEntre, formatearCorta, formatearFecha, restarDiasHabiles } from '../utils/fechas.js';
import { SlotTrabajo } from '../components/SlotsCabecera.jsx';
import ListaJurado from '../components/ListaJurado.jsx';
import TablaCalificacion from '../components/TablaCalificacion.jsx';
import ModalRequisitos from '../components/modales/ModalRequisitos.jsx';
import '../styles/hu6.css';

/** 6.4 Mi sustentación · rol Estudiante (diapositivas 44, 45 y 47). */
export default function MiSustentacionPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const { datos } = useSustentaciones();
  const [verRequisitos, setVerRequisitos] = useState(false);

  const trabajo = trabajoDeEstudiante(datos, usuario.id);
  const sustentacion = trabajo ? sustentacionDeTrabajo(datos, trabajo.codigo) : null;

  // ─── Estado vacío: todavía sin fecha (diapositiva 47) ───
  if (!sustentacion) {
    return (
      <PageLayout
        headerSlot={trabajo && <SlotTrabajo titulo={trabajo.titulo} avance={100} />}
        navInfo="Etapa 5 de 5 · sustentaciones"
        footerDetalle={trabajo ? trabajo.codigo : 'sin sustentación programada'}
      >
        <PageHead migas="Mi trabajo · Mi sustentación" titulo="Mi sustentación" />
        <div className="card" style={{ maxWidth: 620, margin: '0 auto', borderStyle: 'dashed' }}>
          <EmptyState
            icono="▤"
            titulo="Aún no tienes fecha de sustentación"
            texto={`La coordinación programa las sustentaciones de los trabajos concluidos entre el ${formatearCorta(VENTANA.inicio)} y el ${formatearFecha(VENTANA.fin)}. Te avisaremos por correo con la fecha, hora, sala y jurado.`}
          >
            <button className="btn btn--outline" onClick={() => setVerRequisitos(true)}>Ver requisitos de sustentación</button>
          </EmptyState>
        </div>
        {verRequisitos && <ModalRequisitos onCerrar={() => setVerRequisitos(false)} />}
      </PageLayout>
    );
  }

  const pendiente = estaPendiente(sustentacion);
  const sala = buscarSala(sustentacion.salaId);
  const { acta } = sustentacion;

  // Columna derecha común: equipo y asesor
  const equipoYAsesor = (
    <section className="card">
      <p className="text-label">Equipo y asesor</p>
      <ul className="hu6-lista-datos">
        {trabajo.equipo.map((i) => (
          <li key={i.nombre}><span>{i.corto} · {i.responsable ? 'responsable' : 'integrante'}</span></li>
        ))}
      </ul>
      <p className="hu6-pie-enlace">{trabajo.asesor} · asesor</p>
    </section>
  );

  // ─── Programada o reprogramada (diapositiva 44) ───
  if (pendiente) {
    const faltan = diasEntre(HOY, sustentacion.fecha);
    const limiteImpreso = restarDiasHabiles(sustentacion.fecha, 5);
    const reprogramada = sustentacion.estado === 'reprogramada';

    return (
      <PageLayout
        headerSlot={<SlotTrabajo titulo={trabajo.titulo} avance={100} />}
        navInfo="Etapa 5 de 5 · sustentaciones"
        footerDetalle={trabajo.codigo}
      >
        <PageHead
          migas="Mi trabajo · Mi sustentación"
          titulo="Mi sustentación"
          descripcion={`${reprogramada ? 'Reprogramada' : 'Programada'} por la coordinación el ${formatearFecha(reprogramada ? sustentacion.historial.at(-1).el : sustentacion.programadaEl)} · faltan ${faltan} días`}
        />

        <div className="hu6-layout">
          <div className="hu6-columna">
            <section className="hu6-destacado">
              <div className="hu6-destacado__head">
                <span className={`badge ${reprogramada ? 'badge--warning' : 'badge--info'} hu6-chip-blanco`}>
                  {reprogramada ? 'Reprogramada' : 'Programada'}
                </span>
                <span>Modalidad {sustentacion.modalidad.toLowerCase()}</span>
              </div>
              <div className="hu6-tres">
                <div>
                  <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Fecha</p>
                  <p className="hu6-grande">{formatearFecha(sustentacion.fecha)}</p>
                  <p>{diaSemana(sustentacion.fecha)}</p>
                </div>
                <div>
                  <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Hora</p>
                  <p className="hu6-grande">{sustentacion.hora}</p>
                  <p>Duración estimada 60 min</p>
                </div>
                <div>
                  <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Sala</p>
                  <p className="hu6-grande">{sala ? sala.id : 'Virtual'}</p>
                  <p>{sala ? sala.ubicacion : 'El enlace llegará por correo'}</p>
                </div>
              </div>
            </section>

            <section className="card" style={{ minHeight: 300 }}>
              <h2>Requisitos antes de la fecha</h2>
              <ul className="hu6-requisitos">
                <li>
                  <span className="hu6-check hu6-check--hecho">✓</span>
                  <div><p>Informe final aprobado</p><p className="text-muted text-aux">Aprobado por el asesor el {formatearFecha(trabajo.informeAprobadoEl)}</p></div>
                </li>
                <li>
                  <span className="hu6-check hu6-check--pendiente" />
                  <div>
                    <p>Entrega del informe impreso</p>
                    <p className="text-aux" style={{ color: 'var(--warning-text)' }}>En la oficina TFC hasta el {formatearFecha(limiteImpreso)} (5 días hábiles antes)</p>
                  </div>
                </li>
                <li>
                  <span className="hu6-check hu6-check--pendiente" />
                  <div><p>Constancia de no adeudo</p><p className="text-muted text-aux">Se solicita en Tesorería y se adjunta al expediente</p></div>
                </li>
              </ul>
            </section>
          </div>

          <aside className="hu6-columna">
            <section className="card">
              <p className="text-label">Jurado designado</p>
              {sustentacion.jurado.length === 3 ? (
                <ListaJurado datos={datos} jurado={sustentacion.jurado} conDepartamento />
              ) : (
                <p className="text-muted" style={{ marginTop: 10 }}>La coordinación está conformando tu jurado. Te avisaremos por correo.</p>
              )}
            </section>
            {equipoYAsesor}
            <section className="card card--subtle">
              <p className="text-label">Cambios de fecha</p>
              <p className="text-muted text-aux" style={{ marginTop: 6 }}>
                Solo la coordinación puede reprogramar. Si tienes un impedimento, escribe a tfc@ulima.edu.pe con al menos 5
                días de anticipación.
              </p>
            </section>
          </aside>
        </div>
      </PageLayout>
    );
  }

  // ─── Realizada o desaprobada, con resultado (diapositiva 45) ───
  const aprobado = sustentacion.estado === 'realizada';
  const final = notaFinal(acta.notas);

  return (
    <PageLayout
      headerSlot={<SlotTrabajo titulo={trabajo.titulo} chip={aprobado ? 'Sustentado' : 'Desaprobado'} />}
      navInfo="Proceso cerrado"
      footerDetalle={`${trabajo.codigo} ${aprobado ? 'sustentado' : 'desaprobado'}`}
    >
      <PageHead
        migas="Mi trabajo · Mi sustentación"
        titulo="Mi sustentación"
        descripcion={`Realizada el ${formatearFecha(sustentacion.fecha)} · acta registrada por la coordinación el ${formatearFecha(acta.registradaEl)} a las ${acta.registradaHora}`}
      />

      <div className="hu6-layout">
        <div className="hu6-columna">
          <section
            className="hu6-destacado hu6-resultado"
            style={aprobado ? undefined : { background: 'var(--danger-soft)', borderColor: 'var(--danger)' }}
          >
            <div>
              <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Resultado del jurado</p>
              <p className="hu6-grande" style={{ fontSize: 44, lineHeight: '52px' }}>{acta.resultado}</p>
              <p>{formatearFecha(sustentacion.fecha)} · {sala ? `Sala ${sala.id}` : 'Virtual'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Nota final</p>
              <p className={`hu6-resultado__nota ${aprobado ? '' : 'hu6-resultado__nota--mal'}`}>{final}</p>
            </div>
          </section>

          <section className="card" style={{ minHeight: 300 }}>
            <h2>Detalle de la calificación</h2>
            <TablaCalificacion notas={acta.notas} />
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 16 }}>
              <p className="text-label">Observaciones del jurado</p>
              <blockquote className="hu6-cita">{acta.observaciones || 'Sin observaciones.'}</blockquote>
            </div>
          </section>
        </div>

        <aside className="hu6-columna">
          <section className="card">
            <p className="text-label">Documentos</p>
            <div className="hu6-documentos">
              <button className="btn btn--primary btn--lg" onClick={() => navigate(`/sustentaciones/${sustentacion.id}/impresion`)}>
                Descargar acta firmada (PDF)
              </button>
              <button
                className="btn btn--outline btn--lg"
                onClick={() => mostrar({ tipo: 'aviso', titulo: 'Informe final', mensaje: 'Lo encuentras en tu plan de entregables (HU-4).' })}
              >
                Descargar informe final
              </button>
              <button className="btn hu6-btn-neutro btn--lg" onClick={() => navigate('/estudiante/mi-trabajo')}>Ver mi trabajo</button>
            </div>
          </section>

          <section className="card">
            <p className="text-label">Jurado</p>
            <ListaJurado datos={datos} jurado={sustentacion.jurado} />
          </section>

          <section className={`card ${aprobado ? 'card--soft' : 'card--warning'}`}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Siguiente paso</p>
            <p className="text-aux">
              {aprobado
                ? 'Con el acta aprobada puedes iniciar el trámite de bachillerato en la Secretaría Académica.'
                : 'Coordina con tu asesor las correcciones. La coordinación te informará cómo volver a sustentar.'}
            </p>
          </section>
        </aside>
      </div>
    </PageLayout>
  );
}

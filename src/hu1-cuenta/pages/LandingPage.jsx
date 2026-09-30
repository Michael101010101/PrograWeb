import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import { obtenerAsesoresDestacados } from '../../shared/integraciones.js';

const ETAPAS = [
  'Registro del trabajo y del equipo',
  'Solicitud y asignación de asesor',
  'Plan de entregables',
  'Revisión de avances',
  'Sustentación y acta',
];
const ESTADO_ETAPA = ['cerrada', 'cerrada', 'en_curso', 'pendiente', 'pendiente'];
const ETIQUETA_CRONO = { cerrada: 'Cerrada', en_curso: 'En curso', pendiente: '' };

export default function LandingPage() {
  const asesores = obtenerAsesoresDestacados();
  return (
    <PageLayout navInfo={`Semestre ${PERIODO.semestre} · etapa 3 de 5 en curso`}>
      <section className="hero">
        <div>
          <p className="text-label text-accent">Registro de propuestas abierto hasta el 28/08/2026</p>
          <h1>Del registro de la propuesta hasta la sustentación, en un solo lugar</h1>
          <p style={{ maxWidth: 560, marginBottom: 20 }}>
            Registra tu trabajo, solicita asesor entre quienes tienen cupo disponible, entrega tus avances y sigue la
            retroalimentación con fechas límite claras.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/registro/estudiante" className="btn btn--primary btn--lg">Registrar mi trabajo</Link>
            <Link to="/asesores" className="btn btn--outline btn--lg">Ver directorio de asesores</Link>
          </div>
        </div>
        <div className="card">
          <p className="text-label" style={{ marginBottom: 12 }}>El proceso en 5 etapas</p>
          <ol className="etapas">
            {ETAPAS.map((etapa, i) => {
              const estado = ESTADO_ETAPA[i];
              return (
                <li key={etapa} className={estado === 'pendiente' ? 'is-pendiente' : ''}>
                  <span className={`etapas__punto ${estado === 'en_curso' ? 'etapas__punto--curso' : ''} ${estado === 'pendiente' ? 'etapas__punto--pendiente' : ''}`} aria-hidden="true" />
                  <span style={{ fontWeight: estado === 'en_curso' ? 600 : 400 }}>
                    {etapa}{estado === 'en_curso' && ' · etapa en curso'}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="layout-aside" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)' }}>
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <h2>Asesores con cupo disponible</h2>
              <p className="text-muted text-aux">Actualizado al 06/09/2026</p>
            </div>
            <Link to="/asesores">Ver el directorio completo</Link>
          </div>
          <div className="asesores-grid">
            {asesores.map((a) => (
              <article key={a.id} className="card" style={{ padding: 14, marginTop: 0 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <span className="avatar avatar--soft" aria-hidden="true">{a.iniciales}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, lineHeight: '18px' }}>{a.nombre}</p>
                    <p className="text-muted text-aux">{a.departamento}</p>
                  </div>
                </div>
                <span className="badge badge--estudiante">{a.linea}</span>
                <p style={{ fontSize: 13, marginTop: 10 }}>
                  Cupo <strong style={{ color: 'var(--success)' }}>{a.cupo}</strong>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 style={{ marginBottom: 14 }}>Cronograma {PERIODO.semestre}</h2>
          <ol className="cronograma">
            {PERIODO.cronograma.map((c) => (
              <li key={c.etapa} className={`is-${c.estado}`}>
                <p className="text-label" style={{ color: c.estado === 'en_curso' ? 'var(--accent)' : undefined }}>
                  Etapa {c.etapa}{ETIQUETA_CRONO[c.estado] && ` · ${ETIQUETA_CRONO[c.estado]}`}
                </p>
                <p style={{ fontSize: 14, color: c.estado === 'pendiente' ? 'var(--muted)' : undefined }}>
                  {c.nombre} · {c.rango}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </PageLayout>
  );
}

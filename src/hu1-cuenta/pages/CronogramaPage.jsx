import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import { PERIODO, CONTACTO } from '../../shared/config/periodo.js';

const ETIQUETA = {
  cerrada: ['success', 'Cerrada'],
  en_curso: ['warning', 'En curso'],
  pendiente: ['neutral', 'Próxima'],
};

export default function CronogramaPage() {
  return (
    <PageLayout navInfo={`Semestre ${PERIODO.semestre} · etapa 3 de 5 en curso`}>
      <PageHead
        migas="Inicio · Cronograma"
        titulo={`Cronograma ${PERIODO.semestre}`}
        descripcion="Fechas de cada etapa del proceso de trabajos de fin de carrera."
      />

      <div className="layout-aside">
        <section className="card">
          <ol className="cronograma">
            {PERIODO.cronograma.map((c) => {
              const [tono, texto] = ETIQUETA[c.estado];
              return (
                <li key={c.etapa} className={`is-${c.estado}`} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <p className="text-label">Etapa {c.etapa}</p>
                    <span className={`badge badge--${tono}`}>{texto}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-body)', color: c.estado === 'pendiente' ? 'var(--muted)' : undefined }}>
                    {c.nombre}
                  </h3>
                  <p className="text-muted">{c.rango}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="layout-aside__side">
          <div className="card card--warning">
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Fechas límite</p>
            <p style={{ fontSize: 14 }}>
              Fuera de cada etapa no se pueden registrar propuestas ni solicitar asesor. Los entregables siguen las
              fechas del plan que define tu asesor.
            </p>
          </div>
          <div className="card">
            <p className="text-label" style={{ marginBottom: 6 }}>Consultas</p>
            <p style={{ fontSize: 14 }}>
              Oficina de Trabajos de Fin de Carrera
              <br />
              <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a> · anexo {CONTACTO.anexo}
            </p>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
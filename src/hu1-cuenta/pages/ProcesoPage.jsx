import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import { useDatos } from '../../shared/context/DatosContext.jsx';

export default function ProcesoPage() {
  const { periodo, textoNav, cargando, error } = useDatos();
  return (
    <PageLayout navInfo={textoNav}>
      <PageHead
        migas="Inicio · El proceso"
        titulo={`El proceso en ${periodo.totalEtapas || 5} etapas`}
        descripcion="Del registro de la propuesta hasta la sustentación. Cada etapa tiene fechas definidas en el cronograma del semestre."
        acciones={<Link to="/cronograma" className="btn btn--outline">Ver cronograma</Link>}
      />
      <ol className="stack" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 16 }}>
        {cargando && <p className="text-muted">Cargando etapas…</p>}
        {error && <p className="text-muted">No se pudieron cargar las etapas: {error}</p>}
        {periodo.etapas.map((e) => {
          const crono = e;
          return (
            <li key={e.numero} className="card" style={{ marginTop: 0, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <span className="avatar avatar--soft" aria-hidden="true">{e.numero}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <h2>{e.titulo}</h2>
                  {crono.estado === 'en_curso' && <span className="badge badge--warning">En curso</span>}
                  {crono.estado === 'cerrada' && <span className="badge badge--success">Cerrada</span>}
                </div>
                <p className="text-muted text-aux" style={{ marginBottom: 8 }}>{e.responsable} · {crono.rango}</p>
                <p>{e.descripcion}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="card card--soft" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <p>¿Listo para empezar? Crea tu cuenta con tu correo institucional.</p>
        <Link to="/registro/estudiante" className="btn btn--primary">Registrar mi trabajo</Link>
      </div>
    </PageLayout>
  );
}

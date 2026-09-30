import PageLayout from './PageLayout.jsx';
import EmptyState from './EmptyState.jsx';

/** Marcador para vistas de otras historias mientras se integran sus ramas. */
export default function EnConstruccion({ titulo, historia }) {
  return (
    <PageLayout centrado>
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState icono="…" titulo={titulo} texto={`Esta vista corresponde a la ${historia} y se integrará desde su rama.`} />
      </div>
    </PageLayout>
  );
}

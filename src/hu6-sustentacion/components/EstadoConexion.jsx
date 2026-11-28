import PageLayout from '../../shared/components/PageLayout.jsx';
import Alert from '../../shared/components/Alert.jsx';

export default function EstadoConexion({ cargando, error }) {
  return (
    <PageLayout footerDetalle="HU-6 · PostgreSQL">
      <div className="card" style={{ maxWidth: 630, margin: '28px auto', padding: 24 }}>
        {cargando ? <p>Consultando sustentaciones en PostgreSQL…</p> : <Alert tipo="error">{error} Verifica que PostgreSQL y el backend estén funcionando.</Alert>}
      </div>
    </PageLayout>
  );
}

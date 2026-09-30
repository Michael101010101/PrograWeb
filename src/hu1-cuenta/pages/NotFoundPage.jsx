import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { INICIO_POR_ROL } from '../../shared/config/roles.js';

export default function NotFoundPage() {
  const { usuario } = useAuth();
  return (
    <PageLayout centrado>
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState
          icono="404"
          titulo="No encontramos esta página"
          texto="El enlace puede haber cambiado o el trabajo ya no está disponible."
        >
          <Link to={usuario ? INICIO_POR_ROL[usuario.rol] : '/'} className="btn btn--primary">Ir al inicio</Link>
          <Link to={usuario?.rol === 'estudiante' ? '/estudiante/asesores' : '/asesores'} className="btn btn--outline">Ver asesores</Link>
        </EmptyState>
      </div>
    </PageLayout>
  );
}

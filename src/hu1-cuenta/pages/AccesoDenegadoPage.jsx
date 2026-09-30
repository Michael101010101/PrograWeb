import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { INICIO_POR_ROL, ROL_INFO } from '../../shared/config/roles.js';
import { CONTACTO } from '../../shared/config/periodo.js';

/** Se muestra cuando una sesión intenta entrar a una ruta de otro rol (1.7). */
export default function AccesoDenegadoPage({ rutaSolicitada, rolesRequeridos = [] }) {
  const { usuario } = useAuth();
  const requerido = rolesRequeridos.map((r) => ROL_INFO[r].label).join(' o ');
  const actual = ROL_INFO[usuario.rol].label;
  const identificador = usuario.rol === 'estudiante' ? 'tu código de alumno' : 'tu correo institucional';
  const asunto = encodeURIComponent(`Acceso a ${rutaSolicitada}`);

  return (
    <PageLayout centrado>
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <EmptyState
          icono="⊘"
          tono="danger"
          titulo="Acceso denegado"
          texto={`Esta sección es exclusiva del rol ${requerido}. Tu sesión tiene rol ${actual}. Si crees que deberías tener acceso, escribe a ${CONTACTO.correo} indicando ${identificador}.`}
        >
          <div className="alert alert--info" style={{ width: '100%', justifyContent: 'center' }}>
            <span>
              Ruta solicitada <strong>{rutaSolicitada}</strong> · rol requerido <strong>{requerido}</strong> · rol actual <strong>{actual}</strong>
            </span>
          </div>
        </EmptyState>
        <div className="empty-state__actions" style={{ marginTop: 0 }}>
          <Link to={INICIO_POR_ROL[usuario.rol]} className="btn btn--primary">Volver a mi inicio</Link>
          <a href={`mailto:${CONTACTO.correo}?subject=${asunto}`} className="btn btn--outline">Escribir a la coordinación</a>
        </div>
      </div>
    </PageLayout>
  );
}

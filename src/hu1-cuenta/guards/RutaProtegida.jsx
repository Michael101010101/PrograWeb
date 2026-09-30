import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AccesoDenegadoPage from '../pages/AccesoDenegadoPage.jsx';

/**
 * Protege un grupo de rutas.
 *  - Sin sesión → /login (recordando la ruta pedida para volver después).
 *  - Con sesión pero rol no permitido → vista de acceso denegado en la misma URL.
 * Uso en el router: <Route element={<RutaProtegida roles={['coordinador']} />}> … </Route>
 */
export default function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <div className="page-content" aria-busy="true" />;

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <AccesoDenegadoPage rutaSolicitada={location.pathname} rolesRequeridos={roles} />;
  }

  return <Outlet />;
}

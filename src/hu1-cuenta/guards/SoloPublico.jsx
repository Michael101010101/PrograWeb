import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { INICIO_POR_ROL } from '../../shared/config/roles.js';

/** Login, registro y recuperación: si ya hay sesión, se envía a la vista principal del rol. */
export default function SoloPublico() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="page-content" aria-busy="true" />;
  if (usuario) return <Navigate to={INICIO_POR_ROL[usuario.rol]} replace />;
  return <Outlet />;
}

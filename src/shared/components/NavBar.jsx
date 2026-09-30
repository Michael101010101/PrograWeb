import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { useToast } from './ToastProvider.jsx';
import { NAV_POR_ROL } from '../config/navegacion.js';
import { PERIODO } from '../config/periodo.js';

/**
 * Barra de navegación (56 px) propia de cada rol.
 * `extra`: ítem adicional para vistas públicas sueltas (Iniciar sesión, Crear cuenta…).
 * `info`: texto de la derecha; por defecto el semestre o la etapa en curso.
 */
export default function NavBar({ extra, info }) {
  const { usuario, cerrarSesion } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const rol = usuario?.rol ?? 'publico';
  const items = extra ? [...NAV_POR_ROL[rol], extra] : NAV_POR_ROL[rol];

  const salir = () => {
    cerrarSesion();
    mostrar({ tipo: 'exito', titulo: 'Sesión cerrada', mensaje: 'Vuelve cuando quieras con tu correo institucional.' });
    navigate('/login', { replace: true });
  };

  return (
    <nav className="app-nav" aria-label="Navegación principal">
      <div className="app-nav__inner">
        <ul className="app-nav__links">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className="app-nav__link">
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="app-nav__right">
          <span>{info ?? `Semestre ${PERIODO.semestre}`}</span>
          {usuario && (
            <button type="button" className="app-nav__logout" onClick={salir}>Cerrar sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}

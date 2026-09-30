import { Link } from 'react-router-dom';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { INICIO_POR_ROL, ROL_INFO } from '../config/roles.js';
import { iniciales, nombreCorto } from '../utils/formato.js';
import RoleBadge from './RoleBadge.jsx';

/**
 * Cabecera (72 px): marca + zona contextual + rol y usuario.
 * `slot` permite a cada historia mostrar su dato contextual
 * (trabajo activo del estudiante, cupo del asesor, periodo del administrador…).
 * `accionesPublicas` reemplaza los botones del visitante cuando la vista lo necesita.
 */
export default function Header({ slot, accionesPublicas }) {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'coordinador';

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to={usuario ? INICIO_POR_ROL[usuario.rol] : '/'} className="brand">
          <span className="brand__logo" aria-hidden="true">Tf</span>
          <span>
            <span className="brand__title">Trabajos de Fin de Carrera{esAdmin ? ' · Administración' : ''}</span>
            <br />
            <span className="brand__subtitle">Universidad de Lima · Facultad de Ingeniería</span>
          </span>
        </Link>

        {slot && <div className="app-header__slot">{slot}</div>}

        {usuario ? (
          <div className="app-header__user">
            <RoleBadge rol={usuario.rol} />
            <span className="avatar" aria-hidden="true">{iniciales(usuario.nombres, usuario.apellidos)}</span>
            <span className="app-header__user-text">
              <span className="app-header__user-name">{nombreCorto(usuario)}</span>
              <br />
              <span className="app-header__user-meta">{metaUsuario(usuario)}</span>
            </span>
          </div>
        ) : (
          <div className="app-header__user">
            <RoleBadge rol="publico" />
            {accionesPublicas ?? (
              <>
                <Link to="/login" className="btn btn--outline">Iniciar sesión</Link>
                <Link to="/registro/estudiante" className="btn btn--primary">Crear cuenta</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function metaUsuario(u) {
  if (u.rol === 'estudiante') return `${u.codigoAlumno} · ${abreviarCarrera(u.carrera)}`;
  if (u.rol === 'asesor') return `Dpto. ${abreviarCarrera(u.departamento)}`;
  return u.cargo ?? ROL_INFO[u.rol].detalle;
}

function abreviarCarrera(texto = '') {
  return texto.replace('Ingeniería', 'Ing.');
}

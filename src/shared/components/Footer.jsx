import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { CONTACTO } from '../config/periodo.js';
import { ROL_INFO } from '../config/roles.js';
import { fechaHora, nombreCompleto } from '../utils/formato.js';

/** Footer (84 px): sesión, rol y datos institucionales. `detalle` añade contexto de la vista. */
export default function Footer({ detalle }) {
  const { usuario, ingresoAnterior } = useAuth();

  const izquierda = usuario
    ? [
        `Sesión iniciada como ${nombreCompleto(usuario)}`,
        `rol ${ROL_INFO[usuario.rol].label}`,
        detalle ?? (ingresoAnterior ? `último ingreso ${fechaHora(ingresoAnterior)}` : null),
      ].filter(Boolean).join(' · ')
    : detalle ?? `Universidad de Lima · Facultad de Ingeniería · Oficina de Trabajos de Fin de Carrera · ${CONTACTO.direccion}`;

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <span>{izquierda}</span>
        <div className="app-footer__links">
          <a href="#reglamento">Reglamento TFC</a>
          <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a>
          {!usuario && <span style={{ color: 'var(--primary-dark)' }}>Anexo {CONTACTO.anexo}</span>}
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

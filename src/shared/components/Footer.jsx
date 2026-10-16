import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { CONTACTO } from '../config/periodo.js';
import { ROL_INFO } from '../config/roles.js';
import { fechaHora, nombreCompleto } from '../utils/formato.js';

/**
 * Footer (84 px): sesión, rol y datos institucionales. `detalle` añade contexto de la vista
 * (con sesión, `false` omite el último ingreso). `politicaDatos` cambia el correo por la política de datos.
 */
export default function Footer({ detalle, politicaDatos = false }) {
  const { usuario, ingresoAnterior } = useAuth();

  const izquierda = usuario
    ? [
        `Sesión iniciada como ${nombreCompleto(usuario)}`,
        `rol ${ROL_INFO[usuario.rol].label}`,
        detalle ?? (ingresoAnterior ? `último ingreso ${fechaHora(ingresoAnterior)}` : null),
      ].filter(Boolean).join(' · ')
    : detalle ?? `Universidad de Lima · Facultad de Ingeniería · Oficina de Trabajos de Fin de Carrera · ${CONTACTO.direccion}`;

  // El anexo solo aparece en el footer institucional por defecto (landing).
  const mostrarAnexo = !usuario && !detalle;

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <span>{izquierda}</span>
        <div className="app-footer__links">
          <a href="#reglamento">Reglamento TFC</a>
          {politicaDatos
            ? <a href="#politica-datos">Política de datos</a>
            : <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a>}
          {mostrarAnexo && <a href={`tel:${CONTACTO.anexo}`}>Anexo {CONTACTO.anexo}</a>}
          <span>{usuario ? '© 2026 Universidad de Lima' : '© 2026'}</span>
        </div>
      </div>
    </footer>
  );
}

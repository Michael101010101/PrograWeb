import { Link } from 'react-router-dom';

/**
 * El envío real de correos está fuera del alcance del proyecto.
 * Este recuadro muestra el enlace que "llegaría" al correo, solo para la demostración.
 */
export default function DemoLink({ to, texto = 'Abrir el enlace del correo' }) {
  if (!to) return null;
  return (
    <div className="demo-box">
      Modo demostración: no se envían correos reales.{' '}
      <Link to={to}>{texto}</Link>
    </div>
  );
}

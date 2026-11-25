import { Link } from 'react-router-dom';

/**
 * Solo en desarrollo: el servidor devuelve el enlace del correo (EXPONER_ENLACES=true)
 * y este recuadro lo muestra para probar sin un buzón real. En producción no aparece.
 */
export default function DemoLink({ to, texto = 'Abrir el enlace del correo' }) {
  if (!to) return null;
  return (
    <div className="demo-box">
      Modo desarrollo: enlace del correo.{' '}
      <Link to={to}>{texto}</Link>
    </div>
  );
}

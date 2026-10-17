import '../styles/hu3.css';
import { cupoDisponible } from '../services/asesoriasService.js';

// Dato del centro de la cabecera, según el rol (se pasa a PageLayout como headerSlot).

/** Rol Asesor: "Cupo disponible 3 de 6". */
export function SlotCupo({ asesor }) {
  if (!asesor) return null;
  return (
    <div className="hu3-slot hu3-slot--cupo">
      Cupo disponible <strong>{cupoDisponible(asesor)} de {asesor.cupoMaximo}</strong>
    </div>
  );
}

/** Rol Estudiante: título del trabajo + chip con el estado de la asesoría. */
export function SlotTrabajo({ trabajo, estado }) {
  if (!trabajo) return null;
  return (
    <div className="hu3-slot" title={trabajo.titulo}>
      <span className="hu3-slot__texto">{trabajo.titulo}</span>
      <span className="badge badge--neutral" style={{ background: 'var(--surface)' }}>{estado}</span>
    </div>
  );
}

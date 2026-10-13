import BarraAvance from './BarraAvance.jsx';

/** Dato del centro de la cabecera (rol Estudiante): título del trabajo + avance. Se pasa a PageLayout como headerSlot. */
export default function SlotTrabajo({ trabajo, avance }) {
  if (!trabajo) return null;
  return (
    <div className="hu4-slot" title={trabajo.titulo}>
      <span className="hu4-slot__titulo">{trabajo.titulo}</span>
      <span className="hu4-slot__barra"><BarraAvance valor={avance} alto={5} /></span>
      <strong>{avance}%</strong>
    </div>
  );
}

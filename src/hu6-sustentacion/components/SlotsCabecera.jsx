import '../styles/hu6.css';

// Dato del centro de la cabecera (se pasa a PageLayout como headerSlot).

/** Coordinación: caja gris con una etiqueta y un valor. Ej.: "Periodo 2026-2". */
export function SlotDato({ etiqueta, valor }) {
  return (
    <div className="hu6-slot">
      <span>{etiqueta}</span>
      <strong>{valor}</strong>
    </div>
  );
}

/** Estudiante: título del trabajo + barra de avance, o un chip (ej.: "Sustentado"). */
export function SlotTrabajo({ titulo, avance, chip }) {
  return (
    <div className="hu6-slot hu6-slot--trabajo" title={titulo}>
      <span className="hu6-slot__texto">{titulo}</span>
      {chip ? (
        <span className="badge badge--success hu6-chip-blanco">{chip}</span>
      ) : (
        <>
          <span className="hu6-slot__barra"><div style={{ width: `${avance}%` }} /></span>
          <strong>{avance}%</strong>
        </>
      )}
    </div>
  );
}

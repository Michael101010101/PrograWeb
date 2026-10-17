import BarraAvance from './BarraAvance.jsx';

/**
 * Recuadro "Suma de pesos del plan": verde si suma 100, ámbar si falta, rojo si se pasa.
 * `pesos` es la lista de números que se muestran sumados ("15 + 20 + 20 + 20 + 25").
 */
export default function BarraPesos({ suma, pesos }) {
  const exceso = suma - 100;
  let tono = 'ok';
  let detalle = 'el plan está balanceado';
  if (exceso > 0) {
    tono = 'error';
    detalle = `excede en ${exceso} puntos. Reduce el peso de otro entregable antes de guardar.`;
  } else if (exceso < 0) {
    tono = 'falta';
    detalle = `faltan ${-exceso} puntos para llegar a 100`;
  }

  return (
    <div className={`hu4-pesos hu4-pesos--${tono}`}>
      <p className="hu4-pesos__fila">
        <strong>Suma de pesos del plan</strong>
        <strong>{suma} de 100</strong>
      </p>
      <BarraAvance valor={suma} tono={tono === 'error' ? 'danger' : 'success'} alto={8} />
      <p className="hu4-pesos__detalle">
        {pesos.length > 0 ? `${pesos.join(' + ')} · ${detalle}` : detalle[0].toUpperCase() + detalle.slice(1)}
      </p>
    </div>
  );
}

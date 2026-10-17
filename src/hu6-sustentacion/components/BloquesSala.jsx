import { horaFin } from '../utils/fechas.js';

/**
 * Tarjeta "Sala A-402 · 11/12/2026": un bloque por hora (Ocupada / Libre / Seleccionada).
 * Al hacer clic en un bloque libre se elige esa hora (onElegir).
 */
export default function BloquesSala({ titulo, bloques, horaSeleccionada, onElegir }) {
  return (
    <section className="card">
      <p className="text-label">{titulo}</p>
      <div className="hu6-bloques">
        {bloques.map(({ hora, ocupante }) => {
          const rango = `${hora} – ${horaFin(hora)}`;
          if (hora === horaSeleccionada) {
            return (
              <div key={hora} className={`hu6-bloque ${ocupante ? 'hu6-bloque--ocupada' : 'hu6-bloque--seleccionada'}`}>
                <span>{rango}</span>
                <span>{ocupante ? 'Ocupada' : 'Seleccionada'}</span>
              </div>
            );
          }
          if (ocupante) {
            return (
              <div key={hora} className="hu6-bloque hu6-bloque--ocupada" title={ocupante}>
                <span>{rango}</span>
                <span>Ocupada</span>
              </div>
            );
          }
          return (
            <button key={hora} type="button" className="hu6-bloque hu6-bloque--libre" onClick={() => onElegir(hora)}>
              <span>{rango}</span>
              <span>Libre</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Barra de avance del trabajo (0 a 100). En 100% se pinta de verde éxito. */
export default function BarraProgreso({ valor }) {
  const completo = valor >= 100;
  return (
    <div className="hu3-progreso">
      <div className="hu3-progreso__barra" role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`hu3-progreso__relleno ${completo ? 'hu3-progreso__relleno--completo' : ''}`}
          style={{ width: `${valor}%` }}
        />
      </div>
      <span className={`hu3-progreso__valor ${completo ? 'hu3-progreso__valor--completo' : ''}`}>{valor}%</span>
    </div>
  );
}

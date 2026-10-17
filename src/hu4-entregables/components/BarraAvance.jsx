/** Barra horizontal de 0 a 100. `tono`: 'primary' | 'success' | 'danger'. */
export default function BarraAvance({ valor, tono = 'primary', alto = 8 }) {
  const ancho = Math.min(100, Math.max(0, valor));
  return (
    <div className="hu4-barra" style={{ height: alto }} role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={100}>
      <div className={`hu4-barra__relleno hu4-barra__relleno--${tono}`} style={{ width: `${ancho}%` }} />
    </div>
  );
}

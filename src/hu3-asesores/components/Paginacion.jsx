/**
 * Paginación: "Mostrando 1–6 de 14" + Anterior · 1 · 2 · 3 · Siguiente.
 * La página actual vive en el componente padre (useState) y se cambia con onCambiar.
 */
export default function Paginacion({ pagina, porPagina, total, onCambiar }) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, total);
  // [1, 2, 3, …] para dibujar un botón por página
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="hu3-paginacion">
      <span>Mostrando {desde}–{hasta} de {total}</span>
      <div className="hu3-paginacion__botones">
        <button className="hu3-paginacion__btn" disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>
          Anterior
        </button>
        {paginas.map((numero) => (
          <button
            key={numero}
            className={`hu3-paginacion__btn ${numero === pagina ? 'hu3-paginacion__btn--activo' : ''}`}
            aria-current={numero === pagina ? 'page' : undefined}
            onClick={() => onCambiar(numero)}
          >
            {numero}
          </button>
        ))}
        <button className="hu3-paginacion__btn" disabled={pagina === totalPaginas} onClick={() => onCambiar(pagina + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

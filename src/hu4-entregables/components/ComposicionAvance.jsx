/** Tarjeta "Composición del avance": cuánto aporta cada entregable al porcentaje. */
export default function ComposicionAvance({ items, avance }) {
  return (
    <section className="card hu4-composicion">
      <h2 className="text-label">Composición del avance</h2>
      <ul>
        {items.map((e) => {
          const aprobado = e.estado === 'aprobado';
          let valor = `0 de ${e.peso}`;
          if (!e.obligatorio) valor = 'opcional';
          else if (aprobado) valor = `+${e.peso}`;
          return (
            <li key={e.id} className={aprobado ? 'is-aprobado' : ''}>
              <span>{e.orden}. {e.nombre}</span>
              <span>{valor}</span>
            </li>
          );
        })}
      </ul>
      <p className="hu4-composicion__total">
        <span>Total</span>
        <span>{avance} de 100</span>
      </p>
    </section>
  );
}

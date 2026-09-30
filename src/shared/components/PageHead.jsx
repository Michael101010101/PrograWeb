export default function PageHead({ migas, titulo, descripcion, acciones }) {
  return (
    <div className="page-head">
      <div>
        {migas && <p className="page-head__crumbs">{migas}</p>}
        <h1>{titulo}</h1>
        {descripcion && <p className="page-head__desc">{descripcion}</p>}
      </div>
      {acciones && <div className="page-head__actions">{acciones}</div>}
    </div>
  );
}

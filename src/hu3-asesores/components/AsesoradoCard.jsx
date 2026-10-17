import { Link } from 'react-router-dom';
import BarraProgreso from './BarraProgreso.jsx';

const ESTADOS = {
  propuesta: { clase: 'badge--neutral', texto: 'Propuesta' },
  en_desarrollo: { clase: 'badge--info', texto: 'En desarrollo' },
  concluido: { clase: 'badge--success', texto: 'Concluido' },
};

/** Tarjeta de un trabajo a cargo del asesor (3.5 Mis asesorados). */
export default function AsesoradoCard({ trabajo, onTerminar, onVerSustentacion }) {
  const estado = ESTADOS[trabajo.estado];
  const concluido = trabajo.estado === 'concluido';

  return (
    <article className="card hu3-asesorado">
      <div className="hu3-asesorado__badges">
        <span className={`badge ${estado.clase}`}>{estado.texto}</span>
        {trabajo.porRevisar > 0 ? (
          <span className="badge badge--warning">{trabajo.porRevisar} por revisar</span>
        ) : (
          <span className="badge badge--neutral">Sin pendientes</span>
        )}
      </div>

      <h2 className="hu3-asesorado__titulo">{trabajo.titulo}</h2>
      <p className="hu3-asesorado__equipo">{trabajo.integrantes.map((i) => i.nombre).join(', ')}</p>

      <BarraProgreso valor={trabajo.avance} />
      {trabajo.nota && <p className={`hu3-asesorado__nota hu3-tono--${trabajo.nota.tono}`}>{trabajo.nota.texto}</p>}

      <div className="hu3-asesorado__acciones">
        <Link to={`/asesor/asesorados/${trabajo.codigo}`} className="btn btn--primary">Ver trabajo</Link>
        {concluido ? (
          <button className="btn hu3-btn-neutro" onClick={() => onVerSustentacion(trabajo)}>Ver sustentación</button>
        ) : (
          <button className="btn hu3-btn-terminar" onClick={() => onTerminar(trabajo)}>Terminar asesoría</button>
        )}
      </div>
    </article>
  );
}

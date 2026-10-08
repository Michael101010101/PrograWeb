import { CRITERIOS } from '../data/datosSemilla.js';

/** Tabla de notas por criterio (solo lectura): Criterio · Peso · Nota. */
export default function TablaCalificacion({ notas }) {
  return (
    <table className="hu6-tabla-simple">
      <thead>
        <tr>
          <th style={{ width: '55%' }}>Criterio</th>
          <th style={{ width: '22%' }}>Peso</th>
          <th>Nota</th>
        </tr>
      </thead>
      <tbody>
        {CRITERIOS.map((c) => (
          <tr key={c.id}>
            <td>{c.nombre}</td>
            <td className="text-muted">{c.peso}%</td>
            <td>{notas[c.id]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

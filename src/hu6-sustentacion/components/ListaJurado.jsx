import { buscarDocente, nombreDocente } from '../services/sustentacionesService.js';

/**
 * Lista del jurado (solo lectura), con el presidente primero.
 * conDepartamento: muestra cada miembro en una tarjeta con su departamento (vista del estudiante).
 */
export default function ListaJurado({ datos, jurado, conDepartamento = false }) {
  // Copia ordenada: el presidente va primero
  const ordenado = [...jurado].sort((a, b) => Number(b.presidente) - Number(a.presidente));

  if (conDepartamento) {
    return (
      <div className="stack" style={{ marginTop: 12 }}>
        {ordenado.map((m) => {
          const docente = buscarDocente(datos, m.docenteId);
          return (
            <div key={m.docenteId} className="hu6-miembro">
              <div className="hu6-miembro__fila">
                <span className="hu6-miembro__nombre">{nombreDocente(docente)}</span>
                {m.presidente && <span className="badge badge--warning">Presidente</span>}
              </div>
              <span className="text-muted text-aux">{docente.departamento}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="hu6-lista-datos">
      {ordenado.map((m) => (
        <li key={m.docenteId}>
          <span>{nombreDocente(buscarDocente(datos, m.docenteId))}</span>
          {m.presidente && <span className="badge badge--warning">Presidente</span>}
        </li>
      ))}
    </ul>
  );
}

import { cupoDisponible, inicialesAsesor, nombreAsesor } from '../services/asesoriasService.js';
import { formatearFecha } from '../utils/fechas.js';

/**
 * Tarjeta de un asesor en el directorio (3.2).
 * Si no tiene cupo se ve atenuada; el botón abre el aviso "Este asesor no tiene cupo".
 * En modo lectura (visitante sin sesión) no se muestra el botón.
 */
export default function AsesorCard({ asesor, onSolicitar, modoLectura = false }) {
  const disponible = cupoDisponible(asesor);
  const sinCupo = disponible === 0;

  return (
    <article className={`card hu3-asesor ${sinCupo ? 'hu3-asesor--sin-cupo' : ''}`}>
      <div className="hu3-asesor__head">
        <span className="avatar avatar--soft" aria-hidden="true">{inicialesAsesor(asesor)}</span>
        <div>
          <p className="hu3-asesor__nombre">{nombreAsesor(asesor)}</p>
          <p className="hu3-asesor__depto">{asesor.departamento}</p>
        </div>
      </div>

      <div className="hu3-chips">
        {asesor.lineas.map((linea) => (
          <span key={linea} className={`hu3-chip ${sinCupo ? 'hu3-chip--gris' : ''}`}>{linea}</span>
        ))}
      </div>

      {sinCupo ? (
        <p className="hu3-aviso-cupo">
          Sin cupo disponible · {asesor.cupoOcupado} de {asesor.cupoMaximo} ocupados
          {asesor.sinCupoDesde && ` desde el ${formatearFecha(asesor.sinCupoDesde)}`}
        </p>
      ) : (
        <p className="hu3-asesor__desc">
          {asesor.especialidad} · {asesor.trabajosAsesorados} trabajos asesorados
        </p>
      )}

      <div className="hu3-asesor__pie">
        <span className="hu3-cupo">
          {!sinCupo && <>Cupo <strong>{disponible} de {asesor.cupoMaximo}</strong></>}
        </span>
        {!modoLectura && (
          <button
            type="button"
            className={`btn ${sinCupo ? 'btn--outline' : 'btn--primary'}`}
            style={sinCupo ? { borderColor: 'var(--border)', color: 'var(--muted)' } : undefined}
            onClick={() => onSolicitar(asesor)}
          >
            Solicitar asesoría
          </button>
        )}
      </div>
    </article>
  );
}

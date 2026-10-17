import { ESTADOS } from './EstadoEntregable.jsx';
import { formatearFecha } from '../utils/fechas.js';

/**
 * Tabla "Entregables del plan" de la pantalla 4.2.
 * Los aprobados quedan "Bloqueado"; el que se está editando se resalta.
 */
export default function TablaPlan({ items, suma, editandoId, soloLectura, puedeUsarPlantilla, onEditar, onEliminar, onPlantilla }) {
  return (
    <section className="card hu4-tabla-plan">
      <header className="hu4-tabla-plan__head">
        <h2>Entregables del plan</h2>
        <span className={`hu4-badge ${suma === 100 ? 'hu4-badge--success' : 'hu4-badge--warning'}`}>Suma {suma} / 100</span>
      </header>

      {items.length === 0 ? (
        <p className="hu4-tabla-plan__vacio text-muted">
          Este trabajo todavía no tiene entregables. Agrégalos uno por uno con el formulario o usa la plantilla del ciclo.
        </p>
      ) : (
        <table className="hu4-tabla">
          <thead>
            <tr>
              <th>Entregable</th>
              <th>Fecha límite</th>
              <th>Peso</th>
              <th className="hu4-tabla__accion">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => {
              const enEdicion = e.id === editandoId;
              const version = e.avances.length > 1 ? ` · v${e.avances.at(-1).version}` : '';
              return (
                <tr key={e.id} className={enEdicion ? 'is-editando' : ''}>
                  <td>
                    <strong>{e.orden}. {e.nombre}</strong>
                    <span className={`hu4-tabla__estado hu4-texto--${ESTADOS[e.estado].tono}`}>
                      {ESTADOS[e.estado].texto}{version}{enEdicion && ' · en edición'}
                      {!e.obligatorio && ' · opcional'}
                    </span>
                  </td>
                  <td>{formatearFecha(e.fechaLimite)}</td>
                  <td><strong>{e.peso}</strong></td>
                  <td className="hu4-tabla__accion">
                    {e.estado === 'aprobado' || soloLectura ? (
                      <span className="text-muted">Bloqueado</span>
                    ) : (
                      <>
                        <button className="link-button" onClick={() => onEditar(e)}>Editar</button>
                        <button className="link-button hu4-texto--danger" onClick={() => onEliminar(e)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <footer className="hu4-tabla-plan__pie">
        <p className="text-aux text-muted">
          Los entregables ya aprobados no pueden editarse ni eliminarse. Cambiar una fecha límite notifica al equipo.
        </p>
        <button
          className="btn btn--outline"
          disabled={!puedeUsarPlantilla}
          title={puedeUsarPlantilla ? '' : 'Solo se puede usar cuando el plan está vacío'}
          onClick={onPlantilla}
        >
          Usar plantilla del ciclo
        </button>
      </footer>
    </section>
  );
}

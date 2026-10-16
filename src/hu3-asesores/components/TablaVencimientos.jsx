import { HOY, diasEntre, formatearFecha } from '../utils/fechas.js';

// Acorta títulos largos: "Modelo predictivo de deserción..."
const acortar = (texto, maximo = 30) => (texto.length > maximo ? `${texto.slice(0, maximo).trim()}...` : texto);

// Texto y color de la fecha según cuántos días faltan.
function etiquetaFecha(fecha) {
  const dias = diasEntre(HOY, fecha);
  if (dias < 0) return { tono: 'danger', texto: `Vencido · ${formatearFecha(fecha)}` };
  if (dias <= 14) return { tono: 'warning', texto: `Faltan ${dias} días · ${formatearFecha(fecha)}` };
  return { tono: '', texto: formatearFecha(fecha) };
}

/** Tabla "Próximos vencimientos de mis asesorados" (3.5). */
export default function TablaVencimientos({ vencimientos, titulo, accion }) {
  return (
    <section className="card hu3-tabla-card">
      <div className="hu3-tabla-card__head">
        <h2 className="text-label">{titulo}</h2>
        {accion}
      </div>
      {vencimientos.length === 0 ? (
        <p className="text-muted" style={{ padding: '16px 24px' }}>No hay entregables por vencer.</p>
      ) : (
        <table className="hu3-tabla">
          <tbody>
            {vencimientos.map((v) => {
              const fecha = etiquetaFecha(v.fecha);
              return (
                <tr key={`${v.trabajoCodigo}-${v.entregable}`}>
                  <td title={v.tituloTrabajo}>{acortar(v.tituloTrabajo)}</td>
                  <td>{v.entregable}</td>
                  <td className={fecha.tono && `hu3-tono--${fecha.tono}`}>{fecha.texto}</td>
                  <td>Peso {v.peso}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

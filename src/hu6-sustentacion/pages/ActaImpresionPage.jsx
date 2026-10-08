import { Link, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import { buscarDocente, buscarSustentacion, buscarTrabajo, nombreDocente, notaFinal } from '../services/sustentacionesService.js';
import { CRITERIOS } from '../data/datosSemilla.js';
import { formatearFecha } from '../utils/fechas.js';
import '../styles/hu6.css';

/**
 * 6.3 Acta · documento A4 para imprimir (diapositiva 46). No usa PageLayout: es un documento.
 * La coordinación ve cualquier acta; el estudiante solo la de su trabajo.
 * "Imprimir / Guardar como PDF" usa window.print() del navegador.
 */
export default function ActaImpresionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { datos } = useSustentaciones();

  const sustentacion = buscarSustentacion(datos, id);
  const trabajo = sustentacion ? buscarTrabajo(datos, sustentacion.trabajoCodigo) : null;
  const esDelEquipo = trabajo?.equipo.some((i) => i.usuarioId === usuario.id);
  const puedeVer = sustentacion?.acta && (usuario.rol === 'coordinador' || (esDelEquipo && sustentacion.acta.registrada));

  if (!puedeVer) {
    return (
      <div className="hu6-impresion">
        <div className="card" style={{ maxWidth: 560, margin: '40px auto' }}>
          <EmptyState icono="!" tono="warning" titulo="Acta no disponible" texto="El acta todavía no se registra o no tienes permiso para verla.">
            <button className="btn btn--outline" onClick={() => navigate(-1)}>Volver</button>
          </EmptyState>
        </div>
      </div>
    );
  }

  const { acta } = sustentacion;
  const presidente = sustentacion.jurado.find((m) => m.presidente);
  const firmantes = presidente ? [presidente, ...sustentacion.jurado.filter((m) => m !== presidente)] : sustentacion.jurado;

  return (
    <div className="hu6-impresion">
      <div className="hu6-impresion__barra hu6-no-imprimir">
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>← Volver</button>
        <div style={{ display: 'flex', gap: 12 }}>
          {usuario.rol === 'coordinador' && <Link to={`/admin/sustentaciones/${id}/acta`} className="btn btn--outline">Ir al acta</Link>}
          <button className="btn btn--primary" onClick={() => window.print()}>Imprimir / Guardar como PDF</button>
        </div>
      </div>

      <article className="hu6-hoja">
        {!acta.registrada && <div className="hu6-marca-agua">BORRADOR</div>}

        <header className="hu6-hoja__encabezado">
          <p className="text-label">Universidad de Lima · Facultad de Ingeniería</p>
          <h1 style={{ fontSize: 22, lineHeight: '30px', margin: '6px 0' }}>Acta de sustentación de trabajo de fin de carrera</h1>
          <p className="text-muted text-aux">Código {trabajo.codigo} · Semestre 2026-2</p>
        </header>

        <p className="text-label">Título</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginTop: 2 }}>{trabajo.titulo}</p>

        <div className="hu6-hoja__datos">
          <div><p className="text-label">Línea de investigación</p><p>{trabajo.linea}</p></div>
          <div>
            <p className="text-label">Fecha y hora</p>
            <p>{formatearFecha(sustentacion.fecha)} · {sustentacion.hora} · {sustentacion.salaId ? `Sala ${sustentacion.salaId}` : 'Virtual'}</p>
          </div>
          <div><p className="text-label">Equipo</p><p>{trabajo.equipo.map((i) => i.nombre).join(' · ')}</p></div>
          <div><p className="text-label">Asesor</p><p>{trabajo.asesor}</p></div>
        </div>

        <table>
          <thead>
            <tr><th className="text-label">Criterio</th><th className="text-label">Peso</th><th className="text-label">Nota</th></tr>
          </thead>
          <tbody>
            {CRITERIOS.map((c) => (
              <tr key={c.id}><td>{c.nombre}</td><td>{c.peso}%</td><td>{acta.notas[c.id] === '' ? '—' : acta.notas[c.id]}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td>Nota final · Resultado: {acta.resultado || 'pendiente'}</td><td>100%</td><td>{notaFinal(acta.notas) ?? '—'}</td></tr>
          </tfoot>
        </table>

        <p className="text-label" style={{ marginTop: 20 }}>Observaciones del jurado</p>
        <p>{acta.observaciones || 'Sin observaciones.'}</p>

        <div className="hu6-firmas">
          {firmantes.map((m) => (
            <div key={m.docenteId}>
              <p style={{ fontWeight: 600 }}>{nombreDocente(buscarDocente(datos, m.docenteId))}</p>
              <p className="text-muted">{m.presidente ? 'Presidente del jurado' : 'Miembro'}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

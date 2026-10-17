import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import {
  buscarTrabajo,
  estaPendiente,
  resumenPeriodo,
  trabajosPorProgramar,
} from '../services/sustentacionesService.js';
import { VENTANA } from '../data/datosSemilla.js';
import { formatearCorta, formatearFecha } from '../utils/fechas.js';
import { SlotDato } from '../components/SlotsCabecera.jsx';
import '../styles/hu6.css';

const BADGE_ESTADO = {
  programada: { clase: 'badge--info', texto: 'Programada' },
  reprogramada: { clase: 'badge--warning', texto: 'Reprogramada' },
  realizada: { clase: 'badge--success', texto: 'Realizada' },
  desaprobada: { clase: 'badge--danger', texto: 'Desaprobada' },
};

/** Listado de sustentaciones del periodo · rol Administrador. */
export default function SustentacionesPage() {
  const { datos } = useSustentaciones();
  const resumen = resumenPeriodo(datos);
  const porProgramar = trabajosPorProgramar(datos);
  // Copia ordenada por fecha y hora (sort modifica el arreglo, por eso se copia)
  const lista = [...datos.sustentaciones].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  return (
    <PageLayout
      headerSlot={<SlotDato etiqueta="Periodo" valor="2026-2" />}
      navInfo={`Ventana de sustentaciones ${formatearCorta(VENTANA.inicio)} – ${formatearCorta(VENTANA.fin)}`}
      footerDetalle="coordinación TFC 2026-2"
    >
      <PageHead
        migas="Inicio · Sustentaciones"
        titulo="Sustentaciones"
        descripcion={`Ventana ${formatearFecha(VENTANA.inicio)} – ${formatearFecha(VENTANA.fin)} · ${resumen.programadas} programadas · ${resumen.realizadas} realizadas · ${resumen.porProgramar} concluidos por programar`}
        acciones={<Link to="/admin/sustentaciones/programar" className="btn btn--primary btn--lg">Programar sustentación</Link>}
      />

      <section className="card hu6-tabla-card">
        <div className="hu6-tabla-card__head"><h2 className="text-label">Calendario de sustentaciones</h2></div>
        {lista.length === 0 ? (
          <EmptyState icono="▤" titulo="Aún no hay sustentaciones" texto="Programa la primera desde «Programar sustentación»." />
        ) : (
          <table className="hu6-tabla">
            <thead>
              <tr><th>Fecha y hora</th><th>Trabajo</th><th>Sala</th><th>Jurado</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {lista.map((s) => {
                const trabajo = buscarTrabajo(datos, s.trabajoCodigo);
                const badge = BADGE_ESTADO[s.estado];
                const juradoCompleto = s.jurado.length === 3;
                return (
                  <tr key={s.id}>
                    <td>{formatearFecha(s.fecha)} · {s.hora}</td>
                    <td>
                      <p>{trabajo.titulo}</p>
                      <p className="text-muted text-aux">{trabajo.codigo} · {trabajo.asesor}</p>
                    </td>
                    <td>{s.salaId ?? '—'} · {s.modalidad.toLowerCase()}</td>
                    <td style={juradoCompleto ? undefined : { color: 'var(--warning-text)' }}>
                      {juradoCompleto ? '3 de 3' : 'Por conformar'}
                    </td>
                    <td><span className={`badge ${badge.clase}`}>{badge.texto}</span></td>
                    <td>
                      <div className="hu6-tabla__acciones">
                        {estaPendiente(s) ? (
                          <>
                            <Link to={`/admin/sustentaciones/${s.id}/jurado`} className="btn btn--outline hu6-btn-chico">Jurado</Link>
                            <Link to={`/admin/sustentaciones/${s.id}/reprogramar`} className="btn hu6-btn-neutro hu6-btn-chico">Reprogramar</Link>
                            {juradoCompleto && (
                              <Link to={`/admin/sustentaciones/${s.id}/acta`} className="btn btn--primary hu6-btn-chico">Acta</Link>
                            )}
                          </>
                        ) : (
                          <>
                            <Link to={`/admin/sustentaciones/${s.id}/acta`} className="btn btn--outline hu6-btn-chico">Ver acta</Link>
                            <Link to={`/sustentaciones/${s.id}/impresion`} className="btn hu6-btn-neutro hu6-btn-chico">Imprimir</Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="card hu6-tabla-card">
        <div className="hu6-tabla-card__head"><h2 className="text-label">Concluidos por programar ({porProgramar.length})</h2></div>
        {porProgramar.length === 0 ? (
          <EmptyState icono="✓" titulo="Todos los trabajos concluidos tienen fecha" />
        ) : (
          <table className="hu6-tabla">
            <tbody>
              {porProgramar.map((t) => (
                <tr key={t.codigo}>
                  <td>
                    <p>{t.titulo}</p>
                    <p className="text-muted text-aux">{t.codigo} · {t.linea} · {t.asesor}</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/admin/sustentaciones/programar/${t.codigo}`} className="btn btn--outline hu6-btn-chico">Programar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </PageLayout>
  );
}

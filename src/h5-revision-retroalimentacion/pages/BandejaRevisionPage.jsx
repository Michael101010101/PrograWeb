import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import H5Page from '../components/H5Page.jsx';
import Estado from '../components/Estado.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { detalleAvance, versionesDe } from '../services/revisionService.js';
import { fecha, diasDesde } from '../utils/fechas.js';

export default function BandejaRevisionPage() {
  const { datos } = useRevision();
  const [tab, setTab] = useState('pendientes');
  const [pagina, setPagina] = useState(1);
  const pendientes = datos.avances.filter((a) => a.estado === 'en_revision' && versionesDe(datos, a.entregableId)[0]?.id === a.id);
  const revisados = datos.avances.filter((a) => ['aprobado', 'observado'].includes(a.estado));
  const lista = [...(tab === 'pendientes' ? pendientes : revisados)].sort((a, b) => a.fecha.localeCompare(b.fecha) || String(a.id).localeCompare(String(b.id)));
  const paginas = Math.max(1, Math.ceil(lista.length / 6));
  const actual = Math.min(pagina, paginas);
  return <H5Page><PageHead migas="Inicio · Bandeja de revisión" titulo="Bandeja de revisión"
    descripcion={`${pendientes.length} avances pendientes · ordenados por antigüedad de entrega`}
    acciones={<div className="h5-tabs" role="group" aria-label="Filtrar revisiones">{[['pendientes', 'Pendientes', pendientes.length], ['revisados', 'Revisados', revisados.length]].map(([id, nombre, cantidad]) => <button key={id} className={`btn ${tab === id ? 'h5-tab-activo' : 'btn--outline'}`} aria-pressed={tab === id} onClick={() => { setTab(id); setPagina(1); }}>{nombre} ({cantidad})</button>)}</div>} />
    {!lista.length ? <div className="h5-panel"><EmptyState titulo={tab === 'pendientes' ? 'Sin avances por revisar' : 'Sin avances revisados'} texto={tab === 'pendientes' ? 'Revisaste todo lo que tus asesorados entregaron.' : 'Las decisiones de revisión aparecerán aquí.'}><Link className="btn btn--primary" to="/asesor/asesorados">Ver mis asesorados</Link></EmptyState></div>
      : <div className="h5-tabla-panel"><div className="h5-tabla-scroll"><table className="h5-tabla"><thead><tr>{['Trabajo', 'Entregable', 'Versión', 'Entrega', 'Acción'].map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead><tbody>
        {lista.slice((actual - 1) * 6, actual * 6).map((a) => {
          const { trabajo, entregable } = detalleAvance(datos, a.id);
          const dias = diasDesde(a.fecha);
          return <tr key={a.id}><td><strong className="h5-titulo-trabajo">{trabajo.titulo}</strong><small>{trabajo.codigo}</small></td><td>{entregable.nombre}{a.diasRetraso > 0 && <small className="h5-warning">Entregado con retraso</small>}</td><td>v{a.version}</td><td>{fecha(a.fecha)}<small className={dias > 7 ? 'h5-danger' : dias > 2 ? 'h5-warning' : 'h5-success'}>{tab === 'pendientes' ? dias ? `${dias} días en espera` : 'Hoy' : `Revisado el ${fecha(a.revision?.fecha)}`}</small></td><td><div className="h5-acciones">{tab === 'revisados' && <Estado estado={a.estado} />}<Link className="btn btn--primary" to={`/asesor/revision/${a.id}`}>{tab === 'pendientes' ? 'Revisar' : 'Ver revisión'}</Link></div></td></tr>;
        })}
      </tbody></table></div><div className="h5-tabla-pie"><span>Mostrando {(actual - 1) * 6 + 1}–{Math.min(actual * 6, lista.length)} de {lista.length}</span><div className="h5-acciones"><button className="btn btn--outline" disabled={actual === 1} onClick={() => setPagina(actual - 1)}>Anterior</button><span className="h5-pagina">{actual}</span><button className="btn btn--outline" disabled={actual === paginas} onClick={() => setPagina(actual + 1)}>Siguiente</button></div></div></div>}
  </H5Page>;
}

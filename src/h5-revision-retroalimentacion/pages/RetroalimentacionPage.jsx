import { Link, useSearchParams } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import H5Page from '../components/H5Page.jsx';
import Conversacion from '../components/Conversacion.jsx';
import Estado from '../components/Estado.jsx';
import Documento from '../components/Documento.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { versionesDe } from '../services/revisionService.js';
import { fecha } from '../utils/fechas.js';

export default function RetroalimentacionPage() {
  const { datos } = useRevision();
  const [params, setParams] = useSearchParams();
  const trabajo = params.has('trabajo') ? datos.trabajos.find((t) => t.codigo === params.get('trabajo')) : datos.trabajos[0];
  const entregables = datos.entregables.filter((e) => e.trabajoCodigo === trabajo?.codigo).sort((a, b) => a.orden - b.orden);
  const entregable = params.has('entregable') ? entregables.find((e) => e.id === params.get('entregable')) : entregables[0];
  const versiones = versionesDe(datos, entregable?.id);
  const avance = params.has('version') ? versiones.find((a) => a.id === params.get('version')) : versiones[0];
  return <H5Page trabajo={trabajo}><PageHead migas="Inicio · Retroalimentación" titulo="Retroalimentación" descripcion="Consulta las revisiones de tu trabajo y responde a los comentarios del asesor."
    acciones={trabajo && <Link className="btn btn--outline" to={`/estudiante/retroalimentacion/trabajo/${trabajo.codigo}`}>Ver trabajo consolidado</Link>} />
    {!trabajo ? <EmptyState titulo="No hay trabajos disponibles" texto="No tienes un trabajo asociado para consultar su retroalimentación." /> : <>
      <div className="h5-filtros"><label>Trabajo<select value={trabajo.codigo} onChange={(e) => setParams({ trabajo: e.target.value })}>{datos.trabajos.map((t) => <option key={t.codigo} value={t.codigo}>{t.titulo}</option>)}</select></label>
        <label>Entregable<select value={entregable?.id ?? ''} onChange={(e) => setParams({ trabajo: trabajo.codigo, entregable: e.target.value })}>{entregables.map((e) => <option key={e.id} value={e.id}>{e.orden}. {e.nombre}</option>)}</select></label>
        {versiones.length > 0 && <label>Versión<select value={avance?.id ?? ''} onChange={(e) => setParams({ trabajo: trabajo.codigo, entregable: entregable.id, version: e.target.value })}>{versiones.map((a) => <option key={a.id} value={a.id}>Versión {a.version}</option>)}</select></label>}</div>
      {!entregable ? <EmptyState titulo="Entregable no disponible" texto="Selecciona un entregable de tu trabajo." /> : !avance ? <EmptyState titulo="Sin versiones para revisar" texto="Cuando se registre un avance, podrás consultar aquí su retroalimentación." /> : <div className="h5-grid h5-grid--revision"><section className="h5-panel"><div className="h5-panel-head"><h2>{entregable.nombre} · v{avance.version}</h2><Estado estado={avance.estado} /></div><p className="text-muted">Entregado el {fecha(avance.fecha)} · peso {entregable.peso}</p><p className="h5-nota">{avance.descripcion}</p><Documento enlace={avance.enlace} /><Link className="btn btn--outline h5-enlace-historial" to={`/estudiante/retroalimentacion/historial/${entregable.id}`}>Ver historial de versiones</Link></section>
        <section className="h5-panel"><h2>Comentarios y respuestas</h2><Conversacion key={avance.id} avance={avance} responder /></section></div>}
    </>}
  </H5Page>;
}

import { Link, useParams, useSearchParams } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import H5Page from '../components/H5Page.jsx';
import Estado from '../components/Estado.jsx';
import Documento from '../components/Documento.jsx';
import Conversacion from '../components/Conversacion.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { versionesDe } from '../services/revisionService.js';
import { fecha } from '../utils/fechas.js';
import { baseHu5 } from '../utils/rutas.js';

export default function HistorialVersionesPage() {
  const { entregableId } = useParams();
  const [params] = useSearchParams();
  const { datos, usuario } = useRevision();
  const entregable = datos.entregables.find((e) => e.id === entregableId);
  const trabajo = datos.trabajos.find((t) => t.codigo === entregable?.trabajoCodigo);
  const versiones = versionesDe(datos, entregableId);
  const base = baseHu5(usuario.rol);
  return <H5Page trabajo={trabajo} detalle="historial en modo lectura">{!trabajo || !entregable ? <EmptyState titulo="Historial no disponible" texto="No existe o no corresponde a tus trabajos." /> : <>
    <PageHead migas={`Retroalimentación · Entregable ${entregable.orden}`} titulo={`Historial de versiones · ${entregable.nombre}`} descripcion={`${versiones.length} versiones · peso ${entregable.peso} · fecha límite ${fecha(entregable.fechaLimite)}`} acciones={<><Estado estado={versiones[0]?.estado ?? 'pendiente'} /><Link className="btn btn--outline" to={`${base}/trabajo/${trabajo.codigo}`}>Volver al trabajo</Link></>} />
    <div className="h5-grid h5-grid--lateral"><div className="h5-stack">{!versiones.length && <EmptyState titulo="Sin versiones" texto="Este entregable todavía no tiene avances registrados." />}{versiones.map((a, i) => <details key={`${entregableId}-${a.id}`} className={`h5-version ${a.estado === 'aprobado' ? 'h5-version--aprobada' : ''}`} open={params.has('version') ? params.get('version') === a.id : i === 0}>
      <summary><div><strong>Versión {a.version}</strong><small>Entregada el {fecha(a.fecha)} · {a.diasRetraso > 0 ? 'con retraso' : 'a tiempo'} · {a.comentarios.length} comentarios</small></div><div><Estado estado={a.estado} />{a.revision && <small>{fecha(a.revision.fecha)}</small>}</div></summary>
      <div className="h5-version__contenido"><span className="text-label">Descripción de lo entregado</span><p>{a.descripcion}</p><Documento enlace={a.enlace} /><Conversacion avance={a} />{usuario.rol === 'estudiante' && <Link to={`${base}?trabajo=${trabajo.codigo}&entregable=${entregable.id}&version=${a.id}`}>Responder al asesor</Link>}</div>
    </details>)}</div><aside className="h5-stack"><section className="h5-panel"><h3>Otros entregables</h3><ul className="h5-lista">{datos.entregables.filter((e) => e.trabajoCodigo === trabajo.codigo && e.id !== entregableId).sort((a, b) => a.orden - b.orden).map((e) => <li key={e.id}><Link to={`${base}/historial/${e.id}`}>{e.orden}. {e.nombre}</Link><small>{versionesDe(datos, e.id).length} versiones</small></li>)}</ul></section><section className="h5-panel h5-panel--suave"><h3>Cómo funciona el versionado</h3><p>Cada avance registrado crea una versión nueva. Las versiones observadas quedan en el historial con sus comentarios; solo la última puede ser aprobada.</p></section></aside></div>
  </>}</H5Page>;
}

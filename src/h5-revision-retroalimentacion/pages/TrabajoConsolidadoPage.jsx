import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../shared/components/EmptyState.jsx';
import H5Page from '../components/H5Page.jsx';
import Estado from '../components/Estado.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { versionesDe } from '../services/revisionService.js';
import { progresoTrabajo } from '../utils/progreso.js';
import { fecha, hoy } from '../utils/fechas.js';
import { baseHu5 } from '../utils/rutas.js';
import usuariosSeed from '../../data/seed.json';

function Miembro({ nombre, detalle }) {
  const iniciales = nombre.replace(/^(Dra?\.|Mg\.)\s*/i, '').split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('');
  return <li><span className="avatar h5-equipo-avatar" aria-hidden="true">{iniciales}</span><div><strong>{nombre}</strong><small>{detalle}</small></div></li>;
}

export default function TrabajoConsolidadoPage({ codigo: codigoProp }) {
  const { codigo: codigoRuta } = useParams();
  const codigo = codigoProp ?? codigoRuta;
  const { datos, usuario } = useRevision();
  const trabajo = datos.trabajos.find((t) => t.codigo === codigo);
  const base = baseHu5(usuario.rol);
  if (!trabajo) return <H5Page><EmptyState titulo="Trabajo no disponible" texto="No existe o no corresponde a tu cuenta."><Link to={base}>Volver</Link></EmptyState></H5Page>;
  const entregables = datos.entregables.filter((e) => e.trabajoCodigo === codigo).sort((a, b) => a.orden - b.orden);
  const progreso = progresoTrabajo(datos, codigo);
  const avances = datos.avances.filter((a) => entregables.some((e) => e.id === a.entregableId));
  const comentarios = avances.flatMap((a) => a.comentarios.filter((c) => c.rol === 'asesor').map((c) => ({ ...c, avance: a }))).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const ultima = comentarios[0];
  const vencidos = entregables.filter((e) => !versionesDe(datos, e.id).length && e.fechaLimite < hoy() && trabajo.estado !== 'concluido');
  const eventos = avances.flatMap((a) => [{ fecha: a.fecha, texto: `Versión ${a.version} presentada`, avance: a }, ...(a.revision ? [{ fecha: a.revision.fecha, texto: a.estado === 'aprobado' ? 'Avance aprobado' : 'Avance observado', avance: a }] : []), ...a.comentarios.map((c) => ({ fecha: c.fecha, texto: `${c.rol === 'asesor' ? 'Comentario del asesor' : 'Respuesta del estudiante'}: ${c.texto}`, avance: a }))]).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  return <H5Page trabajo={trabajo} detalle={`trabajo ${codigo} · avance ${progreso.porcentaje}%`}>
    {!codigoProp && <div className="h5-acciones h5-volver"><Link to={base}>‹ Volver a {usuario.rol === 'asesor' ? 'la bandeja' : 'retroalimentación'}</Link></div>}
    <section className="h5-panel h5-trabajo"><div className="h5-acciones"><Estado estado={trabajo.estado} /><span className="text-muted">{trabajo.codigo} · {trabajo.linea} · asesor {trabajo.asesor?.nombre}</span></div><h1>{trabajo.titulo}</h1><div className="h5-progreso"><span className="text-label">Avance</span><progress max="100" value={progreso.porcentaje} aria-label="Porcentaje de avance" /><strong>{progreso.porcentaje}%</strong><span>{progreso.aprobados} de {progreso.total} entregables aprobados · {vencidos.length} vencidos sin presentar</span></div></section>
    <div className="h5-grid h5-grid--lateral"><section className={`h5-panel${codigoProp ? ' h5-consolidada-timeline' : ''}`}><h2>Línea de tiempo del trabajo</h2><ol className="h5-timeline">{entregables.map((e) => {
      const a = versionesDe(datos, e.id)[0];
      const estado = a?.estado ?? (vencidos.includes(e) ? 'vencido' : 'pendiente');
      return <li className={`h5-timeline__item h5-timeline__item--${estado}`} key={e.id}><div className="h5-acciones"><Estado estado={estado} /><small>Peso {e.peso}{a ? ` · versión ${a.version}` : ''}</small></div><h3><Link to={`${base}/historial/${e.id}`}>{e.orden}. {e.nombre}</Link></h3><p className="text-muted">Límite {fecha(e.fechaLimite)}{a?.revision && ` · ${a.estado === 'aprobado' ? 'aprobado' : 'observado'} el ${fecha(a.revision.fecha)}`}</p></li>;
    })}</ol>{!entregables.length && <EmptyState titulo="Sin plan de entregables" texto="El plan del trabajo aún no está disponible." />}
      {!codigoProp && <details className="h5-eventos"><summary>Revisiones y retroalimentación ({eventos.length} eventos)</summary><ol>{eventos.map((e, i) => <li key={`${e.avance.id}-${i}`}><time dateTime={e.fecha}>{fecha(e.fecha)}</time><strong>{datos.entregables.find((d) => d.id === e.avance.entregableId)?.nombre} · v{e.avance.version}</strong><p>{e.texto}</p></li>)}</ol></details>}
    </section><aside className="h5-stack"><section className="h5-panel"><h3>Última retroalimentación</h3>{ultima ? <><div className="h5-panel-head"><strong>{datos.entregables.find((e) => e.id === ultima.avance.entregableId)?.nombre} · v{ultima.avance.version}</strong><Estado estado={ultima.avance.estado} /></div><blockquote>{ultima.texto}</blockquote><p className="text-muted">{ultima.autor} · {fecha(ultima.fecha)}</p><Link className="btn btn--outline h5-enlace-historial" to={`${base}/historial/${ultima.avance.entregableId}`}>Ver todas las revisiones</Link></> : <p className="text-muted">Aún no hay retroalimentación.</p>}</section>
      {vencidos.length > 0 && <section className="h5-panel h5-panel--aviso"><h3>Tienes {vencidos.length} entregable{vencidos.length > 1 ? 's' : ''} vencido{vencidos.length > 1 ? 's' : ''}</h3>{vencidos.map((e) => <p key={e.id}>{e.nombre} vencía el {fecha(e.fechaLimite)}.</p>)}{usuario.rol === 'estudiante' && <Link className="btn btn--primary h5-enlace-historial" to="/estudiante/entregables">Registrar avance ahora</Link>}</section>}
      <section className="h5-panel"><h3>Equipo y asesor</h3><ul className="h5-equipo"><Miembro nombre={trabajo.asesor?.nombre || 'Sin asesor asignado'} detalle={trabajo.asesor?.diasRespuesta ? `Asesor?a ? responde en ${trabajo.asesor.diasRespuesta} d?as` : 'Asesor?a'} />{trabajo.integrantes.map((id) => { const u = id === usuario.id ? usuario : usuariosSeed.usuarios.find((item) => item.id === id); return <Miembro key={id} nombre={u ? `${u.nombres} ${u.apellidos}` : 'Integrante del equipo'} detalle={trabajo.responsableId === id ? 'Responsable' : 'Integrante'} />; })}</ul></section>
    </aside></div>
  </H5Page>;
}

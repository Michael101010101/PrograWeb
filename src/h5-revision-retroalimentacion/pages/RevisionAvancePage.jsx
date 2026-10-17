import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import Modal from '../../shared/components/Modal.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import H5Page from '../components/H5Page.jsx';
import Estado from '../components/Estado.jsx';
import Documento from '../components/Documento.jsx';
import Conversacion from '../components/Conversacion.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { detalleAvance, puedeRevisar, versionesDe } from '../services/revisionService.js';
import { progresoTrabajo } from '../utils/progreso.js';
import { fecha } from '../utils/fechas.js';

export default function RevisionAvancePage() {
  const { id } = useParams();
  return <RevisionContenido key={id} id={id} />;
}
function RevisionContenido({ id }) {
  const { datos, usuario, ejecutar } = useRevision();
  const { mostrar } = useToast();
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const detalle = detalleAvance(datos, id);
  if (!detalle) return <H5Page><EmptyState tono="error" titulo="Avance no disponible" texto="No existe o no corresponde a tus trabajos asignados."><Link to="/asesor/revision">Volver a la bandeja</Link></EmptyState></H5Page>;
  const { avance, entregable, trabajo } = detalle;
  const revisable = puedeRevisar(datos, usuario, id);
  const pendientes = datos.avances.filter((a) => puedeRevisar(datos, usuario, a.id)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const posicion = pendientes.findIndex((a) => a.id === id);
  const anterior = pendientes[posicion - 1];
  const siguiente = pendientes[posicion + 1];
  const progreso = progresoTrabajo(datos, trabajo.codigo);
  const anteriores = versionesDe(datos, entregable.id).filter((a) => a.version < avance.version);
  async function enviar(tipo) {
    setEnviando(true);
    try {
      await ejecutar({ tipo, avanceId: id, texto });
      setError(''); setTexto('');
      if (tipo === 'comentario') mostrar({ titulo: 'Comentario publicado' });
      else setResultado({ tipo, texto: texto.trim(), antes: progreso.porcentaje, despues: progreso.porcentaje + (tipo === 'aprobado' && entregable.obligatorio ? entregable.peso : 0), siguiente: siguiente?.id, fecha: new Date().toISOString() });
    } catch (err) { setError(err.message); }
    finally { setEnviando(false); }
  }
  return <H5Page trabajo={trabajo} detalle={`revisando ${trabajo.codigo}`}>
    <PageHead migas="Bandeja de revisión · Avance" titulo={`${entregable.nombre} · versión ${avance.version}`} acciones={<div className="h5-acciones">{anterior && <Link to={`/asesor/revision/${anterior.id}`}>‹ Anterior</Link>}{posicion >= 0 && <span>{posicion + 1} de {pendientes.length}</span>}{siguiente && <Link to={`/asesor/revision/${siguiente.id}`}>Siguiente ›</Link>}<Link to="/asesor/revision">Bandeja</Link></div>} />
    <div className="h5-grid h5-grid--revision"><div className="h5-stack"><section className="h5-panel"><div className="h5-panel-head"><h2>Datos del avance</h2><Estado estado={avance.estado} /></div>
      <span className="text-label">Trabajo</span><h3>{trabajo.titulo}</h3>
      <dl className="h5-datos"><div><dt>Entregado</dt><dd>{fecha(avance.fecha)} · {avance.diasRetraso > 0 ? 'con retraso' : 'a tiempo'}</dd></div><div><dt>Fecha límite</dt><dd>{fecha(entregable.fechaLimite)}</dd></div><div><dt>Peso</dt><dd>{entregable.peso}</dd></div><div><dt>Registró</dt><dd>{avance.autor ?? 'Equipo del trabajo'}</dd></div></dl>
      <span className="text-label">Descripción de lo entregado</span><p>{avance.descripcion}</p><hr className="divider" /><span className="text-label">Documento</span><Documento enlace={avance.enlace} />
    </section><section className="h5-panel"><h2>Versiones anteriores</h2><div className="h5-stack">{anteriores.length ? anteriores.map((a) => <Link className="h5-version-resumen" key={a.id} to={`/asesor/revision/historial/${entregable.id}?version=${a.id}`}><div><strong>Versión {a.version}</strong><small>Entregada el {fecha(a.fecha)} · {a.comentarios.length} comentarios</small></div><Estado estado={a.estado} /></Link>) : <p className="text-muted">Esta es la primera versión del entregable.</p>}</div><p className="h5-nota">Al aprobar esta versión, el entregable queda cerrado y suma {entregable.obligatorio ? entregable.peso : 0} puntos al avance del trabajo.</p><Link to={`/asesor/revision/trabajo/${trabajo.codigo}`}>Ver trabajo consolidado</Link></section></div>
      <section className="h5-panel h5-panel--comentarios"><h2>Comentarios</h2><Conversacion avance={avance} />
        <form className="h5-form" onSubmit={(e) => { e.preventDefault(); enviar('comentario'); }}>
          <label htmlFor="correcciones">Qué debe corregirse</label><textarea id="correcciones" maxLength={800} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Obligatorio si observas el avance. Sé específico: capítulo, página y qué falta." aria-invalid={Boolean(error)} aria-describedby="correcciones-error" /><small>{texto.length} / 800</small>
          {error && <div id="correcciones-error"><Alert>{error}</Alert></div>}
          <button className="btn btn--outline" disabled={enviando} type="submit">Publicar comentario</button>
          {revisable ? <><div className="h5-decisiones"><button type="button" disabled={enviando} className="btn btn--primary btn--lg" onClick={() => enviar('aprobado')}>Aprobar avance</button><button type="button" disabled={enviando} className="btn h5-btn-observar btn--lg" onClick={() => enviar('observado')}>Observar avance</button></div><p className="h5-nota">Aprobar suma {entregable.obligatorio ? entregable.peso : 0} puntos al avance del trabajo ({progreso.porcentaje}% → {progreso.porcentaje + (entregable.obligatorio ? entregable.peso : 0)}%). Observar exige al menos 30 caracteres y habilita una nueva versión al estudiante.</p></> : <p className="h5-nota">Esta versión ya tiene un desenlace o fue reemplazada por una versión más reciente. Puedes consultar su historial y publicar comentarios.</p>}
        </form>
      </section></div>
    <Modal abierto={Boolean(resultado)} onCerrar={() => setResultado(null)} titulo={`${entregable.nombre} · v${avance.version}`} ancho="wide" acciones={<><Link className="btn btn--outline" to="/asesor/revision">Volver a la bandeja</Link>{resultado?.siguiente ? <Link className="btn btn--primary" to={`/asesor/revision/${resultado.siguiente}`}>Revisar el siguiente</Link> : <Link className="btn btn--primary" to={`/asesor/revision/historial/${entregable.id}`}>Ver historial de versiones</Link>}</>}>
      {resultado && <div className="h5-stack"><Estado estado={resultado.tipo} /><Alert tipo={resultado.tipo === 'aprobado' ? 'success' : 'warning'}>{resultado.tipo === 'aprobado' ? `Aprobado el ${fecha(resultado.fecha)}. El avance del trabajo pasó de ${resultado.antes}% a ${resultado.despues}%.` : `Observado el ${fecha(resultado.fecha)}. El avance del trabajo se mantiene en ${resultado.antes}%.`}</Alert>{resultado.texto && <blockquote>{resultado.texto}</blockquote>}<p>La retroalimentación está disponible para el equipo del trabajo.</p></div>}
    </Modal>
  </H5Page>;
}

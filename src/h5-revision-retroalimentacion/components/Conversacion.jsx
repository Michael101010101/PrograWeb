import { useState } from 'react';
import Alert from '../../shared/components/Alert.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { fecha } from '../utils/fechas.js';

export default function Conversacion({ avance, responder = false }) {
  const { usuario, ejecutar } = useRevision();
  const { mostrar } = useToast();
  const [seleccion, setSeleccion] = useState(null);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const comentarios = [...avance.comentarios].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      await ejecutar({ tipo: 'respuesta', avanceId: avance.id, texto, respuestaA: seleccion });
      setTexto(''); setSeleccion(null); setError('');
      mostrar({ titulo: 'Respuesta enviada', mensaje: 'Tu asesor puede consultar tu respuesta.' });
    } catch (err) { setError(err.message); }
    finally { setEnviando(false); }
  }
  return <div className="h5-conversacion">
    {!comentarios.length && <EmptyState icono="…" titulo="Aún no hay comentarios" texto="La retroalimentación de esta versión aparecerá aquí." />}
    {comentarios.map((c) => <article key={c.id} className={`h5-mensaje ${c.rol === 'estudiante' ? 'h5-mensaje--estudiante' : ''}`}>
      <span className="avatar" aria-hidden="true">{(c.autor || '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('')}</span>
      <div className="h5-mensaje__cuerpo"><div className="h5-mensaje__cabecera"><strong>{c.autor} · {c.rol === 'asesor' ? 'asesor' : 'estudiante'}</strong><time dateTime={c.fecha}>{fecha(c.fecha)}</time></div>
        {c.respuestaA && <p className="h5-cita">En respuesta a: {comentarios.find((p) => p.id === c.respuestaA)?.texto ?? 'comentario del asesor'}</p>}
        <p>{c.texto}</p>
        {responder && usuario.rol === 'estudiante' && c.rol === 'asesor' && <button type="button" className="link-button" onClick={() => { setSeleccion(c.id); setError(''); }}>Responder a este comentario</button>}
      </div>
    </article>)}
    {seleccion && <form className="h5-form" onSubmit={enviar}>
      <label htmlFor={`respuesta-${avance.id}`}>Respuesta al asesor</label>
      <blockquote>{comentarios.find((c) => c.id === seleccion)?.texto}</blockquote>
      <textarea id={`respuesta-${avance.id}`} value={texto} maxLength={800} onChange={(e) => setTexto(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={`respuesta-error-${avance.id}`} />
      <small>{texto.length} / 800</small>
      {error && <div id={`respuesta-error-${avance.id}`}><Alert>{error}</Alert></div>}
      <div className="h5-acciones"><button type="button" className="btn btn--outline" disabled={enviando} onClick={() => { setSeleccion(null); setTexto(''); }}>Cancelar</button><button className="btn btn--primary" disabled={enviando} type="submit">{enviando ? 'Enviando…' : 'Enviar respuesta'}</button></div>
    </form>}
  </div>;
}

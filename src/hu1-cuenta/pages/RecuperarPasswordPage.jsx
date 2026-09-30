import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { TextField } from '../../shared/components/FormField.jsx';
import Stepper from '../components/Stepper.jsx';
import DemoLink from '../components/DemoLink.jsx';
import * as authService from '../services/authService.js';
import { CONTACTO } from '../../shared/config/periodo.js';

const ESPERA_REENVIO = 120; // segundos

/** Recuperar contraseña · pasos 1 (correo) y 2 (enlace enviado). El paso 3 vive en /recuperar/:token. */
export default function RecuperarPasswordPage() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (segundos <= 0) return undefined;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const enviar = async (e) => {
    e?.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const r = await authService.solicitarRecuperacion(resultado?.correo ?? correo);
      setResultado(r);
      setSegundos(ESPERA_REENVIO);
    } catch (err) {
      setError(err.campos?.correo ?? err.message);
    } finally {
      setEnviando(false);
    }
  };

  const mmss = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;

  return (
    <PageLayout
      navExtra={{ to: '/recuperar', label: 'Recuperar contraseña' }}
      accionesPublicas={<Link to="/login" className="btn btn--outline">Iniciar sesión</Link>}
      footerDetalle={`Universidad de Lima · Oficina de Trabajos de Fin de Carrera · Mesa de ayuda anexo ${CONTACTO.mesaAyuda}`}
      centrado
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="card" style={{ padding: '16px 24px', marginBottom: 20 }}>
          <Stepper paso={resultado ? 2 : 1} />
        </div>

        <div className="layout-split" style={{ alignItems: 'start', gap: 32 }}>
          <section>
            <h1 style={{ marginBottom: 12 }}>Recuperar contraseña</h1>
            <p className="text-muted" style={{ marginBottom: 20 }}>
              Te enviaremos un enlace para crear una nueva contraseña. El enlace vence en 60 minutos y solo puede usarse una vez.
            </p>
            <div className="card">
              <p className="text-label" style={{ marginBottom: 4 }}>Si no recibes el correo</p>
              <p className="text-muted" style={{ fontSize: 14 }}>
                Revisa la carpeta de no deseados, confirma que el correo esté escrito completo o escribe a la mesa de ayuda
                (anexo {CONTACTO.mesaAyuda}).
              </p>
            </div>
          </section>

          {!resultado ? (
            <form className="card" onSubmit={enviar} noValidate>
              <p className="text-label" style={{ color: 'var(--primary-dark)', marginBottom: 14 }}>Paso 1 de 3</p>
              <div className="stack" style={{ gap: 16 }}>
                <TextField
                  label="Correo institucional"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@aloe.ulima.edu.pe"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  error={error}
                />
                <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Enviar enlace'}
                </button>
                <Link to="/login" style={{ textAlign: 'center' }}>Volver a iniciar sesión</Link>
              </div>
            </form>
          ) : (
            <section className="card stack" style={{ gap: 14 }} aria-live="polite">
              <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Paso 2 de 3 · Envío</p>
              <Alert tipo="success">Enlace enviado a {resultado.correo}</Alert>
              <h2>Revisa tu correo</h2>
              <p className="text-muted" style={{ fontSize: 14 }}>
                Si existe una cuenta con ese correo, recibirás el enlace. Vence en 60 minutos; si no lo encuentras, revisa la
                carpeta de no deseados.
              </p>
              <DemoLink to={resultado.enlaceDemo} texto="Abrir enlace para crear la nueva contraseña" />
              <button className="btn btn--outline btn--block" onClick={enviar} disabled={segundos > 0 || enviando}>
                {segundos > 0 ? `Reenviar en ${mmss}` : 'Reenviar enlace'}
              </button>
              <button className="link-button" onClick={() => { setResultado(null); setSegundos(0); }}>
                Usar otro correo
              </button>
            </section>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import PageLayout from '../../shared/components/PageLayout.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { PasswordField, TextField } from '../../shared/components/FormField.jsx';
import DemoLink from '../components/DemoLink.jsx';
import * as authService from '../services/authService.js';
import { INICIO_POR_ROL } from '../../shared/config/roles.js';
import { CONTACTO } from '../../shared/config/periodo.js';

// Prefijos de ruta de cada rol: se usa para volver a la página pedida antes del login
const PREFIJO_ROL = { estudiante: '/estudiante', asesor: '/asesor', coordinador: '/admin' };

const MENUS = [
  ['estudiante', 'Estudiante', 'Mi trabajo · Entregables · Asesores · Mi sustentación'],
  ['asesor', 'Asesor', 'Mis asesorados · Solicitudes · Bandeja de revisión · Mi ficha'],
  ['coordinador', 'Administrador', 'Tablero · Trabajos · Sustentaciones · Usuarios'],
];

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [verificacion, setVerificacion] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrores({});
    setVerificacion(null);
    setEnviando(true);
    try {
      const u = await iniciarSesion(correo, password, recordar);
      mostrar({ tipo: 'exito', titulo: `Hola, ${u.nombres.split(' ')[0]}`, mensaje: 'Iniciaste sesión correctamente.' });
      const desde = location.state?.desde;
      const destino = desde && (desde === '/cuenta' || desde.startsWith(PREFIJO_ROL[u.rol])) ? desde : INICIO_POR_ROL[u.rol];
      navigate(destino, { replace: true });
    } catch (err) {
      setError({ status: err.status, mensaje: err.message, datos: err.datos });
      setErrores(err.campos ?? {});
      if (err.status === 401) setPassword('');
    } finally {
      setEnviando(false);
    }
  };

  const reenviar = async () => {
    try {
      const r = await authService.reenviarVerificacion(error.datos.usuarioId);
      setVerificacion(r);
      mostrar({ tipo: 'exito', titulo: 'Enlace reenviado', mensaje: `Revisa ${r.correo}.` });
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo reenviar', mensaje: err.message });
    }
  };

  return (
    <PageLayout
      navExtra={{ to: '/login', label: 'Iniciar sesión' }}
      accionesPublicas={<Link to="/registro/estudiante" className="btn btn--primary">Crear cuenta</Link>}
      footerDetalle={`Universidad de Lima · Oficina de Trabajos de Fin de Carrera · Soporte de cuentas: mesa de ayuda anexo ${CONTACTO.mesaAyuda}`}
      centrado
    >
      <div className="layout-split">
        <section>
          <p className="text-label text-accent" style={{ marginBottom: 12 }}>Acceso con cuenta institucional</p>
          <h1 style={{ fontSize: 34, lineHeight: '42px', marginBottom: 16 }}>
            Ingresa para ver tu trabajo, tus entregables y la retroalimentación de tu asesor
          </h1>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Los estudiantes acceden con su correo @aloe.ulima.edu.pe; los asesores y la coordinación, con su correo
            @ulima.edu.pe. Cada rol ve un menú distinto al ingresar.
          </p>
          <div className="stack">
            {MENUS.map(([rol, label, menu]) => (
              <div key={rol} className="card" style={{ padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', marginTop: 0 }}>
                <span className={`badge badge--${rol}`}>{label}</span>
                <span className="text-muted" style={{ fontSize: 14 }}>{menu}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 28 }} aria-labelledby="titulo-login">
          <h2 id="titulo-login" style={{ marginBottom: 16 }}>Iniciar sesión</h2>
          <form onSubmit={onSubmit} noValidate className="stack" style={{ gap: 16 }}>
            {error && (
              <Alert tipo={error.status === 403 && error.datos?.motivo === 'pendiente_validacion' ? 'warning' : 'error'}>
                {error.mensaje}
                {error.datos?.motivo === 'sin_verificar' && (
                  <>
                    {' '}
                    <button type="button" className="link-button" onClick={reenviar}>Reenviar enlace</button>
                  </>
                )}
              </Alert>
            )}
            {verificacion && <DemoLink to={verificacion.enlaceDemo} texto="Abrir enlace de verificación" />}

            <TextField
              label="Correo institucional"
              type="email"
              name="correo"
              autoComplete="username"
              placeholder="nombre@aloe.ulima.edu.pe"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
            />
            <PasswordField
              label="Contraseña"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errores.password}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <label className="checkbox">
                <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
                Recordarme
              </label>
              <Link to="/recuperar" style={{ fontSize: 14 }}>¿Olvidaste tu contraseña?</Link>
            </div>
            <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={enviando}>
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
          <hr className="divider" />
          <p className="text-muted" style={{ fontSize: 14, textAlign: 'center' }}>
            ¿No tienes cuenta? <Link to="/registro/estudiante">Regístrate como estudiante</Link> o{' '}
            <Link to="/registro/asesor">como asesor</Link>
          </p>
        </section>
      </div>
    </PageLayout>
  );
}

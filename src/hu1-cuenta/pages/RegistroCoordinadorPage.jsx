import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { PasswordField, TextField } from '../../shared/components/FormField.jsx';
import useFormulario from '../components/useFormulario.js';
import PasswordRules from '../components/PasswordRules.jsx';
import * as authService from '../services/authService.js';
import { validarRegistroCoordinador } from '../utils/validators.js';

const INICIAL = { nombres: '', apellidos: '', password: '', confirmacion: '' };

/** Registro del coordinador por invitación: /registro/coordinador?invitacion=INV-XXXX-XXXX */
export default function RegistroCoordinadorPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const codigoUrl = params.get('invitacion') ?? '';

  const [codigo, setCodigo] = useState(codigoUrl);
  const [invitacion, setInvitacion] = useState(null);
  const [errorInvitacion, setErrorInvitacion] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const form = useFormulario(INICIAL, validarRegistroCoordinador);

  const consultar = useCallback(async (c) => {
    setConsultando(true);
    setErrorInvitacion(null);
    try {
      setInvitacion(await authService.consultarInvitacion(c));
    } catch (err) {
      setInvitacion(null);
      setErrorInvitacion(err.message);
    } finally {
      setConsultando(false);
    }
  }, []);

  useEffect(() => {
    if (codigoUrl) consultar(codigoUrl);
  }, [codigoUrl, consultar]);

  const onBuscar = (e) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setErrorInvitacion('Ingresa el código que recibiste en la invitación.');
      return;
    }
    setParams({ invitacion: codigo.trim().toUpperCase() });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    if (!form.validarTodo()) return;
    setEnviando(true);
    try {
      await authService.registrarCoordinador(invitacion.codigo, form.valores);
      mostrar({ tipo: 'exito', titulo: 'Cuenta de coordinación creada', mensaje: 'Ya puedes iniciar sesión con tu correo institucional.' });
      navigate('/login', { replace: true });
    } catch (err) {
      setErrorGeneral(err.message);
      form.setErrores(err.campos ?? {});
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PageLayout
      navExtra={{ to: '/registro/coordinador', label: 'Crear cuenta' }}
      accionesPublicas={<Link to="/login" className="btn btn--outline">Iniciar sesión</Link>}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <PageHead
          migas="Inicio · Crear cuenta · Coordinación"
          titulo="Crear cuenta de coordinación"
          descripcion="Solo con una invitación emitida por la coordinación TFC. El código vence a los 7 días y sirve una sola vez."
        />

        {!invitacion && (
          <form className="card" onSubmit={onBuscar} noValidate>
            <div className="stack" style={{ gap: 16 }}>
              {errorInvitacion && <Alert>{errorInvitacion}</Alert>}
              <TextField
                label="Código de invitación"
                placeholder="INV-XXXX-XXXX"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                hint="Lo encuentras en el correo de invitación."
              />
              <div className="form-actions" style={{ marginTop: 0 }}>
                <Link to="/login" className="btn btn--ghost">Volver a iniciar sesión</Link>
                <button type="submit" className="btn btn--primary" disabled={consultando}>
                  {consultando ? 'Verificando…' : 'Validar invitación'}
                </button>
              </div>
            </div>
          </form>
        )}

        {invitacion && (
          <form className="card" onSubmit={onSubmit} noValidate>
            <div className="stack" style={{ gap: 16 }}>
              <Alert tipo="success">Invitación {invitacion.codigo} válida para {invitacion.correo}.</Alert>
              {errorGeneral && <Alert>{errorGeneral}</Alert>}
              <div className="form-grid">
                <TextField label="Correo institucional" value={invitacion.correo} readOnly hint="Definido por la invitación" className="span-all" />
                <TextField label="Nombres" autoComplete="given-name" {...form.props('nombres')} />
                <TextField label="Apellidos" autoComplete="family-name" {...form.props('apellidos')} />
                <PasswordField label="Contraseña" autoComplete="new-password" {...form.props('password')} />
                <PasswordField label="Confirmar contraseña" autoComplete="new-password" {...form.props('confirmacion')} />
                <div className="span-all"><PasswordRules valor={form.valores.password} /></div>
              </div>
            </div>
            <div className="form-actions">
              <Link to="/" className="btn btn--ghost">Cancelar</Link>
              <button type="submit" className="btn btn--primary" disabled={enviando}>
                {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}

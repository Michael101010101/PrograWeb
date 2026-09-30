import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { PasswordField } from '../../shared/components/FormField.jsx';
import Stepper from '../components/Stepper.jsx';
import PasswordRules from '../components/PasswordRules.jsx';
import useFormulario from '../components/useFormulario.js';
import * as authService from '../services/authService.js';
import { CONTACTO } from '../../shared/config/periodo.js';
import { validarConfirmacion, validarPassword } from '../utils/validators.js';

const validar = (v) =>
  Object.fromEntries(
    Object.entries({ nueva: validarPassword(v.nueva), confirmacion: validarConfirmacion(v.nueva, v.confirmacion) }).filter(([, e]) => e)
  );

/** Recuperar contraseña · paso 3: se llega desde el enlace del correo. */
export default function NuevaPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const [estado, setEstado] = useState({ cargando: true });
  const [guardando, setGuardando] = useState(false);
  const form = useFormulario({ nueva: '', confirmacion: '' }, validar);

  useEffect(() => {
    authService
      .validarEnlaceRecuperacion(token)
      .then((r) => setEstado({ correo: r.correo }))
      .catch((err) => setEstado({ error: err.message }));
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.validarTodo()) return;
    setGuardando(true);
    try {
      await authService.restablecerPassword(token, form.valores.nueva, form.valores.confirmacion);
      mostrar({ tipo: 'exito', titulo: 'Contraseña guardada', mensaje: 'Ya puedes iniciar sesión con tu nueva contraseña.' });
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.campos) form.setErrores(err.campos);
      else setEstado({ error: err.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <PageLayout
      navExtra={{ to: `/recuperar/${token}`, label: 'Recuperar contraseña' }}
      accionesPublicas={<Link to="/login" className="btn btn--outline">Iniciar sesión</Link>}
      footerDetalle={`Universidad de Lima · Oficina de Trabajos de Fin de Carrera · Mesa de ayuda anexo ${CONTACTO.mesaAyuda}`}
      centrado
    >
      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        {estado.cargando && <p className="text-muted">Verificando el enlace…</p>}

        {estado.error && (
          <div className="card">
            <EmptyState icono="!" tono="warning" titulo="No podemos usar este enlace" texto={estado.error}>
              <Link to="/recuperar" className="btn btn--primary">Solicitar otro enlace</Link>
            </EmptyState>
          </div>
        )}

        {estado.correo && (
          <form className="card stack" style={{ gap: 16 }} onSubmit={onSubmit} noValidate>
            <Stepper paso={3} compacto />
            <p className="text-label" style={{ color: 'var(--primary-dark)' }}>Paso 3 de 3 · Nueva contraseña</p>
            <div>
              <h2>Crea tu nueva contraseña</h2>
              <p className="text-muted text-aux">Cuenta {estado.correo}</p>
            </div>
            <PasswordField label="Nueva contraseña" autoComplete="new-password" {...form.props('nueva')} />
            <PasswordField label="Confirmar contraseña" autoComplete="new-password" {...form.props('confirmacion')} />
            <PasswordRules valor={form.valores.nueva} />
            <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}

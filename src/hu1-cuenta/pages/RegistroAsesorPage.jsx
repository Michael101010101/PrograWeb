import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import Alert from '../../shared/components/Alert.jsx';
import Modal from '../../shared/components/Modal.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { PasswordField, SelectField, TextField } from '../../shared/components/FormField.jsx';
import useFormulario from '../components/useFormulario.js';
import * as authService from '../services/authService.js';
import { catalogos } from '../services/localStore.js';
import { validarRegistroAsesor } from '../utils/validators.js';
import { CONTACTO } from '../../shared/config/periodo.js';

const INICIAL = {
  nombres: '', apellidos: '', correo: '', password: '', confirmacion: '', gradoAcademico: '', departamento: '',
};

export default function RegistroAsesorPage() {
  const navigate = useNavigate();
  const form = useFormulario(INICIAL, validarRegistroAsesor);
  const { props, valores } = form;
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [creado, setCreado] = useState(null);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    if (!form.validarTodo()) {
      setErrorGeneral('No pudimos enviar la solicitud: corrige los campos marcados.');
      return;
    }
    setEnviando(true);
    try {
      setCreado(await authService.registrarAsesor(valores));
    } catch (err) {
      setErrorGeneral(err.message);
      form.setErrores(err.campos ?? {});
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PageLayout
      navExtra={{ to: '/registro/asesor', label: 'Crear cuenta' }}
      accionesPublicas={<Link to="/login" className="btn btn--outline">Iniciar sesión</Link>}
      footerDetalle={`Universidad de Lima · Oficina de Trabajos de Fin de Carrera · Consultas sobre cuentas de docentes: anexo ${CONTACTO.anexo}`}
    >
      <PageHead
        migas="Inicio · Crear cuenta · Asesor"
        titulo="Crear cuenta de asesor"
        descripcion="La coordinación validará tu registro antes de habilitar cupos y solicitudes de asesoría."
      />

      <div className="layout-aside">
        <form className="card" onSubmit={onSubmit} noValidate>
          {errorGeneral && <div style={{ marginBottom: 16 }}><Alert>{errorGeneral}</Alert></div>}

          <h3 className="text-label form-section-title">Datos del docente</h3>
          <div className="form-grid">
            <TextField label="Nombres" autoComplete="given-name" {...props('nombres')} />
            <TextField label="Apellidos" autoComplete="family-name" {...props('apellidos')} />
            <TextField label="Correo institucional" type="email" autoComplete="email" placeholder="usuario@ulima.edu.pe" hint="Debe terminar en @ulima.edu.pe" className="span-all" {...props('correo')} />
            <PasswordField label="Contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres, una mayúscula y un número" {...props('password')} />
            <PasswordField label="Confirmar contraseña" autoComplete="new-password" {...props('confirmacion')} />
          </div>

          <hr className="divider" />
          <h3 className="text-label form-section-title">Datos académicos</h3>
          <div className="form-grid">
            <SelectField label="Grado académico" opciones={catalogos.gradosAcademicos} placeholder="Selecciona tu grado" {...props('gradoAcademico')} />
            <SelectField label="Departamento" opciones={catalogos.departamentos} placeholder="Selecciona tu departamento" {...props('departamento')} />
          </div>
          <p className="field__hint" style={{ marginTop: 12 }}>
            Tus líneas de investigación y tu cupo máximo se definen luego en tu ficha, cuando la coordinación apruebe la cuenta.
          </p>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => (form.modificado ? setConfirmarSalida(true) : navigate('/'))}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar solicitud de cuenta'}
            </button>
          </div>
        </form>

        <aside className="layout-aside__side">
          <div className="card card--warning">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, marginBottom: 6, color: 'inherit' }}>Validación por coordinación</h3>
            <p style={{ fontSize: 14 }}>
              Tu cuenta queda en estado «Pendiente de validación». La coordinación responde en un plazo de 2 días hábiles y
              te notifica por correo.
            </p>
          </div>
          <div className="card">
            <p className="text-label" style={{ marginBottom: 8 }}>Como asesor podrás</p>
            <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, gap: 8 }}>
              <li>Definir tus líneas y tu cupo máximo</li>
              <li>Aceptar o rechazar solicitudes de asesoría</li>
              <li>Definir el plan de entregables de cada trabajo</li>
              <li>Aprobar u observar los avances entregados</li>
            </ul>
          </div>
        </aside>
      </div>

      <Modal abierto={Boolean(creado)} titulo="Solicitud enviada" centrado cerrable={false}>
        <div className="empty-state__icon empty-state__icon--warning" style={{ margin: '0 auto' }} aria-hidden="true">!</div>
        <p className="text-muted">
          Registramos tu cuenta con el correo {creado?.usuario.correo}. Queda pendiente de validación: la coordinación te
          avisará por correo cuando puedas ingresar.
        </p>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </Modal>

      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="¿Salir sin enviar la solicitud?"
        mensaje="Se perderán los datos que ingresaste en el formulario."
        textoConfirmar="Salir sin guardar"
        textoCancelar="Seguir editando"
        onConfirmar={() => navigate('/')}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </PageLayout>
  );
}

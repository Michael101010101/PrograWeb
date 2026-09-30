import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import Alert from '../../shared/components/Alert.jsx';
import Modal from '../../shared/components/Modal.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { PasswordField, SelectField, TextField } from '../../shared/components/FormField.jsx';
import useFormulario from '../components/useFormulario.js';
import DemoLink from '../components/DemoLink.jsx';
import * as authService from '../services/authService.js';
import { catalogos } from '../services/localStore.js';
import { validarRegistroEstudiante } from '../utils/validators.js';

const INICIAL = {
  nombres: '', apellidos: '', correo: '', password: '', confirmacion: '',
  carrera: '', ciclo: '', codigoAlumno: '', aceptaReglamento: false,
};

export default function RegistroEstudiantePage() {
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const form = useFormulario(INICIAL, validarRegistroEstudiante);
  const { props, valores, onChange, errores } = form;
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [creado, setCreado] = useState(null);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    if (!form.validarTodo()) {
      setErrorGeneral('No pudimos crear la cuenta: corrige los campos marcados.');
      return;
    }
    setEnviando(true);
    try {
      const r = await authService.registrarEstudiante(valores);
      setCreado(r);
    } catch (err) {
      setErrorGeneral(err.message);
      form.setErrores(err.campos ?? {});
    } finally {
      setEnviando(false);
    }
  };

  const reenviar = async () => {
    try {
      const r = await authService.reenviarVerificacion(creado.usuario.id);
      setCreado((prev) => ({ ...prev, enlaceDemo: r.enlaceDemo }));
      mostrar({ tipo: 'exito', titulo: 'Correo reenviado', mensaje: `Enviamos un nuevo enlace a ${r.correo}.` });
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo reenviar', mensaje: err.message });
    }
  };

  const cancelar = () => (form.modificado ? setConfirmarSalida(true) : navigate('/'));

  return (
    <PageLayout
      navExtra={{ to: '/registro/estudiante', label: 'Crear cuenta' }}
      accionesPublicas={<Link to="/login" className="btn btn--outline">Iniciar sesión</Link>}
      footerDetalle="Universidad de Lima · Oficina de Trabajos de Fin de Carrera · Los datos se usan solo para el seguimiento académico"
    >
      <PageHead
        migas="Inicio · Crear cuenta · Estudiante"
        titulo="Crear cuenta de estudiante"
        descripcion="Solo con correo institucional @aloe.ulima.edu.pe. Recibirás un enlace de verificación válido por 24 horas."
      />

      <div className="layout-aside">
        <form className="card" onSubmit={onSubmit} noValidate>
          {errorGeneral && <div style={{ marginBottom: 16 }}><Alert>{errorGeneral}</Alert></div>}

          <h3 className="text-label form-section-title">Datos personales</h3>
          <div className="form-grid">
            <TextField label="Nombres" autoComplete="given-name" {...props('nombres')} />
            <TextField label="Apellidos" autoComplete="family-name" {...props('apellidos')} />
            <TextField label="Correo institucional" type="email" autoComplete="email" placeholder="usuario@aloe.ulima.edu.pe" className="span-all" {...props('correo')} />
            <PasswordField label="Contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres, una mayúscula y un número" {...props('password')} />
            <PasswordField label="Confirmar contraseña" autoComplete="new-password" {...props('confirmacion')} />
          </div>

          <hr className="divider" />
          <h3 className="text-label form-section-title">Datos académicos</h3>
          <div className="form-grid form-grid--3">
            <SelectField label="Carrera" opciones={catalogos.carreras} placeholder="Selecciona tu carrera" {...props('carrera')} />
            <SelectField label="Ciclo" opciones={catalogos.ciclos} placeholder="Selecciona tu ciclo" {...props('ciclo')} />
            <TextField label="Código de alumno" inputMode="numeric" maxLength={8} placeholder="20211357" {...props('codigoAlumno')} />
          </div>

          <div style={{ marginTop: 20 }}>
            <label className="checkbox">
              <input type="checkbox" name="aceptaReglamento" checked={valores.aceptaReglamento} onChange={onChange} />
              Acepto el reglamento de trabajos de fin de carrera y el tratamiento de mis datos
            </label>
            {errores.aceptaReglamento && <p className="field__error" style={{ marginTop: 6 }}>{errores.aceptaReglamento}</p>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={cancelar}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <aside className="layout-aside__side">
          <div className="card card--soft">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, marginBottom: 6 }}>Qué pasa después</h3>
            <p style={{ fontSize: 14 }}>
              Verificas tu correo, ingresas y registras tu trabajo. Luego podrás agregar hasta dos compañeros y solicitar
              asesor entre quienes tengan cupo en tu línea de investigación.
            </p>
          </div>
          <div className="card">
            <p className="text-label" style={{ marginBottom: 8 }}>Requisitos</p>
            <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, gap: 8 }}>
              <li>Estar matriculado en el ciclo 2026-2</li>
              <li>Haber aprobado el curso Seminario de Investigación</li>
              <li>No tener otro trabajo de fin de carrera vigente</li>
            </ul>
          </div>
          <div className="card">
            <p className="text-label" style={{ marginBottom: 6 }}>¿Eres docente?</p>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 12 }}>
              Crea tu cuenta de asesor; la coordinación validará tu registro antes de habilitar cupos.
            </p>
            <Link to="/registro/asesor" className="btn btn--outline btn--block">Crear cuenta de asesor</Link>
          </div>
        </aside>
      </div>

      <Modal abierto={Boolean(creado)} titulo="Cuenta creada" centrado cerrable={false}>
        <div className="empty-state__icon" style={{ margin: '0 auto' }} aria-hidden="true">✓</div>
        <p className="text-muted">
          Enviamos un enlace de verificación a {creado?.usuario.correo}. Tienes 24 horas para activarlo.
        </p>
        <DemoLink to={creado?.enlaceDemo} texto="Abrir enlace de verificación" />
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={() => navigate('/login')}>Ir a iniciar sesión</button>
          <button className="link-button" onClick={reenviar}>Reenviar el correo</button>
        </div>
      </Modal>

      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="¿Salir sin crear la cuenta?"
        mensaje="Se perderán los datos que ingresaste en el formulario."
        textoConfirmar="Salir sin guardar"
        textoCancelar="Seguir editando"
        onConfirmar={() => navigate('/')}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </PageLayout>
  );
}

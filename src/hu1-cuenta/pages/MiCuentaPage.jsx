import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { PasswordField, SelectField, TextField } from '../../shared/components/FormField.jsx';
import useFormulario from '../components/useFormulario.js';
import PasswordRules from '../components/PasswordRules.jsx';
import * as authService from '../services/authService.js';
import { catalogos } from '../services/localStore.js';
import { validarCambioPassword, validarPerfil } from '../utils/validators.js';
import { ROL_INFO } from '../../shared/config/roles.js';
import { obtenerTrabajoVigente } from '../../shared/integraciones.js';

const SECCIONES = [
  ['datos-personales', 'Datos personales'],
  ['datos-academicos', 'Datos académicos'],
  ['cambiar-password', 'Cambiar contraseña'],
  ['notificaciones', 'Notificaciones'],
];

const NOTIFICACIONES = [
  ['notif_entregables', 'Vencimientos de entregables', 'Aviso 3 días antes de cada fecha límite.'],
  ['notif_retroalimentacion', 'Revisiones y comentarios', 'Cuando se aprueba u observa un avance.'],
  ['notif_resumenSemanal', 'Resumen semanal', 'Los lunes, un correo con el estado de tus trabajos.'],
];

function valoresDesde(u) {
  return {
    nombres: u.nombres,
    apellidos: u.apellidos,
    telefono: u.telefono ?? '',
    carrera: u.carrera ?? '',
    ciclo: u.ciclo ?? '',
    gradoAcademico: u.gradoAcademico ?? '',
    departamento: u.departamento ?? '',
    notif_entregables: Boolean(u.notificaciones?.entregables),
    notif_retroalimentacion: Boolean(u.notificaciones?.retroalimentacion),
    notif_resumenSemanal: Boolean(u.notificaciones?.resumenSemanal),
    password_actual: '',
    password_nueva: '',
    password_confirmacion: '',
  };
}

export default function MiCuentaPage() {
  const { usuario, actualizarUsuario } = useAuth();
  const { mostrar } = useToast();
  const [guardando, setGuardando] = useState(false);
  const [confirmarDescarte, setConfirmarDescarte] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES[0][0]);

  const validar = useMemo(
    () => (v) => {
      const pwd = validarCambioPassword({ actual: v.password_actual, nueva: v.password_nueva, confirmacion: v.password_confirmacion });
      return {
        ...validarPerfil(v, usuario.rol),
        ...Object.fromEntries(Object.entries(pwd).map(([k, e]) => [`password_${k}`, e])),
      };
    },
    [usuario.rol]
  );

  const form = useFormulario(valoresDesde(usuario), validar);
  const { props, valores, onChange } = form;
  const trabajo = usuario.rol === 'estudiante' ? obtenerTrabajoVigente(usuario.id) : null;

  const guardar = async () => {
    if (!form.validarTodo()) {
      mostrar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: 'Revisa los campos marcados en rojo.' });
      return;
    }
    setGuardando(true);
    try {
      const perfil = {
        ...valores,
        notificaciones: {
          entregables: valores.notif_entregables,
          retroalimentacion: valores.notif_retroalimentacion,
          resumenSemanal: valores.notif_resumenSemanal,
        },
      };
      const { usuario: actualizado, cambioClave } = await authService.actualizarCuenta(usuario.id, perfil, {
        actual: valores.password_actual,
        nueva: valores.password_nueva,
        confirmacion: valores.password_confirmacion,
      });
      actualizarUsuario(actualizado);
      form.reiniciar(valoresDesde(actualizado));
      mostrar({
        tipo: 'exito',
        titulo: 'Cambios guardados',
        mensaje: cambioClave ? 'Tus datos y tu contraseña se actualizaron.' : 'Tus datos se actualizaron.',
      });
    } catch (err) {
      form.setErrores(err.campos ?? {});
      mostrar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const irA = (id) => {
    setSeccionActiva(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const descartar = () => {
    form.reiniciar(valoresDesde(usuario));
    setConfirmarDescarte(false);
    mostrar({ tipo: 'aviso', titulo: 'Cambios descartados', mensaje: 'Se restauraron tus datos guardados.' });
  };

  return (
    <PageLayout>
      <PageHead
        migas="Inicio · Mi cuenta"
        titulo="Mi cuenta"
        acciones={
          <>
            <button className="btn btn--ghost" onClick={() => setConfirmarDescarte(true)} disabled={!form.modificado || guardando}>
              Descartar cambios
            </button>
            <button className="btn btn--primary" onClick={guardar} disabled={!form.modificado || guardando}>
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </>
        }
      />

      <div className="cuenta-layout">
        <aside className="card cuenta-menu">
          <nav aria-label="Secciones de mi cuenta">
            {SECCIONES.map(([id, texto]) => (
              <button key={id} className={`cuenta-menu__item ${seccionActiva === id ? 'is-active' : ''}`} onClick={() => irA(id)}>
                {texto}
              </button>
            ))}
            {usuario.rol === 'coordinador' && (
              <Link to="/admin/invitaciones" className="cuenta-menu__item">Invitar a coordinación</Link>
            )}
          </nav>
          <div className="cuenta-menu__rol">
            <p className="text-label">Rol de la sesión</p>
            <p style={{ fontSize: 14 }}>{ROL_INFO[usuario.rol].label} · {ROL_INFO[usuario.rol].detalle}</p>
            <p className="text-muted text-aux">
              El rol{usuario.rol === 'estudiante' ? ' y el código de alumno' : ''} solo los cambia la coordinación.
            </p>
          </div>
        </aside>

        <div>
          <section id="datos-personales" className="card">
            <h2 className="card__title">Datos personales</h2>
            <div className="form-grid form-grid--4">
              <TextField label="Nombres" autoComplete="given-name" {...props('nombres')} />
              <TextField label="Apellidos" autoComplete="family-name" {...props('apellidos')} />
              <TextField label="Correo institucional" value={usuario.correo} readOnly hint="No editable" />
              <TextField label="Teléfono" type="tel" inputMode="numeric" placeholder="987 654 321" hint="Opcional" {...props('telefono')} />
            </div>
          </section>

          <section id="datos-academicos" className="card">
            <h2 className="card__title">Datos académicos</h2>
            {usuario.rol === 'estudiante' && (
              <div className="form-grid form-grid--4">
                <SelectField label="Carrera" opciones={catalogos.carreras} {...props('carrera')} />
                <SelectField label="Ciclo" opciones={catalogos.ciclos} {...props('ciclo')} />
                <TextField label="Código de alumno" value={usuario.codigoAlumno} readOnly />
                <TextField label="Trabajo vigente" value={trabajo?.codigo ?? 'Sin trabajo registrado'} readOnly />
              </div>
            )}
            {usuario.rol === 'asesor' && (
              <div className="form-grid form-grid--4">
                <SelectField label="Grado académico" opciones={catalogos.gradosAcademicos} {...props('gradoAcademico')} />
                <SelectField label="Departamento" opciones={catalogos.departamentos} {...props('departamento')} />
                <TextField label="Estado de la cuenta" value="Validada por coordinación" readOnly className="span-all" />
              </div>
            )}
            {usuario.rol === 'coordinador' && (
              <div className="form-grid form-grid--4">
                <TextField label="Cargo" value={usuario.cargo ?? 'Coordinación TFC'} readOnly />
              </div>
            )}
          </section>

          <section id="cambiar-password" className="card">
            <h2 className="card__title">Cambiar contraseña</h2>
            <div className="form-grid form-grid--4">
              <PasswordField label="Contraseña actual" autoComplete="current-password" {...props('password_actual')} />
              <PasswordField label="Nueva contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres" {...props('password_nueva')} />
              <PasswordField label="Confirmar" autoComplete="new-password" {...props('password_confirmacion')} />
              <PasswordRules valor={valores.password_nueva} />
            </div>
            <p className="field__hint" style={{ marginTop: 10 }}>Deja estos campos vacíos si no quieres cambiar tu contraseña.</p>
          </section>

          <section id="notificaciones" className="card">
            <h2 className="card__title">Notificaciones por correo</h2>
            <div className="stack" style={{ gap: 14 }}>
              {NOTIFICACIONES.map(([name, titulo, detalle]) => (
                <label key={name} className="checkbox">
                  <input type="checkbox" name={name} checked={valores[name]} onChange={onChange} />
                  <span>
                    {titulo}
                    <br />
                    <span className="text-muted text-aux">{detalle}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        abierto={confirmarDescarte}
        titulo="¿Descartar los cambios?"
        mensaje="Se perderán las modificaciones que no guardaste."
        textoConfirmar="Descartar cambios"
        textoCancelar="Seguir editando"
        onConfirmar={descartar}
        onCancelar={() => setConfirmarDescarte(false)}
      />
    </PageLayout>
  );
}

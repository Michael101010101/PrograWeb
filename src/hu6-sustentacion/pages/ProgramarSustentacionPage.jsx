import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import {
  alternativasLibres,
  bloquesDeSala,
  buscarSustentacion,
  buscarTrabajo,
  estaPendiente,
  miembrosOcupados,
  ocupanteDeSala,
  resumenPeriodo,
  textoSala,
  trabajosPorProgramar,
} from '../services/sustentacionesService.js';
import { HORAS, MODALIDADES, SALAS, VENTANA } from '../data/datosSemilla.js';
import { diaSemana, formatearCorta, formatearFecha, horaFin } from '../utils/fechas.js';
import { SlotDato } from '../components/SlotsCabecera.jsx';
import Segmentado from '../components/Segmentado.jsx';
import BloquesSala from '../components/BloquesSala.jsx';
import ResumenPeriodo from '../components/ResumenPeriodo.jsx';
import ModalSalaOcupada from '../components/modales/ModalSalaOcupada.jsx';
import '../styles/hu6.css';

/**
 * 6.1 Programar sustentación (diapositivas 41 y 47) · rol Administrador.
 * Rutas: /admin/sustentaciones/programar          → elige el trabajo
 *        /admin/sustentaciones/programar/:codigo  → trabajo ya elegido (desde el listado)
 *        /admin/sustentaciones/:id/reprogramar    → cambia fecha, hora o sala (pide motivo)
 */
export default function ProgramarSustentacionPage() {
  const { codigo, id } = useParams();
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const { datos, programar, reprogramar } = useSustentaciones();

  const actual = id ? buscarSustentacion(datos, id) : null; // solo al reprogramar
  const esReprogramacion = Boolean(id);
  const disponibles = trabajosPorProgramar(datos);

  // Estado del formulario (valores iniciales como en el mockup)
  const [form, setForm] = useState(() => ({
    trabajoCodigo: actual?.trabajoCodigo ?? codigo ?? disponibles[0]?.codigo ?? '',
    fecha: actual?.fecha ?? '2026-12-11',
    hora: actual?.hora ?? '10:00',
    salaId: actual?.salaId ?? 'A-402',
    modalidad: actual?.modalidad ?? 'Presencial',
    motivo: '',
  }));
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  const cambiar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    setError('');
  };

  const pagina = (contenido) => (
    <PageLayout
      headerSlot={<SlotDato etiqueta="Periodo" valor="2026-2" />}
      navInfo={`Ventana de sustentaciones ${formatearCorta(VENTANA.inicio)} – ${formatearCorta(VENTANA.fin)}`}
      footerDetalle="coordinación TFC 2026-2"
    >
      {contenido}
    </PageLayout>
  );

  // Casos sin formulario
  if (esReprogramacion && (!actual || !estaPendiente(actual))) {
    return pagina(
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState icono="?" titulo="No se puede reprogramar" texto="La sustentación no existe o ya fue realizada.">
          <Link to="/admin/sustentaciones" className="btn btn--outline">Volver a sustentaciones</Link>
        </EmptyState>
      </div>
    );
  }
  if (!esReprogramacion && disponibles.length === 0) {
    return pagina(
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState icono="✓" titulo="No hay trabajos concluidos por programar" texto="Todos los trabajos concluidos ya tienen fecha de sustentación.">
          <Link to="/admin/sustentaciones" className="btn btn--outline">Ver calendario</Link>
        </EmptyState>
      </div>
    );
  }

  const trabajo = buscarTrabajo(datos, form.trabajoCodigo);
  const virtual = form.modalidad === 'Virtual';
  const sala = SALAS.find((s) => s.id === form.salaId);

  // Disponibilidad calculada en cada render (se actualiza al cambiar cualquier campo)
  const fueraDeVentana = form.fecha < VENTANA.inicio || form.fecha > VENTANA.fin;
  const esDomingo = form.fecha && diaSemana(form.fecha) === 'Domingo';
  const ocupante = !virtual ? ocupanteDeSala(datos, form, id) : null;
  const juradoOcupado = actual ? miembrosOcupados(datos, actual.jurado, form.fecha, form.hora, id) : [];

  let aviso;
  if (!form.fecha || fueraDeVentana) {
    aviso = <Alert tipo="error">La fecha debe estar dentro de la ventana {formatearFecha(VENTANA.inicio)} – {formatearFecha(VENTANA.fin)}.</Alert>;
  } else if (esDomingo) {
    aviso = <Alert tipo="error">El {formatearFecha(form.fecha)} es domingo: no se programan sustentaciones.</Alert>;
  } else if (ocupante) {
    aviso = <Alert tipo="error">La sala {form.salaId} está ocupada el {formatearFecha(form.fecha)} de {form.hora} a {horaFin(form.hora)} por {ocupante}.</Alert>;
  } else if (juradoOcupado.length > 0) {
    aviso = <Alert tipo="warning">{juradoOcupado.join(', ')} ya tiene otra sustentación en ese bloque.</Alert>;
  } else {
    aviso = (
      <Alert tipo="success">
        {virtual ? 'La sustentación será virtual: no requiere sala.' : `La sala ${form.salaId} está libre el ${formatearFecha(form.fecha)} de ${form.hora} a ${horaFin(form.hora)}.`}{' '}
        Ningún miembro del jurado tiene otra sustentación en ese bloque.
      </Alert>
    );
  }

  const enviar = () => {
    // Si la sala está ocupada se muestra el modal con alternativas (diapositiva 47)
    if (ocupante) {
      setModalAbierto(true);
      return;
    }
    try {
      if (esReprogramacion) {
        reprogramar(id, form);
        mostrar({ tipo: 'exito', titulo: 'Sustentación reprogramada', mensaje: 'Se notificó al equipo, al asesor y al jurado.' });
        navigate('/admin/sustentaciones');
      } else {
        const nuevaId = programar(form);
        mostrar({ tipo: 'exito', titulo: 'Sustentación programada', mensaje: 'Ahora conforma el jurado (paso 2 de 3).' });
        navigate(`/admin/sustentaciones/${nuevaId}/jurado`);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const usarAlternativa = (alt) => {
    setForm({ ...form, salaId: alt.salaId, hora: alt.hora, fecha: alt.fecha });
    setModalAbierto(false);
  };

  return pagina(
    <>
      <PageHead
        migas={`Sustentaciones · ${esReprogramacion ? 'Reprogramar' : 'Programar'}`}
        titulo={esReprogramacion ? 'Reprogramar sustentación' : 'Programar sustentación'}
        descripcion="Solo los trabajos en estado Concluido pueden programarse. La sala no puede tener dos sustentaciones a la misma hora."
      />

      <div className="hu6-layout">
        <section className="card hu6-form-card hu6-form">
          <div className="field">
            <label className="field__label" htmlFor="hu6-trabajo">Trabajo concluido</label>
            <select
              id="hu6-trabajo"
              className="select"
              style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}
              value={form.trabajoCodigo}
              disabled={esReprogramacion}
              onChange={(e) => cambiar('trabajoCodigo', e.target.value)}
            >
              {(esReprogramacion ? [trabajo] : disponibles).map((t) => (
                <option key={t.codigo} value={t.codigo}>{t.titulo}</option>
              ))}
            </select>
            <span className="field__hint">
              {esReprogramacion ? `Programada para el ${formatearFecha(actual.fecha)} a las ${actual.hora}` : `${disponibles.length} trabajos concluidos disponibles`}
              {' '}· asesor {trabajo.asesor} · equipo de {trabajo.equipo.length} {trabajo.equipo.length === 1 ? 'integrante' : 'integrantes'}
            </span>
          </div>

          <div className="hu6-fila">
            <div className="field">
              <label className="field__label" htmlFor="hu6-fecha">Fecha</label>
              <input
                id="hu6-fecha"
                className="input"
                type="date"
                min={VENTANA.inicio}
                max={VENTANA.fin}
                value={form.fecha}
                onChange={(e) => cambiar('fecha', e.target.value)}
              />
              <span className="field__hint">Dentro de la ventana {formatearFecha(VENTANA.inicio)} – {formatearFecha(VENTANA.fin)}</span>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="hu6-hora">Hora</label>
              <select id="hu6-hora" className="select" value={form.hora} onChange={(e) => cambiar('hora', e.target.value)}>
                {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="field__hint">Bloques de 60 minutos</span>
            </div>
          </div>

          <div className="hu6-fila">
            <div className="field">
              <label className="field__label" htmlFor="hu6-sala">Sala</label>
              <select id="hu6-sala" className="select" value={virtual ? '' : form.salaId} disabled={virtual} onChange={(e) => cambiar('salaId', e.target.value)}>
                {virtual && <option value="">No requiere sala</option>}
                {SALAS.map((s) => <option key={s.id} value={s.id}>{textoSala(s)}</option>)}
              </select>
            </div>
            <div className="field">
              <span className="field__label">Modalidad</span>
              <Segmentado etiqueta="Modalidad" opciones={MODALIDADES} valor={form.modalidad} onCambiar={(m) => cambiar('modalidad', m)} />
            </div>
          </div>

          {aviso}

          {esReprogramacion && (
            <div className="field">
              <label className="field__label" htmlFor="hu6-motivo">Motivo de la reprogramación (obligatorio)</label>
              <textarea
                id="hu6-motivo"
                className="textarea"
                placeholder="Explica el motivo para el equipo y el jurado..."
                value={form.motivo}
                onChange={(e) => cambiar('motivo', e.target.value)}
              />
            </div>
          )}

          <div className="hu6-caja-gris">
            <p className="text-label" style={{ marginBottom: 6 }}>Notificaciones al guardar</p>
            <p>Se notificará al equipo, al asesor y a los tres miembros del jurado con la fecha, hora, sala y modalidad.</p>
          </div>

          {error && <Alert tipo="error">{error}</Alert>}

          <div className="hu6-acciones">
            <Link to="/admin/sustentaciones" className="btn btn--ghost">Cancelar</Link>
            <button type="button" className="btn btn--primary btn--lg" onClick={enviar}>
              {esReprogramacion ? 'Guardar reprogramación' : 'Programar y conformar jurado'}
            </button>
          </div>
        </section>

        <aside className="hu6-columna">
          {!virtual && sala && form.fecha && (
            <BloquesSala
              titulo={`Sala ${sala.id} · ${formatearFecha(form.fecha)}`}
              bloques={bloquesDeSala(datos, sala.id, form.fecha, id)}
              horaSeleccionada={form.hora}
              onElegir={(hora) => cambiar('hora', hora)}
            />
          )}
          <ResumenPeriodo resumen={resumenPeriodo(datos)} />
        </aside>
      </div>

      {modalAbierto && (
        <ModalSalaOcupada
          salaId={form.salaId}
          fecha={form.fecha}
          hora={form.hora}
          ocupante={ocupante}
          alternativas={alternativasLibres(datos, form, id)}
          onUsar={usarAlternativa}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}

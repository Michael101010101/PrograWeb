import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import {
  buscarDocente,
  buscarSustentacion,
  buscarTrabajo,
  cargaJurado,
  estaPendiente,
  evaluarJurado,
  miembrosOcupados,
  nombreDocente,
} from '../services/sustentacionesService.js';
import { formatearFecha } from '../utils/fechas.js';
import { SlotDato } from '../components/SlotsCabecera.jsx';
import '../styles/hu6.css';

/** 6.2 Conformación del jurado · con advertencia de conflicto (diapositiva 42) · rol Administrador. */
export default function ConformarJuradoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const { datos, guardarJurado } = useSustentaciones();
  const sustentacion = buscarSustentacion(datos, id);

  // Copia local del jurado: solo se guarda al pulsar "Confirmar jurado"
  const [jurado, setJurado] = useState(sustentacion?.jurado ?? []);
  const [error, setError] = useState('');

  if (!sustentacion) {
    return (
      <PageLayout footerDetalle="coordinación TFC 2026-2">
        <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <EmptyState icono="?" titulo="Sustentación no encontrada">
            <Link to="/admin/sustentaciones" className="btn btn--outline">Volver a sustentaciones</Link>
          </EmptyState>
        </div>
      </PageLayout>
    );
  }

  const trabajo = buscarTrabajo(datos, sustentacion.trabajoCodigo);
  const editable = estaPendiente(sustentacion);
  const resumenFecha = `${formatearFecha(sustentacion.fecha)} · ${sustentacion.hora} · ${sustentacion.salaId ?? 'virtual'}`;
  const asesor = buscarDocente(datos, trabajo.asesorId);
  const conflictoDe = (docenteId) => trabajo.conflictos.find((c) => c.docenteId === docenteId);
  const estaEnJurado = (docenteId) => jurado.some((m) => m.docenteId === docenteId);

  // Docentes ordenados por carga de jurados; el asesor va al final
  const docentes = [...datos.docentes].sort((a, b) => {
    if (a.id === trabajo.asesorId) return 1;
    if (b.id === trabajo.asesorId) return -1;
    return cargaJurado(datos, a.id) - cargaJurado(datos, b.id);
  });

  const { errores, cumplidos } = evaluarJurado(datos, trabajo, jurado);

  // ─── Acciones sobre la copia local ───
  const agregar = (docenteId) => {
    if (jurado.length >= 3) return;
    // El primero que se agrega queda como presidente (se puede cambiar después)
    setJurado([...jurado, { docenteId, presidente: jurado.length === 0 }]);
    setError('');
  };
  const quitar = (docenteId) => {
    const resto = jurado.filter((m) => m.docenteId !== docenteId);
    // Si se quitó al presidente, el primero que queda pasa a serlo
    if (resto.length > 0 && !resto.some((m) => m.presidente)) resto[0] = { ...resto[0], presidente: true };
    setJurado(resto);
    setError('');
  };
  const designarPresidente = (docenteId) => {
    setJurado(jurado.map((m) => ({ ...m, presidente: m.docenteId === docenteId })));
  };

  const confirmar = () => {
    try {
      guardarJurado(id, jurado);
      mostrar({ tipo: 'exito', titulo: 'Jurado confirmado', mensaje: 'Se notificó a los tres miembros, al equipo y al asesor.' });
      navigate('/admin/sustentaciones');
    } catch (e) {
      setError(e.message);
    }
  };

  // Texto de la advertencia superior (asesor y posibles conflictos)
  const advertencias = [
    asesor && `El ${nombreDocente(asesor)} es el asesor del trabajo: no puede integrar el jurado.`,
    ...trabajo.conflictos.map((c) => {
      const d = buscarDocente(datos, c.docenteId);
      return `${d.titulo === 'Dra.' ? 'La' : 'El'} ${nombreDocente(d)} ${c.motivo}; revisa el posible conflicto antes de agregarl${d.titulo === 'Dra.' ? 'a' : 'o'}.`;
    }),
  ].filter(Boolean);

  // Botón de cada docente según su situación
  const botonDocente = (d) => {
    if (d.id === trabajo.asesorId || miembrosOcupados(datos, [{ docenteId: d.id }], sustentacion.fecha, sustentacion.hora, id).length > 0) {
      return <button className="btn hu6-btn-gris hu6-btn-chico" disabled>No disponible</button>;
    }
    if (estaEnJurado(d.id)) return <button className="btn hu6-btn-gris hu6-btn-chico" disabled>Agregado</button>;
    const lleno = jurado.length >= 3 || !editable;
    if (conflictoDe(d.id)) {
      return <button className="btn hu6-btn-aviso hu6-btn-chico" disabled={lleno} onClick={() => agregar(d.id)}>Agregar de todos modos</button>;
    }
    return <button className="btn btn--outline hu6-btn-chico" disabled={lleno} onClick={() => agregar(d.id)}>Agregar</button>;
  };

  const metaDocente = (d) => {
    if (d.id === trabajo.asesorId) return 'Asesor del trabajo · no elegible por reglamento';
    if (miembrosOcupados(datos, [{ docenteId: d.id }], sustentacion.fecha, sustentacion.hora, id).length > 0) {
      return 'Tiene otra sustentación en ese bloque';
    }
    const conflicto = conflictoDe(d.id);
    if (conflicto && !estaEnJurado(d.id)) return `Posible conflicto: ${conflicto.motivo}`;
    const carga = cargaJurado(datos, d.id);
    return `${d.departamento} · ${carga} ${carga === 1 ? 'jurado' : 'jurados'} este ciclo · ${d.grado}`;
  };

  const claseDocente = (d) => {
    if (d.id === trabajo.asesorId) return 'hu6-docente--bloqueado';
    if (conflictoDe(d.id) && !estaEnJurado(d.id)) return 'hu6-docente--conflicto';
    return '';
  };

  // Presidente primero en la columna derecha
  const seleccionados = [...jurado].sort((a, b) => Number(b.presidente) - Number(a.presidente));

  return (
    <PageLayout
      headerSlot={<SlotDato etiqueta="Sustentación" valor={resumenFecha} />}
      navInfo="Paso 2 de 3 · jurado"
      footerDetalle={trabajo.codigo}
    >
      <PageHead migas={`Sustentaciones · ${resumenFecha} · Conformar jurado`} titulo="Conformación del jurado" />
      <p className="hu6-subtitulo-lora" style={{ marginTop: -12, marginBottom: 20 }}>{trabajo.titulo}</p>

      {!editable && <div style={{ marginBottom: 16 }}><Alert tipo="info">El acta ya fue registrada: el jurado no se puede cambiar.</Alert></div>}
      {editable && advertencias.length > 0 && (
        <div style={{ marginBottom: 20 }}><Alert tipo="warning">{advertencias.join(' ')}</Alert></div>
      )}

      <div className="hu6-layout">
        <section className="card hu6-docentes">
          <div className="hu6-tabla-card__head">
            <h2 className="text-label">Docentes disponibles</h2>
            <span className="text-muted text-aux">Ordenados por carga de jurados del ciclo</span>
          </div>
          {docentes.map((d) => (
            <div key={d.id} className={`hu6-docente ${claseDocente(d)}`}>
              <div>
                <p className="hu6-docente__nombre">{nombreDocente(d)}</p>
                <p className="hu6-docente__meta">{metaDocente(d)}</p>
              </div>
              {botonDocente(d)}
            </div>
          ))}
          <p className="hu6-nota-pie">
            El jurado se compone de 3 miembros; al menos uno debe tener grado de doctor y uno debe pertenecer al
            departamento del trabajo.
          </p>
        </section>

        <aside className="card hu6-columna" style={{ gap: 14 }}>
          <div className="hu6-miembro__fila">
            <p className="text-label">Jurado seleccionado</p>
            <span className="hu6-contador">{jurado.length} de 3</span>
          </div>

          {seleccionados.length === 0 && <p className="text-muted">Agrega a los miembros desde la lista de docentes.</p>}
          {seleccionados.map((m) => {
            const d = buscarDocente(datos, m.docenteId);
            return (
              <div key={m.docenteId} className={`hu6-miembro ${m.presidente ? 'hu6-miembro--presidente' : ''}`}>
                <div className="hu6-miembro__fila">
                  <span className="hu6-miembro__nombre">{nombreDocente(d)}</span>
                  {m.presidente ? (
                    <span className="badge badge--warning">Presidente</span>
                  ) : (
                    editable && <button className="link-button hu6-link-peligro" onClick={() => quitar(m.docenteId)}>Quitar</button>
                  )}
                </div>
                <div className="hu6-miembro__fila">
                  <span className="text-muted text-aux">{d.departamento} · {d.grado}</span>
                  {editable && !m.presidente && (
                    <button className="link-button" style={{ fontWeight: 600 }} onClick={() => designarPresidente(m.docenteId)}>Designar presidente</button>
                  )}
                  {editable && m.presidente && (
                    <button className="link-button hu6-link-peligro" onClick={() => quitar(m.docenteId)}>Quitar</button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="hu6-caja-gris" style={{ fontSize: 13 }}>
            {errores.length === 0 ? `Requisitos cumplidos: ${cumplidos}.` : <>Pendiente: {errores[0]}</>}
          </div>

          {error && <Alert tipo="error">{error}</Alert>}

          {editable && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button className="btn btn--primary btn--lg btn--block" disabled={errores.length > 0} onClick={confirmar}>
                Confirmar jurado
              </button>
              <p className="text-muted text-aux" style={{ textAlign: 'center', marginTop: 8 }}>
                Se notificará a los tres miembros, al equipo y al asesor
              </p>
            </div>
          )}
        </aside>
      </div>
    </PageLayout>
  );
}

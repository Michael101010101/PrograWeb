import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import useSustentaciones from '../hooks/useSustentaciones.js';
import { buscarSustentacion, buscarTrabajo, notaFinal, revisarActa } from '../services/sustentacionesService.js';
import { CRITERIOS, RESULTADOS } from '../data/datosSemilla.js';
import { formatearFecha } from '../utils/fechas.js';
import { SlotDato } from '../components/SlotsCabecera.jsx';
import Segmentado from '../components/Segmentado.jsx';
import ListaJurado from '../components/ListaJurado.jsx';
import ModalRegistrarActa from '../components/modales/ModalRegistrarActa.jsx';
import '../styles/hu6.css';

// Acta vacía: una nota en blanco por criterio
const ACTA_VACIA = {
  notas: Object.fromEntries(CRITERIOS.map((c) => [c.id, ''])),
  resultado: '',
  observaciones: '',
};

/** 6.3 Acta de sustentación · registro de notas y resultado (diapositiva 43) · rol Administrador. */
export default function ActaSustentacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const { datos, guardarBorrador, registrarActa } = useSustentaciones();
  const sustentacion = buscarSustentacion(datos, id);

  // Copia local del acta (empieza desde el borrador guardado, si existe)
  const [acta, setActa] = useState(() => ({ ...ACTA_VACIA, ...sustentacion?.acta }));
  const [error, setError] = useState('');
  const [confirmando, setConfirmando] = useState(false);

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
  const registrada = Boolean(sustentacion.acta?.registrada);
  const sinJurado = sustentacion.jurado.length !== 3;
  const bloqueada = registrada || sinJurado; // no se puede editar
  const final = notaFinal(acta.notas);

  const cambiarNota = (criterioId, valor) => {
    setActa({ ...acta, notas: { ...acta.notas, [criterioId]: valor } });
    setError('');
  };
  const cambiar = (campo, valor) => {
    setActa({ ...acta, [campo]: valor });
    setError('');
  };

  const guardar = () => {
    try {
      guardarBorrador(id, acta);
      mostrar({ tipo: 'exito', titulo: 'Borrador guardado', mensaje: 'Puedes completar el acta más tarde.' });
    } catch (e) {
      setError(e.message);
    }
  };

  // Primero se revisa el acta; si está bien, se pide confirmación (acción irreversible)
  const pedirConfirmacion = () => {
    try {
      revisarActa(acta);
      setConfirmando(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const registrar = () => {
    try {
      registrarActa(id, acta);
      setConfirmando(false);
      mostrar({ tipo: 'exito', titulo: 'Acta registrada', mensaje: 'El equipo ya puede ver su resultado.' });
      navigate('/admin/sustentaciones');
    } catch (e) {
      setConfirmando(false);
      setError(e.message);
    }
  };

  const sala = sustentacion.salaId ? `Sala ${sustentacion.salaId}` : 'Sin sala';

  return (
    <PageLayout
      headerSlot={<SlotDato etiqueta="Acta" valor={trabajo.codigo} />}
      navInfo="Paso 3 de 3 · acta"
      footerDetalle={registrada ? 'acta registrada' : 'acta en borrador'}
    >
      <PageHead
        migas="Sustentaciones · Acta"
        titulo="Acta de sustentación"
        descripcion={`${formatearFecha(sustentacion.fecha)} · ${sustentacion.hora} · ${sala} · ${sustentacion.modalidad.toLowerCase()} · ${trabajo.titulo}`}
        acciones={<Link to={`/sustentaciones/${id}/impresion`} className="btn btn--outline btn--lg">Ver vista de impresión</Link>}
      />

      <div className="hu6-layout">
        <section className="card hu6-form-card hu6-form">
          {registrada && (
            <Alert tipo="success">
              Acta registrada el {formatearFecha(sustentacion.acta.registradaEl)} a las {sustentacion.acta.registradaHora}. Ya no se puede modificar.
            </Alert>
          )}
          {sinJurado && !registrada && (
            <Alert tipo="warning">
              Primero conforma el jurado. <Link to={`/admin/sustentaciones/${id}/jurado`}>Ir al paso 2</Link>
            </Alert>
          )}

          <h2>Calificación por criterios</h2>
          <div className="hu6-criterios">
            <span className="text-label">Criterio</span>
            <span className="text-label">Peso</span>
            <span className="text-label">Nota (0–20)</span>
            {CRITERIOS.map((c) => (
              <div key={c.id} style={{ display: 'contents' }}>
                <label htmlFor={`hu6-nota-${c.id}`}>{c.nombre}</label>
                <span className="text-muted">{c.peso}%</span>
                <input
                  id={`hu6-nota-${c.id}`}
                  className="input hu6-nota-input"
                  type="number"
                  min={0}
                  max={20}
                  step={1}
                  value={acta.notas[c.id]}
                  disabled={bloqueada}
                  onChange={(e) => cambiarNota(c.id, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="hu6-nota-final">
            <span>Nota final ponderada</span>
            <strong>{final ?? '—'}</strong>
          </div>

          <div className="field">
            <span className="field__label">Resultado</span>
            <Segmentado etiqueta="Resultado" opciones={RESULTADOS} valor={acta.resultado} deshabilitado={bloqueada} onCambiar={(r) => cambiar('resultado', r)} />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="hu6-observaciones">Observaciones del jurado</label>
            <textarea
              id="hu6-observaciones"
              className="textarea"
              value={acta.observaciones}
              disabled={bloqueada}
              placeholder="Recomendaciones u observaciones que el equipo debe atender..."
              onChange={(e) => cambiar('observaciones', e.target.value)}
            />
          </div>

          {error && <Alert tipo="error">{error}</Alert>}

          {!bloqueada && (
            <div className="hu6-acciones">
              <button type="button" className="btn btn--ghost" onClick={guardar}>Guardar borrador</button>
              <button type="button" className="btn btn--primary btn--lg" onClick={pedirConfirmacion}>Registrar acta</button>
            </div>
          )}
        </section>

        <aside className="hu6-columna">
          <section className="card">
            <p className="text-label">Jurado que firma</p>
            {sinJurado ? <p className="text-muted" style={{ marginTop: 10 }}>Jurado por conformar.</p> : <ListaJurado datos={datos} jurado={sustentacion.jurado} />}
          </section>

          <section className="card">
            <p className="text-label">Datos del trabajo</p>
            <ul className="hu6-lista-datos" style={{ display: 'grid', gap: 8 }}>
              <li style={{ display: 'block' }}><strong>Equipo</strong> {trabajo.equipo.map((i) => i.corto).join(' · ')}</li>
              <li style={{ display: 'block' }}><strong>Asesor</strong> {trabajo.asesor}</li>
              <li style={{ display: 'block' }}><strong>Línea</strong> {trabajo.linea}</li>
              <li style={{ display: 'block' }}>
                <strong>Avance del plan</strong> {Math.round((trabajo.entregables.aprobados / trabajo.entregables.total) * 100)}% · {trabajo.entregables.aprobados} de {trabajo.entregables.total} aprobados
              </li>
            </ul>
          </section>

          <section className="card card--warning">
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>El acta es definitiva</p>
            <p className="text-aux">
              Una vez registrada, solo la Secretaría Académica puede rectificarla. El estudiante verá el resultado y podrá
              descargar el acta firmada.
            </p>
          </section>
        </aside>
      </div>

      {confirmando && (
        <ModalRegistrarActa resultado={acta.resultado} nota={final} onConfirmar={registrar} onCerrar={() => setConfirmando(false)} />
      )}
    </PageLayout>
  );
}

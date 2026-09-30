import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { TextField } from '../../shared/components/FormField.jsx';
import DemoLink from '../components/DemoLink.jsx';
import * as authService from '../services/authService.js';
import { fechaHora } from '../../shared/utils/formato.js';
import { PERIODO } from '../../shared/config/periodo.js';

const ETIQUETA = {
  vigente: ['success', 'Vigente'],
  usada: ['info', 'Usada'],
  vencida: ['neutral', 'Vencida'],
  revocada: ['danger', 'Anulada'],
};

/** Coordinación: invitar a otra persona a crear una cuenta de coordinador. */
export default function InvitacionesPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const [lista, setLista] = useState(null);
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [ultima, setUltima] = useState(null);
  const [anular, setAnular] = useState(null);
  const [anulando, setAnulando] = useState(false);

  const cargar = useCallback(async () => {
    setLista(await authService.listarInvitaciones(usuario));
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const inv = await authService.crearInvitacion(usuario, correo);
      setUltima(inv);
      setCorreo('');
      mostrar({ tipo: 'exito', titulo: 'Invitación creada', mensaje: `Código ${inv.codigo} para ${inv.correo}.` });
      cargar();
    } catch (err) {
      setError(err.campos?.correo ?? err.message);
    } finally {
      setEnviando(false);
    }
  };

  const confirmarAnulacion = async () => {
    setAnulando(true);
    try {
      await authService.anularInvitacion(usuario, anular.codigo);
      mostrar({ tipo: 'exito', titulo: 'Invitación anulada', mensaje: `${anular.correo} ya no podrá usar el código.` });
      cargar();
    } catch (err) {
      mostrar({ tipo: 'error', titulo: 'No se pudo anular', mensaje: err.message });
    } finally {
      setAnulando(false);
      setAnular(null);
    }
  };

  return (
    <PageLayout navInfo={`Periodo ${PERIODO.semestre}`}>
      <PageHead
        migas="Mi cuenta · Invitaciones"
        titulo="Invitar a coordinación"
        descripcion="Las cuentas de coordinación no tienen registro abierto: se crean con un código de un solo uso que vence en 7 días."
        acciones={<Link to="/cuenta" className="btn btn--outline">Volver a mi cuenta</Link>}
      />

      <div className="layout-aside">
        <section className="card">
          <h2 className="card__title">Invitaciones emitidas</h2>
          {lista === null && <p className="text-muted">Cargando…</p>}
          {lista?.length === 0 && (
            <EmptyState icono="✉" titulo="Aún no hay invitaciones" texto="Cuando invites a alguien, verás aquí el código y su estado." />
          )}
          {lista?.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr className="text-label" style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 8px 8px 0' }}>Correo</th>
                    <th style={{ padding: 8 }}>Código</th>
                    <th style={{ padding: 8 }}>Vence</th>
                    <th style={{ padding: 8 }}>Estado</th>
                    <th style={{ padding: 8 }} className="sr-only">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((inv) => {
                    const [tono, texto] = ETIQUETA[inv.estado];
                    return (
                      <tr key={inv.codigo} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 8px 12px 0' }}>{inv.correo}</td>
                        <td style={{ padding: 8, fontWeight: 600 }}>{inv.codigo}</td>
                        <td style={{ padding: 8 }} className="text-muted">{fechaHora(inv.venceEn)}</td>
                        <td style={{ padding: 8 }}><span className={`badge badge--${tono}`}>{texto}</span></td>
                        <td style={{ padding: 8, textAlign: 'right' }}>
                          {inv.estado === 'vigente' && (
                            <button className="link-button" style={{ color: 'var(--danger)' }} onClick={() => setAnular(inv)}>Anular</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="layout-aside__side">
          <form className="card" onSubmit={onSubmit} noValidate>
            <h2 className="card__title">Nueva invitación</h2>
            <div className="stack" style={{ gap: 14 }}>
              <TextField
                label="Correo institucional"
                type="email"
                placeholder="nombre@ulima.edu.pe"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                error={error}
              />
              <button type="submit" className="btn btn--primary btn--block" disabled={enviando}>
                {enviando ? 'Creando…' : 'Crear invitación'}
              </button>
              {ultima && (
                <DemoLink to={`/registro/coordinador?invitacion=${ultima.codigo}`} texto={`Abrir la invitación de ${ultima.correo}`} />
              )}
            </div>
          </form>
        </aside>
      </div>

      <ConfirmDialog
        abierto={Boolean(anular)}
        titulo="Anular invitación"
        mensaje={`El código ${anular?.codigo} dejará de funcionar y ${anular?.correo} no podrá crear su cuenta con él.`}
        textoConfirmar="Anular invitación"
        procesando={anulando}
        onConfirmar={confirmarAnulacion}
        onCancelar={() => setAnular(null)}
      />
    </PageLayout>
  );
}

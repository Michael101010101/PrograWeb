import ErrorRegistroModal from '../components/ErrorRegistroModal.jsx';
import TrabajoVigenteModal from '../components/TrabajoVigenteModal.jsx';
import ErrorIntegranteModal from '../components/ErrorIntegranteModal.jsx';
import CambiarEstadoModal from '../components/CambiarEstadoModal.jsx';
import EstadoToast from '../components/EstadoToast.jsx';

export default function PruebaModalesPage() {
  return (
    <div
      style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        alignItems: 'center',
        background: '#f1f0ea',
        minHeight: '100vh',
      }}
    >
      <ErrorRegistroModal />

      <TrabajoVigenteModal />

      <ErrorIntegranteModal />

      <CambiarEstadoModal tipo="desistir" />

      <CambiarEstadoModal tipo="concluir" />

      <EstadoToast tipo="exito" />

      <EstadoToast tipo="error" />
    </div>
  );
}
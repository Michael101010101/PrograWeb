import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { SlotCupo } from './SlotsCabecera.jsx';
import '../styles/hu3.css';

/**
 * Estructura común de las páginas del asesor en la HU-3:
 * cabecera con el cupo, contadores en la navegación y texto del footer.
 * Recibe `ficha` (GET /api/asesores/me: { asesor, resumen }) que pide cada página.
 * Mientras carga muestra un aviso; si el asesor aún no tiene ficha (404), lo explica.
 */
export default function PaginaAsesor({ ficha, cargando, error, onReintentar, footerDetalle, children }) {
  const asesor = ficha?.asesor ?? null;
  const resumen = ficha?.resumen;

  let contenido = children;
  if (!ficha && cargando) {
    contenido = <p className="text-muted" style={{ padding: 24 }}>Cargando…</p>;
  } else if (error?.status === 404) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState
          icono="!"
          tono="warning"
          titulo="Tu ficha de asesor aún no está registrada"
          texto="La coordinación debe validar tu cuenta y registrar tu ficha para que aparezcas en el directorio."
        />
      </div>
    );
  } else if (error && !ficha) {
    contenido = (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <EmptyState icono="!" tono="warning" titulo="No pudimos cargar tus datos" texto={error.message}>
          {onReintentar && <button className="btn btn--outline" onClick={onReintentar}>Reintentar</button>}
        </EmptyState>
      </div>
    );
  }

  return (
    <PageLayout
      headerSlot={<SlotCupo asesor={asesor} />}
      navContadores={{
        '/asesor/solicitudes': resumen?.solicitudesPendientes ?? 0,
        '/asesor/revision': resumen?.avancesPorRevisar ?? 0,
      }}
      footerDetalle={footerDetalle}
    >
      {contenido}
    </PageLayout>
  );
}

import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { SlotCupo } from './SlotsCabecera.jsx';
import { trabajosDeAsesor } from '../services/asesoriasService.js';
import '../styles/hu3.css';

/**
 * Estructura común de las páginas del asesor en la HU-3:
 * cabecera con el cupo, contadores en la navegación y texto del footer.
 * Si el asesor todavía no tiene ficha, muestra un aviso en lugar del contenido.
 */
export default function PaginaAsesor({ datos, asesor, footerDetalle, children }) {
  const pendientes = datos.solicitudes.filter((s) => s.asesorId === asesor?.id && s.estado === 'pendiente').length;
  const porRevisar = trabajosDeAsesor(datos, asesor?.id).reduce((suma, t) => suma + t.porRevisar, 0);

  return (
    <PageLayout
      headerSlot={<SlotCupo asesor={asesor} />}
      navContadores={{ '/asesor/solicitudes': pendientes, '/asesor/revision': porRevisar }}
      footerDetalle={footerDetalle}
    >
      {asesor ? (
        children
      ) : (
        <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <EmptyState
            icono="!"
            tono="warning"
            titulo="Tu ficha de asesor aún no está registrada"
            texto="La coordinación debe validar tu cuenta y registrar tu ficha para que aparezcas en el directorio."
          />
        </div>
      )}
    </PageLayout>
  );
}

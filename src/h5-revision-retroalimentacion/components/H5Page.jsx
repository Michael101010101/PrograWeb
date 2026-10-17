import PageLayout from '../../shared/components/PageLayout.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useRevision } from '../hooks/useRevision.js';
import { progresoTrabajo } from '../utils/progreso.js';
import '../styles/hu5.css';

export default function H5Page({ children, trabajo, detalle }) {
  const { datos, usuario, error } = useRevision();
  const pendientes = datos.avances.filter((a) => a.estado === 'en_revision').length;
  const progreso = trabajo ? progresoTrabajo(datos, trabajo.codigo) : null;
  return <PageLayout footerDetalle={detalle ?? (usuario.rol === 'asesor' ? `${pendientes} avances por revisar` : 'Revisión y retroalimentación')}
    headerSlot={trabajo ? <div className="h5-slot"><span>{trabajo.titulo}</span><progress max="100" value={progreso.porcentaje} aria-label="Progreso del trabajo" /><strong>{progreso.porcentaje}%</strong></div>
      : usuario.rol === 'asesor' ? <div className="h5-slot">Avances por revisar <strong>{pendientes}</strong></div> : null}>
    <div className="h5">{error ? <Alert>{error}</Alert> : children}</div>
  </PageLayout>;
}

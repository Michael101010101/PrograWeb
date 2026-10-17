import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useEntregables from '../hooks/useEntregables.js';
import { detallePlan, trabajosDeAsesor } from '../services/entregablesService.js';
import BarraAvance from '../components/BarraAvance.jsx';
import '../styles/hu4.css';

/**
 * TEMPORAL (solo en la rama de la HU-4): lista los trabajos de la asesora con un enlace a su plan.
 * Al integrar la HU-3, esta vista se reemplaza por "Mis asesorados" de Christopher y el botón
 * "Definir plan" se agrega en su detalle del trabajo (/asesor/asesorados/:codigo).
 */
export default function PlanesAsesorPage() {
  const { usuario } = useAuth();
  const { datos } = useEntregables();
  const trabajos = trabajosDeAsesor(datos, usuario.id);

  return (
    <PageLayout>
      <PageHead
        migas="Inicio · Mis asesorados"
        titulo="Mis asesorados"
        descripcion="Planes de entregables de los trabajos a tu cargo."
      />
      {trabajos.length === 0 ? (
        <div className="card hu4-vacio">
          <EmptyState icono="⋮" titulo="Aún no tienes trabajos a cargo" texto="Cuando aceptes una solicitud de asesoría, el trabajo aparecerá aquí." />
        </div>
      ) : (
        <div className="hu4-planes">
          {trabajos.map((t) => {
            const { items, suma, avance } = detallePlan(datos, t.codigo);
            return (
              <article key={t.codigo} className="card hu4-planes__card">
                <p className="text-label">{t.codigo} · {t.estado === 'concluido' ? 'Concluido' : 'En desarrollo'}</p>
                <h2>{t.titulo}</h2>
                <p className="text-muted text-aux">
                  {items.length === 0 ? 'Plan por definir' : `${items.length} entregables · pesos suman ${suma}`}
                </p>
                <div className="hu4-planes__avance">
                  <BarraAvance valor={avance.porcentaje} />
                  <strong>{avance.porcentaje}%</strong>
                </div>
                <Link to={`/asesor/asesorados/${t.codigo}/plan`} className={`btn ${items.length === 0 ? 'btn--primary' : 'btn--outline'}`}>
                  {items.length === 0 ? 'Definir plan' : t.estado === 'concluido' ? 'Ver plan' : 'Editar plan'}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { useDatos } from '../../shared/context/DatosContext.jsx';
import TrabajoChip from '../components/TrabajoChip.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import * as trabajoService from '../services/trabajoService.js';
import { ESTADOS } from '../config.js';
import { fecha } from '../utils/fechas.js';
import './misTrabajos.css';

const FILTROS = [['', 'Todos'], ...Object.entries(ESTADOS).map(([valor, { label }]) => [valor, label])];

export default function MisTrabajosPage() {
  const { textoNav } = useDatos();
  const [estado, setEstado] = useState('');
  const [trabajos, setTrabajos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    trabajoService
      .listarMisTrabajos(estado)
      .then((lista) => {
        if (!activo) return;
        setTrabajos(lista);
        setError(null);
      })
      .catch((err) => activo && setError(err.message));
    return () => {
      activo = false;
    };
  }, [estado]);

  return (
    <PageLayout headerSlot={<TrabajoChip />} navInfo={textoNav}>
      <div className="mt-contenedor">
        <PageHead
          migas="Mi trabajo · Historial"
          titulo="Mis trabajos"
          descripcion="Todos los trabajos en los que participaste, del más reciente al más antiguo."
        />

        <div className="mt-filtros" role="group" aria-label="Filtrar por estado">
          {FILTROS.map(([valor, label]) => (
            <button
              key={valor || 'todos'}
              type="button"
              className={`mt-filtro ${estado === valor ? 'mt-filtro--activo' : ''}`}
              aria-pressed={estado === valor}
              onClick={() => {
                setTrabajos(null);
                setEstado(valor);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? (
          <Alert tipo="error">No pudimos cargar tus trabajos: {error}</Alert>
        ) : trabajos === null ? (
          <div className="card" aria-busy="true">Cargando…</div>
        ) : trabajos.length === 0 ? (
          <EmptyState
            icono="∅"
            titulo={estado ? `No tienes trabajos en estado «${ESTADOS[estado].label}»` : 'Aún no tienes trabajos'}
            texto={estado ? 'Prueba con otro filtro.' : 'Registra tu trabajo de fin de carrera para empezar.'}
          >
            {!estado && (
              <Link className="btn btn--primary" to="/estudiante/mi-trabajo/registrar">
                Registrar mi trabajo
              </Link>
            )}
          </EmptyState>
        ) : (
          <ul className="mt-lista">
            {trabajos.map((t) => (
              <li key={t.id} className="card mt-item">
                <div className="mt-item__cabecera">
                  <span className="mt-item__codigo">{t.codigo}</span>
                  <EstadoBadge estado={t.estado} />
                </div>
                <h2 className="mt-item__titulo">{t.titulo}</h2>
                <p className="mt-item__meta">
                  {t.linea} · {t.integrantes.length} integrante{t.integrantes.length === 1 ? '' : 's'}
                  {t.asesor ? ` · ${t.asesor.nombre}` : ' · sin asesor'}
                </p>
                <p className="mt-item__meta">
                  Registrado el {fecha(t.registradoEn)}
                  {t.cerradoEn ? ` · cerrado el ${fecha(t.cerradoEn)}` : ''}
                </p>
                {t.estado !== 'desistido' && (
                  <Link className="btn btn--outline mt-item__accion" to="/estudiante/mi-trabajo/ficha">
                    Ver ficha
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageLayout>
  );
}
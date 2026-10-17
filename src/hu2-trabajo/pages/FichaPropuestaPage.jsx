import { useNavigate } from 'react-router-dom';
import './fichaEstados.css';
import EstadoBadge from '../components/EstadoBadge.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import { obtenerAsesoresDestacados } from '../../shared/integraciones.js';
import { diasHasta, fecha } from '../utils/fechas.js';
import { useToast } from '../../shared/components/ToastProvider.jsx';

function cierreAsignacion() {
  const etapa = PERIODO.cronograma.find((e) => e.etapa === 2);
  const [dia, mes] = etapa.rango.split('–')[1].trim().split('/');
  const anio = PERIODO.semestre.split('-')[0];
  return new Date(`${anio}-${mes}-${dia}T23:59:59`);
}

export default function FichaPropuestaPage({ trabajo, puedeGestionar, onCambiarEstado }) {
  const navigate = useNavigate();
    const { mostrar } = useToast();

  const soloResponsable = (accion) => () => {
    if (puedeGestionar) return accion();
    mostrar({
      tipo: 'aviso',
      titulo: 'Solo el responsable puede hacerlo',
      mensaje: 'Pide al responsable del equipo que haga el cambio o que te transfiera la responsabilidad.',
    });
  };

  const cierre = cierreAsignacion();
  const dias = diasHasta(cierre);

  const destacados = obtenerAsesoresDestacados();
  const deMiLinea = destacados.filter((a) => a.linea === trabajo.linea);
  const sugeridos = deMiLinea.length > 0 ? deMiLinea : destacados;

  return (
    <div className="fe-contenedor">
      <section className="fe-cabecera">
        <div className="fe-cabecera-superior">
          <div>
            <div className="fe-estado-linea">
              <EstadoBadge estado={trabajo.estado} />

              <span className="fe-registro">
                Registrado el {fecha(trabajo.registradoEn)} · código {trabajo.codigo}
              </span>
            </div>

            <h1>{trabajo.titulo}</h1>

            <p className="fe-subtitulo">
              {trabajo.linea} · {trabajo.carrera}
            </p>
          </div>

          <div className="fe-acciones">
            <button type="button" className="fe-btn-secundario" onClick={soloResponsable(() => navigate('/estudiante/mi-trabajo/editar'))}>
              Editar ficha
            </button>

            <button type="button" className="fe-btn-estado" onClick={soloResponsable(onCambiarEstado)}>
              Cambiar estado
            </button>
          </div>
        </div>

        <div className="fe-avance">
          <span className="fe-avance-label">AVANCE</span>

          <div className="fe-barra">
            <div className="fe-barra-relleno" style={{ width: '0%' }}></div>
          </div>

          <strong>0%</strong>

          <span className="fe-avance-texto">
            El plan de entregables se habilita cuando un asesor acepte
          </span>
        </div>
      </section>

      <div className="fe-grid-propuesta">
        <main className="fe-columna-principal">
          <section className="fe-sin-asesor">
            <div className="fe-icono-mas">+</div>

            <h2>Aún no tienes asesor</h2>

            <p>
              Elige un asesor del directorio entre quienes tengan cupo en
              <br />
              {trabajo.linea}. Solo puedes mantener una solicitud activa
              <br />
              por trabajo.
            </p>

            <button type="button" className="fe-btn-principal" onClick={() => navigate('/estudiante/asesores')}>
              Buscar asesor con cupo
            </button>
          </section>

          <section className="fe-card">
            <h2>Resumen</h2>

            <p className="fe-resumen">{trabajo.resumen}</p>

            <div className="fe-chips">
              {trabajo.palabrasClave.map((palabra) => (
                <span key={palabra}>{palabra}</span>
              ))}
            </div>
          </section>
        </main>

        <aside className="fe-lateral">
          <section className="fe-card">
            <p className="fe-card-label">EQUIPO</p>

            {trabajo.integrantes.map((integrante) => (
              <div className="fe-persona" key={integrante.usuarioId}>
                <div className="fe-avatar">{integrante.iniciales}</div>

                <div>
                  <strong>{integrante.nombre}</strong>
                  <p>{integrante.responsable ? 'Responsable' : 'Integrante'}</p>
                </div>
              </div>
            ))}

            <button type="button" className="fe-btn-link" onClick={() => navigate('/estudiante/mi-trabajo/equipo')}>
              {puedeGestionar ? 'Gestionar equipo' : 'Ver equipo'}
            </button>
          </section>

          <section className="fe-card fe-plazo">
            <h3>Plazo de la etapa 2</h3>

            {dias >= 0 ? (
              <p>
                La asignación de asesores cierra el {fecha(cierre.toISOString())}.
                <br />
                {dias === 0 ? 'Cierra hoy.' : `Faltan ${dias} día${dias === 1 ? '' : 's'}.`}
              </p>
            ) : (
              <p>
                La asignación de asesores cerró el {fecha(cierre.toISOString())}.
                <br />
                Escribe a la coordinación para una asignación extemporánea.
              </p>
            )}
          </section>

          <section className="fe-card">
            <p className="fe-card-label">ASESORES SUGERIDOS</p>

            <div className="fe-asesores">
              {sugeridos.map((asesor) => (
                <p key={asesor.id}>
                  {asesor.nombre} · cupo {asesor.cupo}
                </p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
import './fichaEstados.css';
import PageLayout from '../../shared/components/PageLayout.jsx';

export default function FichaConcluidaPage() {
  const entregables = [
    {
      numero: 1,
      nombre: 'Plan de investigación',
      fecha: '15 · 29/08',
    },
    {
      numero: 2,
      nombre: 'Marco teórico',
      fecha: '20 · 20/09',
    },
    {
      numero: 3,
      nombre: 'Diseño metodológico',
      fecha: '20 · 09/10',
    },
    {
      numero: 4,
      nombre: 'Resultados preliminares',
      fecha: '20 · 30/10',
    },
    {
      numero: 5,
      nombre: 'Informe final',
      fecha: '25 · 24/11',
    },
  ];

  return (
    <PageLayout>
      <div className="fe-contenedor">
        <section className="fe-cabecera">
          <div className="fe-cabecera-superior">
            <div>
              <div className="fe-estado-linea">
                <span className="fe-badge fe-badge-concluido">
                  Concluido
                </span>

                <span className="fe-registro">
                  Cerrado el 28/11/2026 · código TFC-2026-2-012
                </span>
              </div>

              <h1>
                Optimización de rutas de reparto para comercios de Lima Metropolitana
              </h1>

              <p className="fe-subtitulo">
                Gestión de operaciones · Ingeniería Industrial · asesor Mg. Julio Vargas Aliaga
              </p>
            </div>

            <div className="fe-acciones">
              <button type="button" className="fe-btn-editar-disabled">
                Editar ficha
              </button>

              <button type="button" className="fe-btn-principal">
                Ver mi sustentación
              </button>
            </div>
          </div>

          <div className="fe-avance">
            <span className="fe-avance-label">AVANCE</span>

            <div className="fe-barra">
              <div
                className="fe-barra-relleno"
                style={{ width: '100%' }}
              ></div>
            </div>

            <strong className="fe-100">100%</strong>

            <span className="fe-avance-texto">
              5 de 5 entregables aprobados · la ficha y el plan quedan en modo lectura
            </span>
          </div>
        </section>

        <div className="fe-grid-concluida">
          <main className="fe-columna-principal">
            <section className="fe-card fe-plan">
              <h2>Plan de entregables · modo lectura</h2>

              <div className="fe-entregables">
                {entregables.map((entregable) => (
                  <div
                    className="fe-entregable"
                    key={entregable.numero}
                  >
                    <div className="fe-entregable-linea"></div>

                    <span className="fe-aprobado">
                      Aprobado
                    </span>

                    <strong>
                      {entregable.numero}. {entregable.nombre}
                    </strong>

                    <small>{entregable.fecha}</small>
                  </div>
                ))}
              </div>

              <p className="fe-nota-plan">
                Ya no se admiten nuevos avances. El historial de versiones y los
                comentarios siguen disponibles.
              </p>
            </section>

            <section className="fe-card fe-resumen-concluido">
              <h2>Resumen</h2>

              <p>
                Se diseñó un modelo de ruteo con ventanas de tiempo para 42
                comercios de abarrotes de Lima Metropolitana, con una reducción
                simulada de 18% en distancia recorrida frente a la operación actual.
              </p>

              <div className="fe-separador"></div>

              <p className="fe-card-label">EQUIPO</p>

              <p className="fe-equipo-texto">
                Diana Rojas Tito (responsable) · Jorge Tapia Bendezú
              </p>
            </section>
          </main>

          <aside className="fe-card fe-sustentacion">
            <p className="fe-card-label">SUSTENTACIÓN PROGRAMADA</p>

            <h2>11/12/2026 · 10:00</h2>

            <p>
              Sala A-402, pabellón A · modalidad presencial
            </p>

            <div className="fe-jurado">
              <p className="fe-card-label">JURADO</p>

              <div className="fe-jurado-persona">
                <span>Dr. Ricardo Cárdenas Loayza</span>
                <span className="fe-presidente">
                  Presidente
                </span>
              </div>

              <p>Mg. Sandra Bustamante Ríos</p>
              <p>Ing. Luis Fernando Ocampo Salas</p>
            </div>

            <p className="fe-indicacion">
              Presenta el informe final impreso en la oficina TFC al menos
              5 días hábiles antes.
            </p>

            <button
              type="button"
              className="fe-btn-principal fe-btn-abajo"
            >
              Ver detalle de mi sustentación
            </button>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
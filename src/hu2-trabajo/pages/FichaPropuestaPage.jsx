import './fichaEstados.css';
import PageLayout from '../../shared/components/PageLayout.jsx';

export default function FichaPropuestaPage() {
  return (
    <PageLayout>
      <div className="fe-contenedor">
        <section className="fe-cabecera">
          <div className="fe-cabecera-superior">
            <div>
              <div className="fe-estado-linea">
                <span className="fe-badge fe-badge-propuesta">
                  Propuesta
                </span>

                <span className="fe-registro">
                  Registrado el 26/08/2026 · código TFC-2026-2-051
                </span>
              </div>

              <h1>
                Automatización del control de calidad en líneas de envasado de conservas
              </h1>

              <p className="fe-subtitulo">
                Automatización y control · Ingeniería Industrial
              </p>
            </div>

            <div className="fe-acciones">
              <button type="button" className="fe-btn-secundario">
                Editar ficha
              </button>

              <button type="button" className="fe-btn-estado">
                Cambiar estado
              </button>
            </div>
          </div>

          <div className="fe-avance">
            <span className="fe-avance-label">AVANCE</span>

            <div className="fe-barra">
              <div
                className="fe-barra-relleno"
                style={{ width: '0%' }}
              ></div>
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
                Automatización y control. Solo puedes mantener una solicitud activa
                <br />
                por trabajo.
              </p>

              <button type="button" className="fe-btn-principal">
                Buscar asesor con cupo
              </button>
            </section>

            <section className="fe-card">
              <h2>Resumen</h2>

              <p className="fe-resumen">
                Se propone un sistema de visión artificial que detecte defectos
                de sellado en latas de conserva sobre la línea de envasado, con
                alertas en tiempo real al operario y registro histórico para
                control estadístico de calidad.
              </p>

              <div className="fe-chips">
                <span>visión artificial</span>
                <span>control de calidad</span>
                <span>envasado</span>
              </div>
            </section>
          </main>

          <aside className="fe-lateral">
            <section className="fe-card">
              <p className="fe-card-label">EQUIPO</p>

              <div className="fe-persona">
                <div className="fe-avatar">JT</div>

                <div>
                  <strong>Jorge Luis Tapia Bendezú</strong>
                  <p>Responsable</p>
                </div>
              </div>

              <div className="fe-persona">
                <div className="fe-avatar">AF</div>

                <div>
                  <strong>Ana Lucía Ferreyra Loza</strong>
                  <p>Integrante</p>
                </div>
              </div>

              <button type="button" className="fe-btn-link">
                Gestionar equipo
              </button>
            </section>

            <section className="fe-card fe-plazo">
              <h3>Plazo de la etapa 2</h3>

              <p>
                La asignación de asesores cierra el 11/09/2026.
                <br />
                Faltan 5 días.
              </p>
            </section>

            <section className="fe-card">
              <p className="fe-card-label">ASESORES SUGERIDOS</p>

              <div className="fe-asesores">
                <p>Mg. Andrés Chávez Ninahuanca · cupo 4 de 6</p>
                <p>Dr. Pedro Salazar Huamán · cupo 2 de 5</p>
                <p>Mg. Sandra Bustamante Ríos · cupo 1 de 4</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
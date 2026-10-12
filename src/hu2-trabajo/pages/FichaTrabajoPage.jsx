import './fichaTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';

export default function FichaTrabajoPage() {
  return (
    <PageLayout>
      <div className="ficha-contenedor">

        <section className="ficha-cabecera">
          <div className="ficha-cabecera-superior">

            <div>
              <div className="ficha-estado-linea">
                <span className="estado-desarrollo">
                  En desarrollo
                </span>

                <span className="registro-info">
                  Registrado el 18/08/2026 · código TFC-2026-2-047
                </span>
              </div>

              <h1>
                Modelo predictivo de deserción en estudiantes de primer ciclo
              </h1>

              <p className="ficha-subtitulo">
                Ciencia de datos aplicada · Ingeniería de Sistemas
              </p>
            </div>

            <div className="ficha-acciones">
              <button
                type="button"
                className="btn-editar"
              >
                Editar ficha
              </button>

              <button
                type="button"
                className="btn-cambiar-estado"
              >
                Cambiar estado
              </button>
            </div>

          </div>

          <div className="avance-bloque">
            <span className="avance-label">
              AVANCE
            </span>

            <div className="barra-avance">
              <div className="barra-avance-relleno"></div>
            </div>

            <strong className="avance-porcentaje">
              55%
            </strong>

            <span className="avance-detalle">
              3 de 5 entregables aprobados · próximo vencimiento 30/10/2026
            </span>
          </div>
        </section>

        <div className="ficha-grid">

          <main className="ficha-principal">

            <section className="ficha-card resumen-card">
              <h2>Resumen</h2>

              <p>
                Modelo de clasificación que estima la probabilidad de deserción
                de estudiantes de primer ciclo con datos académicos y de
                asistencia del periodo 2022-2025, para anticipar intervenciones
                de tutoría.
              </p>

              <div className="chips">
                <span>deserción</span>
                <span>aprendizaje automático</span>
                <span>primer ciclo</span>
              </div>
            </section>

            <section className="ficha-card equipo-card">

              <div className="equipo-card-titulo">
                <h2>Equipo</h2>

                <button
                  type="button"
                  className="btn-gestionar-equipo"
                >
                  Gestionar equipo
                </button>
              </div>

              <div className="equipo-miembros">

                <div className="miembro">
                  <div className="miembro-avatar">
                    RQ
                  </div>

                  <div className="miembro-texto">
                    <strong>
                      Rosa Elena Quispe Mendoza · 20211357
                    </strong>
                  </div>

                  <span className="badge-responsable">
                    Responsable
                  </span>
                </div>

                <div className="miembro">
                  <div className="miembro-avatar">
                    DR
                  </div>

                  <div className="miembro-texto">
                    <strong>
                      Diego Alonso Ramírez Puente · 20210984
                    </strong>
                  </div>
                </div>

              </div>
            </section>

          </main>

          <aside className="ficha-lateral">

            <section className="ficha-card asesora-card">
              <p className="card-label">
                ASESORA ASIGNADA
              </p>

              <div className="asesora-info">
                <div className="asesora-avatar">
                  MQ
                </div>

                <div>
                  <strong>
                    Dra. Mariela Quispe Ramos
                  </strong>

                  <p>
                    Ingeniería de Sistemas
                  </p>
                </div>
              </div>

              <p className="asesora-detalle">
                Asesoría aceptada el 09/09/2026 · responde en 2.4 días en promedio
              </p>

              <button
                type="button"
                className="btn-secundario-ancho"
              >
                Ver ficha de la asesora
              </button>
            </section>

            <section className="ficha-card vencido-card">
              <h3>
                Entregable vencido
              </h3>

              <p>
                Resultados preliminares · vencía el 30/08/2026
              </p>

              <button
                type="button"
                className="btn-avance"
              >
                Registrar avance ahora
              </button>
            </section>

            <section className="ficha-card accesos-card">
              <p className="card-label">
                ACCESOS RÁPIDOS
              </p>

              <button
                type="button"
                className="btn-acceso-principal"
              >
                Plan de entregables
              </button>

              <button
                type="button"
                className="btn-secundario-ancho"
              >
                Retroalimentación
              </button>
            </section>

          </aside>

        </div>

      </div>
    </PageLayout>
  );
}
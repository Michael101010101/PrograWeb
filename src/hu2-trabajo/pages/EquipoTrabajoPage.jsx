import './equipoTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';

export default function EquipoTrabajoPage() {
  return (
    <PageLayout>
      <div className="equipo-contenedor">

        <PageHead
          migas="Mi trabajo / Equipo"
          titulo="Equipo de trabajo"
          descripcion="Máximo 3 integrantes. Busca estudiantes para formar tu equipo."
        />

        <div className="equipo-grid">

          <section className="buscar-estudiante">
            <h2>Buscar estudiante</h2>

            <div className="campo">
              <label>Nombre, apellido o código</label>

              <input
                type="text"
                placeholder="Escribe al menos 3 caracteres..."
              />
            </div>

            <div className="resultado">
              <div>
                <strong>Diego Alonso Ramírez Puente</strong>
                <p>20220894 · Ingeniería de Sistemas</p>
              </div>

              <button type="button">
                Agregar
              </button>
            </div>

            <div className="resultado">
              <div>
                <strong>Bruno Mateo Palomino Chávez</strong>
                <p>20221104 · Ingeniería de Sistemas</p>
              </div>

              <button type="button">
                Agregar
              </button>
            </div>

            <div className="resultado no-disponible">
              <div>
                <strong>Diana Carolina Rojas Tello</strong>
                <p>Ya pertenece a otro equipo</p>
              </div>

              <span>No disponible</span>
            </div>
          </section>

          <section className="integrantes">
            <div className="integrantes-titulo">
              <h2>Integrantes</h2>
              <span>2 de 3</span>
            </div>

            <div className="integrante">
              <div>
                <strong>Rosa Elena Quispe Mendoza</strong>
                <p>20221557 · Ingeniería de Sistemas</p>
              </div>

              <span>Responsable</span>
            </div>

            <div className="integrante">
              <div>
                <strong>Diego Alonso Ramírez Puente</strong>
                <p>20220894 · Ingeniería de Sistemas</p>
              </div>

              <button type="button">
                Quitar
              </button>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
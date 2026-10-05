import './registrarTrabajo.css';

export default function RegistrarTrabajoPage() {
  return (
    <main className="registro-trabajo-page">
      <div className="registro-contenedor">
        <section className="registro-principal">

          <p className="ruta">
            Mi trabajo / Nuevo registro
          </p>

          <h1>Registrar mi trabajo de fin de carrera</h1>

          <p className="descripcion">
            Completa la información inicial de tu trabajo.
          </p>

          <form>

            <div className="campo">
              <label>Título del trabajo</label>

              <input
                type="text"
                placeholder="Escribe el título de tu trabajo"
              />
            </div>

            <div className="fila">

              <div className="campo">
                <label>Línea de investigación</label>

                <select>
                  <option>Selecciona una línea</option>
                  <option>Ciencia de datos aplicada</option>
                  <option>Automatización y control</option>
                  <option>Gestión de operaciones</option>
                  <option>Innovación educativa</option>
                </select>
              </div>

              <div className="campo">
                <label>Carrera</label>

                <input
                  type="text"
                  value="Ingeniería de Sistemas"
                  readOnly
                />
              </div>

            </div>

            <div className="campo">
              <label>Resumen</label>

              <textarea
                placeholder="Escribe un breve resumen de tu trabajo"
                maxLength="300"
              ></textarea>
            </div>

            <div className="campo">
              <label>Palabras clave</label>

              <input
                type="text"
                placeholder="deserción, aprendizaje automático, primer ciclo"
              />
            </div>

          </form>

        </section>
      </div>
    </main>
  );
}   
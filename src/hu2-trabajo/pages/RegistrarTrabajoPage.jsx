import { useState } from 'react';
import './registrarTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';

export default function RegistrarTrabajoPage() {
  const [palabrasClave, setPalabrasClave] = useState([
    'deserción',
    'aprendizaje automático',
    'primer ciclo',
  ]);

  const [nuevaPalabra, setNuevaPalabra] = useState('');

  const agregarPalabra = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const palabra = nuevaPalabra.trim();

      if (
        palabra !== '' &&
        palabrasClave.length < 6 &&
        !palabrasClave.includes(palabra)
      ) {
        setPalabrasClave([...palabrasClave, palabra]);
        setNuevaPalabra('');
      }
    }
  };

  const quitarPalabra = (palabraAQuitar) => {
    setPalabrasClave(
      palabrasClave.filter((palabra) => palabra !== palabraAQuitar)
    );
  };

  const guardarBorrador = () => {
    alert('Borrador guardado');
  };

  const registrarTrabajo = (e) => {
    e.preventDefault();
    alert('Trabajo registrado');
  };

  return (
    <PageLayout>
      <div className="registro-contenedor">
        <PageHead
          migas="Mi trabajo · Nuevo registro"
          titulo="Registrar mi trabajo de fin de carrera"
        />

        <div className="registro-layout">

          <form
            className="registro-formulario"
            onSubmit={registrarTrabajo}
          >

            <div className="campo">
              <label>TÍTULO DEL TRABAJO</label>

              <input
                type="text"
                defaultValue="Modelo predictivo de deserción en estudiantes de primer ciclo"
              />

              <small>
                60 de 160 caracteres · mínimo 20
              </small>
            </div>

            <div className="fila">

              <div className="campo">
                <label>LÍNEA DE INVESTIGACIÓN</label>

                <select defaultValue="Ciencia de datos aplicada">
                  <option>Ciencia de datos aplicada</option>
                  <option>Automatización y control</option>
                  <option>Gestión de operaciones</option>
                  <option>Innovación educativa</option>
                </select>
              </div>

              <div className="campo">
                <label>CARRERA</label>

                <input
                  type="text"
                  value="Ingeniería de Sistemas · tomada de tu perfil"
                  readOnly
                />
              </div>

            </div>

            <div className="campo">
              <label>RESUMEN</label>

              <textarea
                defaultValue="Se propone un modelo de clasificación que estime la probabilidad de deserción de estudiantes de primer ciclo a partir de datos académicos y de asistencia del periodo 2022–2025, con el fin de anticipar intervenciones de tutoría."
                maxLength="1200"
              />

              <div className="contador-texto">
                <small>Entre 300 y 1200 caracteres</small>
                <small>318 / 1200</small>
              </div>
            </div>

            <div className="campo">
              <label>OBJETIVOS</label>

              <textarea
                defaultValue="1. Construir la base analítica del periodo 2022–2025. 2. Entrenar y comparar tres modelos de clasificación. 3. Validar el modelo con la Oficina de Tutoría."
              />
            </div>

            <div className="campo">
              <label>PALABRAS CLAVE</label>

              <div className="palabras-input">

                {palabrasClave.map((palabra) => (
                  <span
                    className="palabra-chip"
                    key={palabra}
                  >
                    {palabra}

                    <button
                      type="button"
                      onClick={() => quitarPalabra(palabra)}
                    >
                      ×
                    </button>
                  </span>
                ))}

                {palabrasClave.length < 6 && (
                  <input
                    type="text"
                    value={nuevaPalabra}
                    placeholder="Escribe y presiona Enter..."
                    onChange={(e) =>
                      setNuevaPalabra(e.target.value)
                    }
                    onKeyDown={agregarPalabra}
                  />
                )}

              </div>

              <small>
                Entre 3 y 6 palabras clave
              </small>
            </div>

            <div className="acciones">

              <button
                type="button"
                className="btn-cancelar"
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-borrador"
                onClick={guardarBorrador}
              >
                Guardar borrador
              </button>

              <button
                type="submit"
                className="btn-registrar"
              >
                Registrar trabajo
              </button>

            </div>

          </form>

          <aside className="registro-lateral">

            <div className="tarjeta-lateral">
              <h3>QUÉ SIGUE</h3>

              <p>
                Al registrar el trabajo podrás agregar hasta dos
                compañeros y solicitar asesor entre quienes tengan
                cupo en tu línea de investigación.
              </p>
            </div>

            <div className="tarjeta-lateral tarjeta-verde">
              <h3>Plan de entregables</h3>

              <p>
                Se creará con la plantilla del ciclo: Plan de
                investigación (15), Marco teórico (20), Diseño
                metodológico (20), Resultados preliminares (20) e
                Informe final (25).
              </p>
            </div>

            <div className="tarjeta-lateral">
              <h3>REGLAS</h3>

              <p>Un solo trabajo vigente por estudiante</p>
              <p>Equipo de 1 a 3 integrantes</p>
              <p>Una sola solicitud de asesoría activa</p>
            </div>

          </aside>

        </div>
      </div>
    </PageLayout>
  );
}
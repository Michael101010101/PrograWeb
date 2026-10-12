import { useState } from 'react';
import './equipoTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';

const estudiantesIniciales = [
  {
    id: 1,
    nombre: 'Diego Alonso Ramírez Puente',
    codigo: '20210984',
    carrera: 'Ingeniería de Sistemas',
    ciclo: 'Décimo ciclo',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Bruno Matías Palomino Chávez',
    codigo: '20211044',
    carrera: 'Ingeniería de Sistemas',
    ciclo: 'Noveno ciclo',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Diana Carolina Rojas Tito',
    codigo: '',
    carrera: '',
    ciclo: '',
    disponible: false,
  },
];

export default function EquipoTrabajoPage() {
  const [integrantes, setIntegrantes] = useState([
    {
      id: 10,
      nombre: 'Rosa Elena Quispe Mendoza',
      codigo: '20211357',
      carrera: 'Ingeniería de Sistemas',
      ciclo: 'Décimo ciclo',
      responsable: true,
    },
    {
      id: 1,
      nombre: 'Diego Alonso Ramírez Puente',
      codigo: '20210984',
      carrera: 'Ingeniería de Sistemas',
      ciclo: 'Décimo ciclo',
      responsable: false,
    },
  ]);

  const agregarIntegrante = (estudiante) => {
    if (integrantes.length >= 3) return;

    const yaExiste = integrantes.some(
      (integrante) => integrante.id === estudiante.id
    );

    if (yaExiste) return;

    setIntegrantes([
      ...integrantes,
      {
        ...estudiante,
        responsable: false,
      },
    ]);
  };

  const retirarIntegrante = (id) => {
    setIntegrantes(
      integrantes.filter((integrante) => integrante.id !== id)
    );
  };

  const marcarResponsable = (id) => {
    setIntegrantes(
      integrantes.map((integrante) => ({
        ...integrante,
        responsable: integrante.id === id,
      }))
    );
  };

  const guardarEquipo = () => {
    alert('Equipo guardado correctamente');
  };

  return (
    <PageLayout>
      <div className="equipo-contenedor">

        <PageHead
          migas="Mi trabajo · Equipo"
          titulo="Equipo de trabajo"
          descripcion="Máximo 3 integrantes. Ninguno puede participar en otro trabajo vigente."
          acciones={
            <div className="equipo-acciones-superiores">
              <button
                type="button"
                className="btn-volver"
              >
                Volver a la ficha
              </button>

              <button
                type="button"
                className="btn-guardar-equipo"
                onClick={guardarEquipo}
              >
                Guardar equipo
              </button>
            </div>
          }
        />

        <div className="equipo-grid">

          {/* PANEL IZQUIERDO */}
          <section className="equipo-panel buscar-panel">

            <h2>Buscar estudiante</h2>

            <div className="campo-busqueda">
              <label>NOMBRE, APELLIDO O CÓDIGO</label>

              <input
                type="text"
                placeholder="Escribe al menos 3 caracteres..."
              />
            </div>

            <div className="resultados-box">

              <div className="resultados-titulo">
                RESULTADOS · 4 COINCIDENCIAS
              </div>

              {estudiantesIniciales.map((estudiante) => {
                const yaAgregado = integrantes.some(
                  (integrante) => integrante.id === estudiante.id
                );

                return (
                  <div
                    className="resultado-estudiante"
                    key={estudiante.id}
                  >
                    <div>
                      <strong>{estudiante.nombre}</strong>

                      {estudiante.disponible ? (
                        <p>
                          {estudiante.codigo} · {estudiante.carrera} ·{' '}
                          {estudiante.ciclo}
                        </p>
                      ) : (
                        <p className="texto-no-disponible">
                          Ya participa en otro trabajo vigente
                        </p>
                      )}
                    </div>

                    {estudiante.disponible ? (
                      <button
                        type="button"
                        className="btn-agregar"
                        disabled={
                          yaAgregado || integrantes.length >= 3
                        }
                        onClick={() =>
                          agregarIntegrante(estudiante)
                        }
                      >
                        {yaAgregado ? 'Agregado' : 'Agregar'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-no-disponible"
                        disabled
                      >
                        No disponible
                      </button>
                    )}
                  </div>
                );
              })}

            </div>

            <p className="nota-estudiantes">
              Solo aparecen estudiantes matriculados en 2026-2 de la
              Facultad de Ingeniería.
            </p>

          </section>

          {/* PANEL DERECHO */}
          <section className="equipo-panel integrantes-panel">

            <div className="integrantes-cabecera">
              <h2>Integrantes</h2>

              <span className="contador-integrantes">
                {integrantes.length} de 3
              </span>
            </div>

            <div className="lista-integrantes">

              {integrantes.map((integrante) => (
                <div
                  className="integrante-fila"
                  key={integrante.id}
                >

                  <div className="integrante-info">

                    <div className="avatar-integrante">
                      {integrante.nombre
                        .split(' ')
                        .slice(0, 2)
                        .map((nombre) => nombre[0])
                        .join('')}
                    </div>

                    <div>
                      <strong>{integrante.nombre}</strong>

                      <p>
                        {integrante.codigo} · {integrante.carrera} ·{' '}
                        {integrante.ciclo}
                      </p>
                    </div>

                  </div>

                  <div className="integrante-opciones">

                    {integrante.responsable ? (
                      <>
                        <span className="badge-responsable">
                          Responsable
                        </span>

                        <span className="texto-tu">
                          Tú
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-responsable"
                          onClick={() =>
                            marcarResponsable(integrante.id)
                          }
                        >
                          Marcar responsable
                        </button>

                        <button
                          type="button"
                          className="btn-retirar"
                          onClick={() =>
                            retirarIntegrante(integrante.id)
                          }
                        >
                          Retirar
                        </button>
                      </>
                    )}

                  </div>

                </div>
              ))}

              {integrantes.length < 3 && (
                <div className="espacio-disponible">

                  <div className="circulo-mas">
                    +
                  </div>

                  <div>
                    <strong>
                      Espacio disponible para un integrante más
                    </strong>

                    <p>
                      Búscalo en el panel de la izquierda
                    </p>
                  </div>

                </div>
              )}

            </div>

            <div className="nota-responsable">
              El responsable registra los avances y recibe las
              notificaciones de la asesora. Puede transferirse en
              cualquier momento antes de la sustentación.
            </div>

          </section>

        </div>

      </div>
    </PageLayout>
  );
}
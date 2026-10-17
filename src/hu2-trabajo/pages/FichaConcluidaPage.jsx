import { useNavigate } from 'react-router-dom';
import './fichaEstados.css';
import EstadoBadge from '../components/EstadoBadge.jsx';
import { PLANTILLA_PLAN } from '../config.js';
import { fecha, fechaCorta, hora } from '../utils/fechas.js';

export default function FichaConcluidaPage({ trabajo }) {
  const navigate = useNavigate();
  const { avance, asesor, sustentacion } = trabajo;
  const entregables = trabajo.plan ?? PLANTILLA_PLAN.map((e, i) => ({ ...e, orden: i + 1, fecha: null, estado: 'aprobado' }));
  const responsable = trabajo.integrantes.find((i) => i.responsable);
  const otros = trabajo.integrantes.filter((i) => !i.responsable);

  return (
    <div className="fe-contenedor">
      <section className="fe-cabecera">
        <div className="fe-cabecera-superior">
          <div>
            <div className="fe-estado-linea">
              <EstadoBadge estado={trabajo.estado} />

              <span className="fe-registro">
                Cerrado el {fecha(trabajo.cerradoEn)} · código {trabajo.codigo}
              </span>
            </div>

            <h1>{trabajo.titulo}</h1>

            <p className="fe-subtitulo">
              {trabajo.linea} · {trabajo.carrera}
              {asesor && ` · asesor${asesor.genero === 'f' ? 'a' : ''} ${asesor.nombre}`}
            </p>
          </div>

          <div className="fe-acciones">
            <button type="button" className="fe-btn-editar-disabled" disabled title="La ficha de un trabajo concluido no se edita">
              Editar ficha
            </button>

            <button type="button" className="fe-btn-principal" onClick={() => navigate('/estudiante/sustentacion')}>
              Ver mi sustentación
            </button>
          </div>
        </div>

        <div className="fe-avance">
          <span className="fe-avance-label">AVANCE</span>

          <div className="fe-barra">
            <div className="fe-barra-relleno" style={{ width: `${avance.porcentaje}%` }}></div>
          </div>

          <strong className="fe-100">{avance.porcentaje}%</strong>

          <span className="fe-avance-texto">
            {avance.aprobados} de {avance.total} entregables aprobados · la ficha y el plan quedan en modo lectura
          </span>
        </div>
      </section>

      <div className="fe-grid-concluida">
        <main className="fe-columna-principal">
          <section className="fe-card fe-plan">
            <h2>Plan de entregables · modo lectura</h2>

            <div className="fe-entregables">
              {entregables.map((entregable) => (
                <div className="fe-entregable" key={entregable.orden}>
                  <div className="fe-entregable-linea"></div>

                  <span className="fe-aprobado">Aprobado</span>

                  <strong>
                    {entregable.orden}. {entregable.nombre}
                  </strong>

                  <small>
                    {entregable.peso}
                    {entregable.fecha && ` · ${fechaCorta(entregable.fecha)}`}
                  </small>
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

            <p>{trabajo.resumen}</p>

            <div className="fe-separador"></div>

            <p className="fe-card-label">EQUIPO</p>

            <p className="fe-equipo-texto">
              {[`${responsable?.nombre} (responsable)`, ...otros.map((i) => i.nombre)].join(' · ')}
            </p>
          </section>
        </main>

        <aside className="fe-card fe-sustentacion">
          <p className="fe-card-label">{sustentacion ? 'SUSTENTACIÓN PROGRAMADA' : 'SUSTENTACIÓN'}</p>

          {sustentacion ? (
            <>
              <h2>
                {fecha(sustentacion.fecha)} · {hora(sustentacion.fecha)}
              </h2>

              <p>
                {sustentacion.lugar} · modalidad {sustentacion.modalidad}
              </p>

              <div className="fe-jurado">
                <p className="fe-card-label">JURADO</p>

                {sustentacion.jurado.map((miembro) =>
                  miembro.presidente ? (
                    <div className="fe-jurado-persona" key={miembro.nombre}>
                      <span>{miembro.nombre}</span>
                      <span className="fe-presidente">Presidente</span>
                    </div>
                  ) : (
                    <p key={miembro.nombre}>{miembro.nombre}</p>
                  )
                )}
              </div>

              <p className="fe-indicacion">
                Presenta el informe final impreso en la oficina TFC al menos
                5 días hábiles antes.
              </p>
            </>
          ) : (
            <p className="fe-indicacion">
              La coordinación programará la fecha, la sala y el jurado. Te avisaremos por correo.
            </p>
          )}

          <button type="button" className="fe-btn-principal fe-btn-abajo" onClick={() => navigate('/estudiante/sustentacion')}>
            Ver detalle de mi sustentación
          </button>
        </aside>
      </div>
    </div>
  );
}
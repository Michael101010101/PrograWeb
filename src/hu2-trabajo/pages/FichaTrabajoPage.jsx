import { useNavigate } from 'react-router-dom';
import './fichaTrabajo.css';
import EstadoBadge from '../components/EstadoBadge.jsx';
import { fecha } from '../utils/fechas.js';
import { inicialesDeNombre } from '../utils/nombres.js';

export default function FichaTrabajoPage({ trabajo, puedeGestionar, onCambiarEstado }) {
  const navigate = useNavigate();
  const { avance, asesor } = trabajo;
  const ayudaPermiso = puedeGestionar ? undefined : 'Solo el responsable del equipo puede hacerlo';

  return (
    <div className="ficha-contenedor">
      <section className="ficha-cabecera">
        <div className="ficha-cabecera-superior">
          <div>
            <div className="ficha-estado-linea">
              <EstadoBadge estado={trabajo.estado} />

              <span className="registro-info">
                Registrado el {fecha(trabajo.registradoEn)} · código {trabajo.codigo}
              </span>
            </div>

            <h1>{trabajo.titulo}</h1>

            <p className="ficha-subtitulo">
              {trabajo.linea} · {trabajo.carrera}
            </p>
          </div>

          <div className="ficha-acciones">
            <button type="button" className="btn-editar" onClick={() => navigate('/estudiante/mi-trabajo/editar')} disabled={!puedeGestionar} title={ayudaPermiso}>
              Editar ficha
            </button>

            <button type="button" className="btn-cambiar-estado" onClick={onCambiarEstado} disabled={!puedeGestionar} title={ayudaPermiso}>
              Cambiar estado
            </button>
          </div>
        </div>

        <div className="avance-bloque">
          <span className="avance-label">AVANCE</span>

          <div className="barra-avance" role="progressbar" aria-valuenow={avance.porcentaje} aria-valuemin={0} aria-valuemax={100}>
            <div className="barra-avance-relleno" style={{ width: `${avance.porcentaje}%` }}></div>
          </div>

          <strong className="avance-porcentaje">{avance.porcentaje}%</strong>

          <span className="avance-detalle">
            {avance.aprobados} de {avance.total} entregables aprobados
            {avance.proximoVencimiento && ` · próximo vencimiento ${fecha(avance.proximoVencimiento)}`}
          </span>
        </div>
      </section>

      <div className="ficha-grid">
        <main className="ficha-principal">
          <section className="ficha-card resumen-card">
            <h2>Resumen</h2>

            <p>{trabajo.resumen}</p>

            <div className="chips">
              {trabajo.palabrasClave.map((palabra) => (
                <span key={palabra}>{palabra}</span>
              ))}
            </div>
          </section>

          <section className="ficha-card equipo-card">
            <div className="equipo-card-titulo">
              <h2>Equipo</h2>

              <button type="button" className="btn-gestionar-equipo" onClick={() => navigate('/estudiante/mi-trabajo/equipo')}>
                {puedeGestionar ? 'Gestionar equipo' : 'Ver equipo'}
              </button>
            </div>

            <div className="equipo-miembros">
              {trabajo.integrantes.map((integrante) => (
                <div className="miembro" key={integrante.usuarioId}>
                  <div className="miembro-avatar">{integrante.iniciales}</div>

                  <div className="miembro-texto">
                    <strong>
                      {integrante.nombre} · {integrante.codigo}
                    </strong>
                  </div>

                  {integrante.responsable && <span className="badge-responsable">Responsable</span>}
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="ficha-lateral">
          {asesor && (
            <section className="ficha-card asesora-card">
              <p className="card-label">{asesor.genero === 'f' ? 'ASESORA ASIGNADA' : 'ASESOR ASIGNADO'}</p>

              <div className="asesora-info">
                <div className="asesora-avatar">{inicialesDeNombre(asesor.nombre)}</div>

                <div>
                  <strong>{asesor.nombre}</strong>
                  <p>{asesor.departamento}</p>
                </div>
              </div>

              <p className="asesora-detalle">
                Asesoría aceptada el {fecha(asesor.aceptadaEn)}
                {asesor.diasRespuesta != null && ` · responde en ${asesor.diasRespuesta} días en promedio`}
              </p>

              <button type="button" className="btn-secundario-ancho" onClick={() => navigate('/estudiante/asesores')}>
                Ver ficha {asesor.genero === 'f' ? 'de la asesora' : 'del asesor'}
              </button>
            </section>
          )}

          {avance.vencido && (
            <section className="ficha-card vencido-card">
              <h3>Entregable vencido</h3>

              <p>
                {avance.vencido.nombre} · vencía el {fecha(avance.vencido.fecha)}
              </p>

              <button type="button" className="btn-avance" onClick={() => navigate('/estudiante/entregables')}>
                Registrar avance ahora
              </button>
            </section>
          )}

          <section className="ficha-card accesos-card">
            <p className="card-label">ACCESOS RÁPIDOS</p>

            <button type="button" className="btn-acceso-principal" onClick={() => navigate('/estudiante/entregables')}>
              Plan de entregables
            </button>

            <button type="button" className="btn-secundario-ancho" onClick={() => navigate('/estudiante/retroalimentacion')}>
              Retroalimentación
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
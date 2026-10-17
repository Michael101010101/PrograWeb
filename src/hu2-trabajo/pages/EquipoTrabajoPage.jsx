import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './equipoTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import Alert from '../../shared/components/Alert.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { PERIODO } from '../../shared/config/periodo.js';
import TrabajoChip from '../components/TrabajoChip.jsx';
import ErrorIntegranteModal from '../components/ErrorIntegranteModal.jsx';
import * as trabajoService from '../services/trabajoService.js';
import { ESTADOS, LIMITES } from '../config.js';

const mismoEquipo = (a, b) =>
  JSON.stringify(a.map((i) => [i.usuarioId, i.responsable])) === JSON.stringify(b.map((i) => [i.usuarioId, i.responsable]));

export default function EquipoTrabajoPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();

  const [trabajo, setTrabajo] = useState(null);
  const [integrantes, setIntegrantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [noDisponible, setNoDisponible] = useState(null);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  useEffect(() => {
    let activo = true;
    trabajoService.obtenerMiTrabajo(usuario.id).then(({ trabajo: actual }) => {
      if (!activo) return;
      if (!actual) {
        navigate('/estudiante/mi-trabajo', { replace: true });
        return;
      }
      setTrabajo(actual);
      setIntegrantes(actual.integrantes);
    });
    return () => {
      activo = false;
    };
  }, [usuario.id, navigate]);

  const textoValido = busqueda.trim().length >= LIMITES.busquedaMin;
  useEffect(() => {
    if (!trabajo || !textoValido) return undefined;
    let activo = true;
    const id = setTimeout(() => {
      trabajoService.buscarEstudiantes(busqueda, trabajo.id).then((lista) => {
        if (!activo) return;
        setResultados(lista);
        setBuscando(false);
      });
    }, 250);
    return () => {
      activo = false;
      clearTimeout(id);
    };
  }, [busqueda, textoValido, trabajo]);

  if (!trabajo) {
    return (
      <PageLayout headerSlot={<TrabajoChip />} navInfo={PERIODO.etapaActual}>
        <div className="equipo-contenedor" aria-busy="true" />
      </PageLayout>
    );
  }

  const soyResponsable = trabajo.integrantes.some((i) => i.usuarioId === usuario.id && i.responsable);
  const editable = soyResponsable && ['propuesta', 'en_desarrollo'].includes(trabajo.estado);
  const modificado = !mismoEquipo(integrantes, trabajo.integrantes);
  const lleno = integrantes.length >= LIMITES.integrantesMax;

  const agregarIntegrante = (estudiante) => {
    if (estudiante.ocupadoEn) {
      setNoDisponible({ integrante: estudiante, ocupadoEn: estudiante.ocupadoEn });
      return;
    }
    if (lleno || integrantes.some((i) => i.usuarioId === estudiante.usuarioId)) return;
    setIntegrantes([...integrantes, { ...estudiante, responsable: false }]);
  };

  const retirarIntegrante = (usuarioId) => {
    setIntegrantes(integrantes.filter((integrante) => integrante.usuarioId !== usuarioId));
  };

  const marcarResponsable = (usuarioId) => {
    setIntegrantes(integrantes.map((integrante) => ({ ...integrante, responsable: integrante.usuarioId === usuarioId })));
  };

  const guardarEquipo = async () => {
    setGuardando(true);
    try {
      const actualizado = await trabajoService.guardarEquipo(usuario, trabajo.id, integrantes);
      setTrabajo(actualizado);
      setIntegrantes(actualizado.integrantes);
      const nuevoResponsable = actualizado.integrantes.find((i) => i.responsable);
      mostrar({
        tipo: 'exito',
        titulo: 'Equipo guardado',
        mensaje:
          nuevoResponsable.usuarioId === usuario.id
            ? `El equipo quedó con ${actualizado.integrantes.length} integrante${actualizado.integrantes.length === 1 ? '' : 's'}.`
            : `${nuevoResponsable.nombre} es ahora responsable del trabajo.`,
      });
    } catch (err) {
      if (err.status === 409 && err.datos?.integrante) {
        setNoDisponible(err.datos);
      } else {
        mostrar({ tipo: 'error', titulo: 'No se pudo guardar el equipo', mensaje: err.message });
      }
    } finally {
      setGuardando(false);
    }
  };

  const volver = () => (modificado ? setConfirmarSalida(true) : navigate('/estudiante/mi-trabajo'));

  const buscarOtro = () => {
    setNoDisponible(null);
    setBusqueda('');
    setResultados([]);
    document.getElementById('hu2-buscar')?.focus();
  };

  const rolFooter = soyResponsable ? 'responsable' : 'integrante';

  return (
    <PageLayout
      headerSlot={<TrabajoChip />}
      navInfo={PERIODO.etapaActual.split(' · ')[0]}
      footerDetalle={`${rolFooter} del trabajo ${trabajo.codigo}`}
    >
      <div className="equipo-contenedor">
        <PageHead
          migas="Mi trabajo · Equipo"
          titulo="Equipo de trabajo"
          descripcion="Máximo 3 integrantes. Ninguno puede participar en otro trabajo vigente."
          acciones={
            <div className="equipo-acciones-superiores">
              <button type="button" className="btn-volver" onClick={volver}>
                Volver a la ficha
              </button>

              {editable && (
                <button type="button" className="btn-guardar-equipo" onClick={guardarEquipo} disabled={!modificado || guardando}>
                  {guardando ? 'Guardando…' : 'Guardar equipo'}
                </button>
              )}
            </div>
          }
        />

        {!editable && (
          <div style={{ marginBottom: 16 }}>
            <Alert tipo="info">
              {soyResponsable
                ? `El trabajo está ${ESTADOS[trabajo.estado].label.toLowerCase()}: el equipo ya no puede modificarse.`
                : 'Solo el responsable del equipo puede agregar, retirar o transferir la responsabilidad.'}
            </Alert>
          </div>
        )}

        <div className="equipo-grid">
          <section className="equipo-panel buscar-panel">
            <h2>Buscar estudiante</h2>

            <div className="campo-busqueda">
              <label htmlFor="hu2-buscar">NOMBRE, APELLIDO O CÓDIGO</label>

              <input
                id="hu2-buscar"
                type="search"
                placeholder="Escribe al menos 3 caracteres..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setBuscando(e.target.value.trim().length >= LIMITES.busquedaMin);
                }}
                disabled={!editable}
                autoComplete="off"
              />
            </div>

            {textoValido && (
              <div className="resultados-box" aria-live="polite" aria-busy={buscando}>
                <div className="resultados-titulo">
                  {buscando ? 'BUSCANDO…' : `RESULTADOS · ${resultados.length} COINCIDENCIA${resultados.length === 1 ? '' : 'S'}`}
                </div>

                {!buscando && resultados.length === 0 && (
                  <div className="resultado-estudiante">
                    <p>No hay estudiantes que coincidan con «{busqueda.trim()}».</p>
                  </div>
                )}

                {resultados.map((estudiante) => {
                  const yaAgregado = integrantes.some((integrante) => integrante.usuarioId === estudiante.usuarioId);
                  const disponible = !estudiante.ocupadoEn;

                  return (
                    <div className={`resultado-estudiante ${disponible ? '' : 'no-disponible'}`} key={estudiante.usuarioId}>
                      <div>
                        <strong>{estudiante.nombre}</strong>

                        {disponible ? (
                          <p>
                            {estudiante.codigo} · {estudiante.carrera} · {estudiante.ciclo} ciclo
                          </p>
                        ) : (
                          <p className="texto-no-disponible">Ya participa en otro trabajo vigente</p>
                        )}
                      </div>

                      {disponible ? (
                        <button
                          type="button"
                          className="btn-agregar"
                          disabled={yaAgregado || lleno}
                          title={lleno && !yaAgregado ? 'El equipo ya tiene 3 integrantes' : undefined}
                          onClick={() => agregarIntegrante(estudiante)}
                        >
                          {yaAgregado ? 'Agregado' : 'Agregar'}
                        </button>
                      ) : (
                        <button type="button" className="btn-no-disponible" onClick={() => agregarIntegrante(estudiante)}>
                          No disponible
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="nota-estudiantes">
              Solo aparecen estudiantes matriculados en {PERIODO.semestre} de la
              Facultad de Ingeniería.
            </p>
          </section>

          <section className="equipo-panel integrantes-panel">
            <div className="integrantes-cabecera">
              <h2>Integrantes</h2>

              <span className="contador-integrantes">
                {integrantes.length} de {LIMITES.integrantesMax}
              </span>
            </div>

            <div className="lista-integrantes">
              {integrantes.map((integrante) => {
                const soyYo = integrante.usuarioId === usuario.id;
                return (
                  <div className="integrante-fila" key={integrante.usuarioId}>
                    <div className="integrante-info">
                      <div className="avatar-integrante">{integrante.iniciales}</div>

                      <div>
                        <strong>{integrante.nombre}</strong>
                        <p>
                          {integrante.codigo} · {integrante.carrera} · {integrante.ciclo} ciclo
                        </p>
                      </div>
                    </div>

                    <div className="integrante-opciones">
                      {integrante.responsable && <span className="badge-responsable">Responsable</span>}
                      {soyYo && <span className="texto-tu">Tú</span>}

                      {editable && !integrante.responsable && (
                        <button type="button" className="btn-responsable" onClick={() => marcarResponsable(integrante.usuarioId)}>
                          Marcar responsable
                        </button>
                      )}

                      {editable && !integrante.responsable && !soyYo && (
                        <button type="button" className="btn-retirar" onClick={() => retirarIntegrante(integrante.usuarioId)}>
                          Retirar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {integrantes.length < LIMITES.integrantesMax && (
                <div className="espacio-disponible">
                  <div className="circulo-mas">+</div>

                  <div>
                    <strong>
                      {LIMITES.integrantesMax - integrantes.length === 1
                        ? 'Espacio disponible para un integrante más'
                        : `Espacio disponible para ${LIMITES.integrantesMax - integrantes.length} integrantes más`}
                    </strong>

                    <p>Búscalo en el panel de la izquierda</p>
                  </div>
                </div>
              )}
            </div>

            <div className="nota-responsable">
              El responsable registra los avances y recibe las
              notificaciones de la asesoría. Puede transferirse en
              cualquier momento antes de la sustentación.
            </div>
          </section>
        </div>
      </div>

      <ErrorIntegranteModal
        integrante={noDisponible?.integrante}
        ocupadoEn={noDisponible?.ocupadoEn}
        onCerrar={() => setNoDisponible(null)}
        onBuscarOtro={buscarOtro}
      />

      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="¿Salir sin guardar el equipo?"
        mensaje="Los cambios en los integrantes no se guardarán."
        textoConfirmar="Salir sin guardar"
        textoCancelar="Seguir editando"
        onConfirmar={() => navigate('/estudiante/mi-trabajo')}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </PageLayout>
  );
}
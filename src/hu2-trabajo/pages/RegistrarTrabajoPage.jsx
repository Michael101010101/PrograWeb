import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registrarTrabajo.css';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import Alert from '../../shared/components/Alert.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useFormulario from '../../hu1-cuenta/components/useFormulario.js';
import { PERIODO } from '../../shared/config/periodo.js';
import TrabajoChip from '../components/TrabajoChip.jsx';
import ErrorRegistroModal from '../components/ErrorRegistroModal.jsx';
import TrabajoVigenteModal from '../components/TrabajoVigenteModal.jsx';
import * as trabajoService from '../services/trabajoService.js';
import { LIMITES, LINEAS_INVESTIGACION } from '../config.js';
import { validarNuevaPalabra, validarTrabajo } from '../utils/validaciones.js';
import { fecha, hora } from '../utils/fechas.js';

const VACIO = { titulo: '', linea: '', resumen: '', objetivos: '', palabrasClave: [] };

function valoresDesde(t) {
  return { titulo: t.titulo, linea: t.linea, resumen: t.resumen, objetivos: t.objetivos, palabrasClave: [...t.palabrasClave] };
}

export default function RegistrarTrabajoPage({ modo = 'registrar' }) {
  const editando = modo === 'editar';
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();

  const [borradorInicial] = useState(() => (editando ? null : trabajoService.obtenerBorrador(usuario.id)));
  const form = useFormulario(borradorInicial?.valores ?? VACIO, validarTrabajo);
  const { valores, errores, onChange, onBlur, setValores, setErrores } = form;

  const [cargando, setCargando] = useState(true);
  const [trabajo, setTrabajo] = useState(null);
  const [ultimoDesistido, setUltimoDesistido] = useState(null);
  const [trabajoVigente, setTrabajoVigente] = useState(null);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [errorPalabra, setErrorPalabra] = useState(null);
  const [modalErrores, setModalErrores] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [borradorEn, setBorradorEn] = useState(borradorInicial?.guardadoEn ?? null);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const reiniciarForm = form.reiniciar;

  useEffect(() => {
    let activo = true;
    trabajoService.obtenerMiTrabajo(usuario.id).then(({ trabajo: actual, ultimoDesistido: desistido }) => {
      if (!activo) return;
      setUltimoDesistido(desistido);
      if (editando) {
        const puedeEditar =
          actual &&
          ['propuesta', 'en_desarrollo'].includes(actual.estado) &&
          actual.integrantes.some((i) => i.usuarioId === usuario.id && i.responsable);
        if (!puedeEditar) {
          mostrar({ tipo: 'aviso', titulo: 'Ficha en modo lectura', mensaje: 'Solo el responsable puede editar un trabajo en propuesta o en desarrollo.' });
          navigate('/estudiante/mi-trabajo', { replace: true });
          return;
        }
        setTrabajo(actual);
        reiniciarForm(valoresDesde(actual));
      } else if (actual) {
        setTrabajoVigente(actual);
      }
      setCargando(false);
    });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id, editando]);

  useEffect(() => {
    if (editando || cargando || trabajoVigente || !form.modificado) return undefined;
    const id = setTimeout(() => setBorradorEn(trabajoService.guardarBorrador(usuario.id, valores)), 1500);
    return () => clearTimeout(id);
  }, [valores, editando, cargando, trabajoVigente, form.modificado, usuario.id]);

  const cambiarPalabras = (lista) => {
    const nuevos = { ...valores, palabrasClave: lista };
    setValores(nuevos);
    if (errores.palabrasClave) setErrores((prev) => ({ ...prev, palabrasClave: validarTrabajo(nuevos).palabrasClave }));
  };

  const agregarPalabra = (e) => {
    if (e.key === 'Backspace' && !nuevaPalabra && valores.palabrasClave.length) {
      cambiarPalabras(valores.palabrasClave.slice(0, -1));
      return;
    }
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const palabra = nuevaPalabra.trim().toLowerCase();
    if (!palabra) return;
    const error = validarNuevaPalabra(palabra, valores.palabrasClave);
    setErrorPalabra(error);
    if (error) return;
    cambiarPalabras([...valores.palabrasClave, palabra]);
    setNuevaPalabra('');
  };

  const quitarPalabra = (palabraAQuitar) => {
    setErrorPalabra(null);
    cambiarPalabras(valores.palabrasClave.filter((palabra) => palabra !== palabraAQuitar));
  };

  const guardarBorrador = () => {
    setBorradorEn(trabajoService.guardarBorrador(usuario.id, valores));
    mostrar({ tipo: 'exito', titulo: 'Borrador guardado', mensaje: 'Puedes continuar el registro cuando quieras.' });
  };

  const registrarTrabajo = async (e) => {
    e.preventDefault();
    if (!form.validarTodo()) {
      setModalErrores(true);
      return;
    }
    setEnviando(true);
    try {
      if (editando) {
        await trabajoService.actualizarFicha(usuario, trabajo.id, valores);
        mostrar({ tipo: 'exito', titulo: 'Ficha actualizada', mensaje: 'Los cambios ya son visibles para tu equipo y tu asesor.' });
      } else {
        const nuevo = await trabajoService.registrarTrabajo(usuario, valores);
        mostrar({
          tipo: 'exito',
          titulo: 'Trabajo registrado',
          mensaje: `Código ${nuevo.codigo}. Ahora puedes armar tu equipo y solicitar asesor.`,
        });
      }
      navigate('/estudiante/mi-trabajo');
    } catch (err) {
      setEnviando(false);
      if (err.status === 409 && err.datos?.trabajo) {
        setTrabajoVigente(err.datos.trabajo);
        return;
      }
      if (err.campos && Object.keys(err.campos).length) {
        setErrores(err.campos);
        setModalErrores(true);
        return;
      }
      mostrar({ tipo: 'error', titulo: editando ? 'No se pudo guardar la ficha' : 'No se pudo registrar el trabajo', mensaje: err.message });
    }
  };

  const cancelar = () => {
    if (editando) {
      if (form.modificado) setConfirmarSalida(true);
      else navigate('/estudiante/mi-trabajo');
      return;
    }
    if (form.modificado || borradorEn) setConfirmarSalida(true);
  };

  const confirmarCancelar = () => {
    setConfirmarSalida(false);
    if (editando) {
      navigate('/estudiante/mi-trabajo');
      return;
    }
    trabajoService.descartarBorrador(usuario.id);
    setBorradorEn(null);
    setNuevaPalabra('');
    setErrorPalabra(null);
    reiniciarForm(VACIO);
    mostrar({ tipo: 'aviso', titulo: 'Borrador descartado', mensaje: 'El formulario quedó en blanco.' });
  };

  const largoTitulo = valores.titulo.trim().length;
  const largoResumen = valores.resumen.trim().length;
  const conError = (campo) => (errores[campo] ? 'con-error' : '');
  const lineaBloqueada = editando && Boolean(trabajo?.asesor);

  const footerDetalle = editando
    ? `editando la ficha ${trabajo?.codigo ?? ''}`
    : borradorEn
      ? `borrador guardado automáticamente ${hora(borradorEn)}`
      : 'sin trabajo registrado';

  return (
    <PageLayout headerSlot={<TrabajoChip />} navInfo={PERIODO.etapaActual} footerDetalle={footerDetalle}>
      <div className="registro-contenedor">
        <PageHead
          migas={editando ? 'Mi trabajo · Editar ficha' : 'Mi trabajo · Nuevo registro'}
          titulo={editando ? 'Editar la ficha del trabajo' : 'Registrar mi trabajo de fin de carrera'}
          descripcion={editando ? `${trabajo?.codigo ?? ''} · los cambios los verá tu equipo y tu asesor` : undefined}
        />

        {!editando && ultimoDesistido && !trabajoVigente && (
          <div style={{ marginBottom: 16 }}>
            <Alert tipo="info">
              Tu trabajo «{ultimoDesistido.titulo}» quedó desistido el {fecha(ultimoDesistido.cerradoEn)}. Puedes registrar uno nuevo.
            </Alert>
          </div>
        )}

        <div className="registro-layout">
          <form className="registro-formulario" onSubmit={registrarTrabajo} noValidate aria-busy={cargando}>
            <fieldset className="registro-fieldset" disabled={cargando}>
              <div className="campo">
                <label htmlFor="hu2-titulo">TÍTULO DEL TRABAJO</label>
                <input
                  id="hu2-titulo"
                  type="text"
                  name="titulo"
                  className={`titulo-input ${conError('titulo')}`}
                  value={valores.titulo}
                  onChange={onChange}
                  onBlur={onBlur}
                  maxLength={LIMITES.tituloMax}
                  placeholder="Ej.: Modelo predictivo de deserción en estudiantes de primer ciclo"
                  aria-invalid={Boolean(errores.titulo)}
                />
                <small className={errores.titulo ? 'texto-error' : ''}>
                  {errores.titulo ?? `${largoTitulo} de ${LIMITES.tituloMax} caracteres · mínimo ${LIMITES.tituloMin}`}
                </small>
              </div>

              <div className="fila">
                <div className="campo">
                  <label htmlFor="hu2-linea">LÍNEA DE INVESTIGACIÓN</label>
                  <select
                    id="hu2-linea"
                    name="linea"
                    className={conError('linea')}
                    value={valores.linea}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={lineaBloqueada}
                    aria-invalid={Boolean(errores.linea)}
                  >
                    <option value="">Selecciona una línea</option>
                    {LINEAS_INVESTIGACION.map((linea) => (
                      <option key={linea}>{linea}</option>
                    ))}
                  </select>
                  {errores.linea ? (
                    <small className="texto-error">{errores.linea}</small>
                  ) : (
                    lineaBloqueada && <small>No editable: tu asesor fue asignado en esta línea</small>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="hu2-carrera">CARRERA</label>
                  <input id="hu2-carrera" type="text" value={`${trabajo?.carrera ?? usuario.carrera} · tomada de tu perfil`} readOnly />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="hu2-resumen">RESUMEN</label>
                <textarea
                  id="hu2-resumen"
                  name="resumen"
                  className={conError('resumen')}
                  value={valores.resumen}
                  onChange={onChange}
                  onBlur={onBlur}
                  maxLength={LIMITES.resumenMax}
                  placeholder="Problema, propuesta y resultado esperado del trabajo."
                  aria-invalid={Boolean(errores.resumen)}
                />
                <div className="contador-texto">
                  <small className={errores.resumen ? 'texto-error' : ''}>
                    {errores.resumen ?? `Entre ${LIMITES.resumenMin} y ${LIMITES.resumenMax} caracteres`}
                  </small>
                  <small>{largoResumen} / {LIMITES.resumenMax}</small>
                </div>
              </div>

              <div className="campo">
                <label htmlFor="hu2-objetivos">OBJETIVOS</label>
                <textarea
                  id="hu2-objetivos"
                  name="objetivos"
                  className={conError('objetivos')}
                  value={valores.objetivos}
                  onChange={onChange}
                  onBlur={onBlur}
                  maxLength={LIMITES.objetivosMax}
                  placeholder="1. … 2. … 3. …"
                  aria-invalid={Boolean(errores.objetivos)}
                />
                {errores.objetivos && <small className="texto-error">{errores.objetivos}</small>}
              </div>

              <div className="campo">
                <label htmlFor="hu2-palabra">PALABRAS CLAVE</label>

                <div className={`palabras-input ${conError('palabrasClave')}`}>
                  {valores.palabrasClave.map((palabra) => (
                    <span className="palabra-chip" key={palabra}>
                      {palabra}
                      <button type="button" onClick={() => quitarPalabra(palabra)} aria-label={`Quitar ${palabra}`}>
                        ×
                      </button>
                    </span>
                  ))}

                  {valores.palabrasClave.length < LIMITES.palabrasMax && (
                    <input
                      id="hu2-palabra"
                      type="text"
                      value={nuevaPalabra}
                      placeholder="Escribe y presiona Enter..."
                      maxLength={LIMITES.palabraMax}
                      onChange={(e) => {
                        setNuevaPalabra(e.target.value);
                        setErrorPalabra(null);
                      }}
                      onKeyDown={agregarPalabra}
                    />
                  )}
                </div>

                <small className={errorPalabra || errores.palabrasClave ? 'texto-error' : ''}>
                  {errorPalabra ?? errores.palabrasClave ?? `Entre ${LIMITES.palabrasMin} y ${LIMITES.palabrasMax} palabras clave`}
                </small>
              </div>

              <div className="acciones">
                <button type="button" className="btn-cancelar" onClick={cancelar} disabled={enviando}>
                  Cancelar
                </button>

                {!editando && (
                  <button type="button" className="btn-borrador" onClick={guardarBorrador} disabled={enviando || cargando || Boolean(trabajoVigente)}>
                    Guardar borrador
                  </button>
                )}

                <button type="submit" className="btn-registrar" disabled={enviando || cargando || Boolean(trabajoVigente)}>
                  {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Registrar trabajo'}
                </button>
              </div>
            </fieldset>
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

      <ErrorRegistroModal
        abierto={modalErrores}
        errores={errores}
        valores={valores}
        titulo={editando ? 'No pudimos guardar la ficha' : 'No pudimos registrar el trabajo'}
        onCerrar={() => setModalErrores(false)}
      />

      <TrabajoVigenteModal trabajo={trabajoVigente} onCerrar={() => navigate('/estudiante/mi-trabajo')} />

      <ConfirmDialog
        abierto={confirmarSalida}
        titulo={editando ? '¿Salir sin guardar?' : '¿Descartar el registro?'}
        mensaje={editando ? 'Se perderán los cambios que no guardaste en la ficha.' : 'Se borrará el borrador y el formulario quedará en blanco.'}
        textoConfirmar={editando ? 'Salir sin guardar' : 'Descartar borrador'}
        textoCancelar="Seguir editando"
        onConfirmar={confirmarCancelar}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </PageLayout>
  );
}
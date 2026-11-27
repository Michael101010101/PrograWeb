import { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import EstadoVista from '../components/EstadoVista.jsx';
import ModalBloquearUsuario from '../components/ModalBloquearUsuario.jsx';
import ModalValidarAsesor from '../components/ModalValidarAsesor.jsx';
import { usePeticion } from '../hooks/usePeticion.js';
import { useRetardo } from '../hooks/useRetardo.js';
import {
  bloquearUsuario,
  contarUsuarios,
  desbloquearUsuario,
  listarUsuarios,
  validarAsesor,
} from '../api/clienteApiHu7.js';
import { ETIQUETA_ESTADO_USUARIO, ETIQUETA_ROL } from '../utils/formatoHu7.js';
import '../hu7.css';
import '../GestionUsuarios.css';

const USUARIOS_POR_PAGINA = 10;
const FILTROS_INICIALES = { rol: '', estado: '' };
const PENDIENTES = { rol: 'asesor', estado: 'pendiente_validacion' };

const AVISO_REGISTRAR = 'Disponible cuando HU-1 publique el registro por coordinación.';
const AVISO_CARRERA = 'El servidor aún no filtra por carrera o departamento.';

// Clase CSS de cada estado de la base
const CLASE_ESTADO = {
  activo: 'estado-activo',
  bloqueado: 'estado-bloqueado',
  pendiente_validacion: 'estado-pendiente',
};

/** Conteos del subtítulo y del botón de validación. */
async function cargarConteos() {
  const [total, estudiantes, asesores, coordinadores, bloqueados, pendientes] = await Promise.all([
    contarUsuarios({}),
    contarUsuarios({ rol: 'estudiante' }),
    contarUsuarios({ rol: 'asesor' }),
    contarUsuarios({ rol: 'coordinador' }),
    contarUsuarios({ estado: 'bloqueado' }),
    contarUsuarios(PENDIENTES),
  ]);
  return { total, estudiantes, asesores, coordinadores, bloqueados, pendientes };
}

export default function GestionUsuarios() {
  const { usuario: usuarioSesion } = useAuth();
  const { mostrar } = useToast();

  // filtros de búsqueda (se aplican en el servidor)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const busquedaRetardada = useRetardo(busqueda.trim(), 400);

  // La página se guarda junto con los filtros con los que se eligió:
  // si cambia cualquier filtro o la búsqueda, se vuelve a la página 1.
  const claveFiltros = JSON.stringify({ ...filtros, q: busquedaRetardada });
  const [paginaElegida, setPaginaElegida] = useState({ clave: claveFiltros, numero: 1 });
  const paginaActual = paginaElegida.clave === claveFiltros ? paginaElegida.numero : 1;
  const irAPagina = (numero) => setPaginaElegida({ clave: claveFiltros, numero });

  // estados para controlar las ventanas emergentes (modales)
  const [usuarioABloquear, setUsuarioABloquear] = useState(null);
  const [asesorAValidar, setAsesorAValidar] = useState(null);
  const [usuarioADesbloquear, setUsuarioADesbloquear] = useState(null);
  const [desbloqueando, setDesbloqueando] = useState(false);
  const [buscandoPendiente, setBuscandoPendiente] = useState(false);

  const peticionLista = usePeticion(
    () => listarUsuarios({ ...filtros, q: busquedaRetardada, page: paginaActual, limit: USUARIOS_POR_PAGINA }),
    [claveFiltros, paginaActual]
  );
  const usuarios = peticionLista.datos?.usuarios ?? [];
  const paginacion = peticionLista.datos?.paginacion ?? { pagina: 1, total: 0, totalPaginas: 0 };

  const peticionConteos = usePeticion(() => cargarConteos(), []);
  const conteos = peticionConteos.datos;

  const cambiarFiltro = (campo) => (e) => setFiltros((previos) => ({ ...previos, [campo]: e.target.value }));

  // recarga la página actual y los conteos después de cada acción
  const recargar = () => {
    peticionLista.reintentar();
    peticionConteos.reintentar();
  };

  // abrir ventana para validar: un asesor específico o el primer pendiente según el servidor
  const abrirValidarAsesores = async (asesorEspecifico = null) => {
    if (asesorEspecifico) {
      setAsesorAValidar(asesorEspecifico);
      return;
    }
    setBuscandoPendiente(true);
    try {
      const { usuarios: pendientes } = await listarUsuarios({ ...PENDIENTES, page: 1, limit: 1 });
      if (pendientes.length) setAsesorAValidar(pendientes[0]);
      else mostrar({ tipo: 'aviso', titulo: 'Sin pendientes', mensaje: 'No hay cuentas de asesor por validar.' });
    } catch (error) {
      mostrar({ tipo: 'error', titulo: 'No se pudo cargar', mensaje: error.message });
    } finally {
      setBuscandoPendiente(false);
    }
  };

  // bloquea al usuario; si el servidor responde con error, el modal lo muestra
  const confirmarBloqueo = async (motivo) => {
    const { usuario } = await bloquearUsuario(usuarioABloquear.id, motivo);
    setUsuarioABloquear(null);
    mostrar({ tipo: 'exito', titulo: 'Usuario bloqueado', mensaje: `${usuario.nombreCompleto} ya no puede ingresar.` });
    recargar();
  };

  // desbloquea después de la confirmación
  const confirmarDesbloqueo = async () => {
    setDesbloqueando(true);
    try {
      const { usuario } = await desbloquearUsuario(usuarioADesbloquear.id);
      mostrar({ tipo: 'exito', titulo: 'Usuario desbloqueado', mensaje: `${usuario.nombreCompleto} puede volver a ingresar.` });
      recargar();
    } catch (error) {
      mostrar({ tipo: 'error', titulo: 'No se pudo desbloquear', mensaje: error.message });
    } finally {
      setDesbloqueando(false);
      setUsuarioADesbloquear(null);
    }
  };

  // valida la cuenta del asesor con su cupo; si el servidor responde con error, el modal lo muestra
  const confirmarValidacion = async (cupoMaximo) => {
    const { usuario, cupo } = await validarAsesor(asesorAValidar.id, cupoMaximo);
    setAsesorAValidar(null);
    mostrar({
      tipo: 'exito',
      titulo: 'Asesor validado',
      mensaje: `${usuario.nombreCompleto} ya está activo con un cupo de ${cupo?.cupoMaximo ?? cupoMaximo}.`,
    });
    recargar();
  };

  const hayFiltros = Boolean(busquedaRetardada || filtros.rol || filtros.estado);
  const primeraFila = paginacion.total ? (paginacion.pagina - 1) * USUARIOS_POR_PAGINA + 1 : 0;
  const ultimaFila = primeraFila ? primeraFila + usuarios.length - 1 : 0;

  // acción de cada fila según su estado
  const accionDeFila = (u) => {
    if (u.id === usuarioSesion?.id) return <span className="hu7-texto-tu-cuenta">Tu cuenta</span>;
    if (u.estado === 'pendiente_validacion' && u.rol === 'asesor') {
      return (
        <button type="button" className="hu7-boton-validar-tabla" onClick={() => abrirValidarAsesores(u)}>
          Validar cuenta
        </button>
      );
    }
    if (u.estado === 'bloqueado') {
      return (
        <button type="button" className="hu7-boton-desbloquear" onClick={() => setUsuarioADesbloquear(u)}>
          Desbloquear
        </button>
      );
    }
    if (u.estado === 'activo') {
      return (
        <button type="button" className="hu7-boton-editar" onClick={() => setUsuarioABloquear(u)}>
          Bloquear
        </button>
      );
    }
    return null; // sin_verificar: no hay acción hasta que verifique su correo
  };

  return (
    <PageLayout>
      <main className="hu7-contenido-principal">

        <div className="hu7-contenedorSUP">
          <div className="hu7-titulo-seccion">
            <h6 className="hu7-subtitulo-pantalla">Inicio · Usuarios</h6>
            <h1 className="hu7-titulo-pantalla">Gestión de usuarios</h1>
            <h6 className="hu7-subtitulo-pantalla2">
              {conteos
                ? `${conteos.total} usuarios · ${conteos.estudiantes} estudiantes · ${conteos.asesores} asesores · ${conteos.coordinadores} administradores · ${conteos.bloqueados} bloqueados`
                : peticionConteos.cargando ? 'Cargando…' : ''}
            </h6>
          </div>

          <div className="hu7-barra-controles">
            <button
              type="button"
              className="hu7-boton-validar"
              disabled={!conteos?.pendientes || buscandoPendiente}
              onClick={() => abrirValidarAsesores()}   >
              Validar cuentas de asesor ({conteos?.pendientes ?? '…'})
            </button>
            <span title={AVISO_REGISTRAR}>
              <button
                type="button"
                className="hu7-boton-registrar"
                disabled
                aria-describedby="aviso-registrar"   >
                Registrar usuario
              </button>
            </span>
            <span id="aviso-registrar" hidden>{AVISO_REGISTRAR}</span>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="hu7-contenedorINF">

          {/* Barra de Filtros */}
          <div className="hu7-barra-filtros-usuarios">
            <div className="hu7-filtro-buscar">
              <label htmlFor="input-buscar-usuario">BUSCAR</label>
              <input
                id="input-buscar-usuario"
                type="text"
                placeholder="Nombre, correo o código..."
                className="hu7-input-buscar"
                maxLength={100}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}/>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-rol">ROL</label>
              <select
                id="seleccionar-rol"
                value={filtros.rol}
                onChange={cambiarFiltro('rol')}
                className="hu7-seleccionar-filtro">

                <option value="">Todos</option>
                {Object.entries(ETIQUETA_ROL).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>{etiqueta}</option>
                ))}
              </select>
            </div>

            <div className="hu7-filtro-seleccionar">
              <label htmlFor="seleccionar-estado-usuario">ESTADO</label>
              <select
                id="seleccionar-estado-usuario"
                value={filtros.estado}
                onChange={cambiarFiltro('estado')}
                className="hu7-seleccionar-filtro">

                <option value="">Todos</option>
                {Object.entries(ETIQUETA_ESTADO_USUARIO).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>{etiqueta}</option>
                ))}
              </select>
            </div>

            <div className="hu7-filtro-seleccionar" title={AVISO_CARRERA}>
              <label htmlFor="seleccionar-carrera-dpto">CARRERA / DEPARTAMENTO</label>
              <select
                id="seleccionar-carrera-dpto"
                value=""
                disabled
                aria-describedby="aviso-carrera"
                className="hu7-seleccionar-filtro">
                <option value="">Todos</option>
              </select>
              <span id="aviso-carrera" hidden>{AVISO_CARRERA}</span>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="hu7-tarjeta-tabla-usuarios">
            <EstadoVista
              cargando={peticionLista.cargando && !peticionLista.datos}
              error={peticionLista.error}
              alReintentar={peticionLista.reintentar}>
            <table className="hu7-tabla-usuarios" aria-busy={peticionLista.cargando}>
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>ROL</th>
                  <th>CARRERA / DEPARTAMENTO</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="hu7-col-usuario">
                        <div className="hu7-nombre-usuario">{u.nombreCompleto}</div>
                        <div className="hu7-meta-usuario">
                          {u.correo} {u.codigo ? `· ${u.codigo}` : ''}
                        </div>
                      </td>

                      <td>
                        <span className="hu7-texto-rol">{ETIQUETA_ROL[u.rol] ?? u.rol}</span>
                      </td>

                      <td>{u.carreraDepartamento ?? '—'}</td>

                      <td>
                        <span className={`hu7-estado ${CLASE_ESTADO[u.estado] ?? ''}`}>
                          {ETIQUETA_ESTADO_USUARIO[u.estado] ?? u.estado}
                        </span>
                      </td>

                      <td>{accionDeFila(u)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="hu7-tabla-vacia">
                      {hayFiltros
                        ? 'No se encontraron usuarios con los criterios seleccionados.'
                        : 'Aún no hay usuarios registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación del servidor */}
            <div className="hu7-paginacion-usuarios">
              <span>
                Mostrando {primeraFila ? `${primeraFila}-${ultimaFila}` : '0'} de {paginacion.total}
              </span>
              <div className="hu7-botones-paginacion">
                <button
                  type="button"
                  className="hu7-boton-pag"
                  disabled={paginaActual <= 1 || peticionLista.cargando}
                  onClick={() => irAPagina(paginaActual - 1)}  >
                  Anterior
                </button>

                {Array.from({ length: paginacion.totalPaginas }, (_, index) => (
                  <button
                    key={index + 1}
                    type="button"
                    className={`hu7-boton-pag ${paginaActual === index + 1 ? 'active' : ''}`}
                    disabled={peticionLista.cargando}
                    onClick={() => irAPagina(index + 1)}     >
                    {index + 1}
                  </button>
                ))}

                <button
                  type="button"
                  className="hu7-boton-pag"
                  disabled={paginaActual >= paginacion.totalPaginas || peticionLista.cargando}
                  onClick={() => irAPagina(paginaActual + 1)}     >
                  Siguiente
                </button>
              </div>
            </div>
            </EstadoVista>

          </div>

        </div>

        {/* Ventanas Emergentes (con key para que empiecen vacías en cada apertura) */}
        {usuarioABloquear && (
          <ModalBloquearUsuario
            key={usuarioABloquear.id}
            usuario={usuarioABloquear}
            alCerrar={() => setUsuarioABloquear(null)}
            alConfirmar={confirmarBloqueo} />
        )}

        {asesorAValidar && (
          <ModalValidarAsesor
            key={asesorAValidar.id}
            asesor={asesorAValidar}
            alCerrar={() => setAsesorAValidar(null)}
            alConfirmar={confirmarValidacion} />
        )}

        <ConfirmDialog
          abierto={Boolean(usuarioADesbloquear)}
          titulo="Desbloquear usuario"
          mensaje={usuarioADesbloquear ? `¿Desbloquear a ${usuarioADesbloquear.nombreCompleto}? Podrá volver a ingresar de inmediato.` : ''}
          textoConfirmar="Desbloquear"
          variante="primario"
          procesando={desbloqueando}
          onConfirmar={confirmarDesbloqueo}
          onCancelar={() => setUsuarioADesbloquear(null)} />

      </main>
    </PageLayout>
  );
}

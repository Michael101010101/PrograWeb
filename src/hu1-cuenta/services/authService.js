import ServiceError from './ServiceError.js';
import * as usuarios from './usuariosRepository.js';
import * as tokens from './tokensRepository.js';
import * as invitaciones from './invitacionesRepository.js';
import { esperar, leerObjeto, guardarObjeto } from './localStore.js';
import { hashPassword } from '../utils/hash.js';
import {
  limpiar,
  validarCambioPassword,
  validarConfirmacion,
  validarCorreo,
  validarCorreoInstitucional,
  validarPassword,
  validarPerfil,
  validarRegistroAsesor,
  validarRegistroCoordinador,
  validarRegistroEstudiante,
  DOMINIO_DOCENTE,
} from '../utils/validators.js';

// Capa de servicios de la HU-1. Los componentes solo llaman a estas funciones:
// nunca tocan localStorage ni los repositorios directamente.
// Todas son async para que en la entrega 2 se reemplacen por llamadas a la API sin tocar la UI.

const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;
const NOTIF_POR_DEFECTO = { entregables: true, retroalimentacion: true, resumenSemanal: false };

function lanzarSiHayErrores(errores) {
  if (Object.keys(errores).length > 0) {
    throw new ServiceError(400, 'Corrige los campos marcados.', { campos: errores });
  }
}

/* ─────────── Inicio de sesión ─────────── */

export async function iniciarSesion(correoIngresado, password) {
  await esperar();
  const correo = String(correoIngresado ?? '').trim().toLowerCase();
  const errorCorreo = validarCorreoInstitucional(correo);
  if (errorCorreo || !password) {
    throw new ServiceError(400, 'Completa tu correo y contraseña.', {
      campos: { correo: errorCorreo, password: password ? null : 'Ingresa tu contraseña' },
    });
  }

  const intentos = leerObjeto('intentos');
  const registro = intentos[correo] ?? { fallidos: 0, bloqueadoHasta: null };
  if (registro.bloqueadoHasta && new Date(registro.bloqueadoHasta) > new Date()) {
    const min = Math.ceil((new Date(registro.bloqueadoHasta) - new Date()) / 60000);
    throw new ServiceError(423, `Superaste los intentos permitidos. Vuelve a intentarlo en ${min} min o recupera tu contraseña.`);
  }

  const usuario = usuarios.buscarPorCorreo(correo);
  const hash = await hashPassword(correo, password);

  if (!usuario || usuario.passwordHash !== hash) {
    const fallidos = registro.fallidos + 1;
    const bloquear = fallidos >= MAX_INTENTOS;
    intentos[correo] = {
      fallidos: bloquear ? 0 : fallidos,
      bloqueadoHasta: bloquear ? new Date(Date.now() + MINUTOS_BLOQUEO * 60000).toISOString() : null,
    };
    guardarObjeto('intentos', intentos);
    if (bloquear) {
      throw new ServiceError(423, `Superaste los intentos permitidos. Tu acceso queda bloqueado ${MINUTOS_BLOQUEO} minutos.`);
    }
    const restantes = MAX_INTENTOS - fallidos;
    throw new ServiceError(
      401,
      `El correo o la contraseña no coinciden. Te ${restantes === 1 ? 'queda 1 intento' : `quedan ${restantes} intentos`} antes del bloqueo temporal de ${MINUTOS_BLOQUEO} minutos.`,
      { campos: { password: 'Contraseña incorrecta' }, datos: { restantes } }
    );
  }

  // Credenciales correctas: se limpia el contador aunque la cuenta no esté habilitada.
  delete intentos[correo];
  guardarObjeto('intentos', intentos);

  if (usuario.estado === 'sin_verificar') {
    throw new ServiceError(403, 'Tu cuenta aún no está verificada. Revisa el enlace que enviamos a tu correo.', {
      datos: { motivo: 'sin_verificar', usuarioId: usuario.id },
    });
  }
  if (usuario.estado === 'pendiente_validacion') {
    throw new ServiceError(403, 'Tu cuenta de asesor está pendiente de validación por la coordinación. Te avisaremos por correo.', {
      datos: { motivo: 'pendiente_validacion' },
    });
  }
  if (usuario.estado === 'bloqueado') {
    throw new ServiceError(403, `Tu cuenta está bloqueada. Motivo: ${usuario.motivoBloqueo ?? 'no especificado'}. Escribe a tfc@ulima.edu.pe.`, {
      datos: { motivo: 'bloqueado' },
    });
  }

  const ingresoAnterior = usuario.ultimoIngreso;
  const actualizado = usuarios.actualizar(usuario.id, { ultimoIngreso: new Date().toISOString() });
  return { usuario: usuarios.sinSecretos(actualizado), ingresoAnterior };
}

export async function obtenerUsuarioSesion(usuarioId) {
  const u = usuarios.buscarPorId(usuarioId);
  if (!u || u.estado !== 'activo') return null;
  return usuarios.sinSecretos(u);
}

/* ─────────── Registro ─────────── */

function verificarDuplicados({ correo, codigoAlumno }) {
  const campos = {};
  if (usuarios.buscarPorCorreo(correo)) campos.correo = 'Ya existe una cuenta con este correo';
  if (codigoAlumno && usuarios.buscarPorCodigoAlumno(codigoAlumno)) campos.codigoAlumno = 'Este código ya está registrado';
  if (Object.keys(campos).length) {
    throw new ServiceError(409, 'No pudimos crear la cuenta: corrige los campos marcados.', { campos });
  }
}

export async function registrarEstudiante(datos) {
  await esperar();
  lanzarSiHayErrores(validarRegistroEstudiante(datos));
  const correo = datos.correo.trim().toLowerCase();
  const codigoAlumno = datos.codigoAlumno.trim();
  verificarDuplicados({ correo, codigoAlumno });

  const nuevo = usuarios.crear({
    rol: 'estudiante',
    estado: 'sin_verificar',
    nombres: limpiar(datos.nombres),
    apellidos: limpiar(datos.apellidos),
    correo,
    passwordHash: await hashPassword(correo, datos.password),
    telefono: '',
    carrera: datos.carrera,
    ciclo: datos.ciclo,
    codigoAlumno,
    notificaciones: NOTIF_POR_DEFECTO,
    creadoEn: new Date().toISOString(),
    ultimoIngreso: null,
  });
  const verificacion = tokens.emitir('verificacion', nuevo.id);
  // Sin envío real de correos (fuera de alcance): se devuelve el enlace para la demo.
  return { usuario: usuarios.sinSecretos(nuevo), enlaceDemo: `/verificar/${verificacion.token}` };
}

export async function registrarAsesor(datos) {
  await esperar();
  lanzarSiHayErrores(validarRegistroAsesor(datos));
  const correo = datos.correo.trim().toLowerCase();
  verificarDuplicados({ correo });

  const nuevo = usuarios.crear({
    rol: 'asesor',
    estado: 'pendiente_validacion', // la coordinación lo habilita (HU-7)
    nombres: limpiar(datos.nombres),
    apellidos: limpiar(datos.apellidos),
    correo,
    passwordHash: await hashPassword(correo, datos.password),
    telefono: '',
    gradoAcademico: datos.gradoAcademico,
    departamento: datos.departamento,
    notificaciones: NOTIF_POR_DEFECTO,
    creadoEn: new Date().toISOString(),
    ultimoIngreso: null,
  });
  return { usuario: usuarios.sinSecretos(nuevo) };
}

/* ─────────── Coordinador por invitación ─────────── */

export async function consultarInvitacion(codigo) {
  await esperar(200);
  const inv = invitaciones.buscarPorCodigo(codigo);
  if (!inv) throw new ServiceError(404, 'El código de invitación no existe. Revisa que esté escrito completo.');
  const estado = invitaciones.estadoDe(inv);
  if (estado === 'usada') throw new ServiceError(409, 'Esta invitación ya se usó para crear una cuenta.');
  if (estado === 'vencida') throw new ServiceError(410, 'Esta invitación venció. Pide a la coordinación una nueva.');
  if (estado === 'revocada') throw new ServiceError(410, 'Esta invitación fue anulada por la coordinación.');
  return { codigo: inv.codigo, correo: inv.correo, venceEn: inv.venceEn };
}

export async function registrarCoordinador(codigo, datos) {
  const inv = await consultarInvitacion(codigo);
  lanzarSiHayErrores(validarRegistroCoordinador(datos));
  verificarDuplicados({ correo: inv.correo });

  const nuevo = usuarios.crear({
    rol: 'coordinador',
    estado: 'activo',
    nombres: limpiar(datos.nombres),
    apellidos: limpiar(datos.apellidos),
    correo: inv.correo,
    passwordHash: await hashPassword(inv.correo, datos.password),
    telefono: '',
    cargo: 'Coordinación TFC',
    notificaciones: NOTIF_POR_DEFECTO,
    creadoEn: new Date().toISOString(),
    ultimoIngreso: null,
  });
  invitaciones.actualizar(inv.codigo, { usada: true, usadaPor: nuevo.id, usadaEn: new Date().toISOString() });
  return { usuario: usuarios.sinSecretos(nuevo) };
}

export async function crearInvitacion(solicitante, correoIngresado) {
  await esperar();
  if (solicitante?.rol !== 'coordinador') throw new ServiceError(403, 'Solo la coordinación puede invitar.');
  const correo = String(correoIngresado ?? '').trim().toLowerCase();
  const error = validarCorreo(correo, DOMINIO_DOCENTE);
  if (error) throw new ServiceError(400, 'Revisa el correo.', { campos: { correo: error } });
  if (usuarios.buscarPorCorreo(correo)) {
    throw new ServiceError(409, 'Ya existe una cuenta con ese correo.', { campos: { correo: 'Ya existe una cuenta con este correo' } });
  }
  const vigente = invitaciones.listar().find((i) => i.correo === correo && invitaciones.estadoDe(i) === 'vigente');
  if (vigente) {
    throw new ServiceError(409, 'Ese correo ya tiene una invitación vigente.', { campos: { correo: 'Ya tiene una invitación vigente' } });
  }
  return invitaciones.crear({ correo, invitadoPor: solicitante.id });
}

export async function listarInvitaciones(solicitante) {
  await esperar(150);
  if (solicitante?.rol !== 'coordinador') throw new ServiceError(403, 'Solo la coordinación puede ver las invitaciones.');
  return invitaciones
    .listar()
    .map((i) => ({ ...i, estado: invitaciones.estadoDe(i) }))
    .sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn));
}

export async function anularInvitacion(solicitante, codigo) {
  await esperar();
  if (solicitante?.rol !== 'coordinador') throw new ServiceError(403, 'Solo la coordinación puede anular invitaciones.');
  const inv = invitaciones.buscarPorCodigo(codigo);
  if (!inv) throw new ServiceError(404, 'La invitación no existe.');
  if (invitaciones.estadoDe(inv) !== 'vigente') throw new ServiceError(409, 'Solo se pueden anular invitaciones vigentes.');
  invitaciones.actualizar(codigo, { revocada: true });
}

/* ─────────── Verificación de correo ─────────── */

export async function verificarCorreo(token) {
  await esperar();
  const { estado, registro } = tokens.consultar(token, 'verificacion');
  if (estado === 'inexistente') throw new ServiceError(404, 'El enlace de verificación no es válido.');
  if (estado === 'usado') throw new ServiceError(409, 'Este enlace ya se usó. Si tu cuenta está verificada, ya puedes ingresar.');
  if (estado === 'vencido') throw new ServiceError(410, 'El enlace venció. Solicita uno nuevo desde el inicio de sesión.', { datos: { usuarioId: registro.usuarioId } });
  tokens.marcarUsado(token);
  const u = usuarios.actualizar(registro.usuarioId, { estado: 'activo' });
  return usuarios.sinSecretos(u);
}

export async function reenviarVerificacion(usuarioId) {
  await esperar();
  const u = usuarios.buscarPorId(usuarioId);
  if (!u) throw new ServiceError(404, 'No encontramos la cuenta.');
  if (u.estado !== 'sin_verificar') throw new ServiceError(409, 'Tu cuenta ya está verificada.');
  const t = tokens.emitir('verificacion', u.id);
  return { correo: u.correo, enlaceDemo: `/verificar/${t.token}` };
}

/* ─────────── Recuperación de contraseña ─────────── */

export async function solicitarRecuperacion(correoIngresado) {
  await esperar();
  const correo = String(correoIngresado ?? '').trim().toLowerCase();
  const error = validarCorreoInstitucional(correo);
  if (error) throw new ServiceError(400, 'Revisa el correo.', { campos: { correo: error } });

  const u = usuarios.buscarPorCorreo(correo);
  // Por seguridad la respuesta visible es la misma exista o no la cuenta.
  if (!u || u.estado === 'bloqueado') return { correo, enlaceDemo: null };
  const t = tokens.emitir('recuperacion', u.id);
  return { correo, enlaceDemo: `/recuperar/${t.token}` };
}

export async function validarEnlaceRecuperacion(token) {
  await esperar(200);
  const { estado, registro } = tokens.consultar(token, 'recuperacion');
  if (estado === 'inexistente') throw new ServiceError(404, 'El enlace no es válido.');
  if (estado === 'usado') throw new ServiceError(409, 'Este enlace ya se usó.');
  if (estado === 'vencido') throw new ServiceError(410, 'El enlace venció: solo dura 60 minutos.');
  const u = usuarios.buscarPorId(registro.usuarioId);
  return { correo: u.correo };
}

export async function restablecerPassword(token, nueva, confirmacion) {
  const { correo } = await validarEnlaceRecuperacion(token);
  const errores = Object.fromEntries(
    Object.entries({ nueva: validarPassword(nueva), confirmacion: validarConfirmacion(nueva, confirmacion) }).filter(([, v]) => v)
  );
  lanzarSiHayErrores(errores);
  const u = usuarios.buscarPorCorreo(correo);
  const passwordHash = await hashPassword(correo, nueva);
  // Si la cuenta no estaba verificada, recuperar la contraseña también prueba que el correo es suyo.
  usuarios.actualizar(u.id, {
    passwordHash,
    estado: u.estado === 'sin_verificar' ? 'activo' : u.estado,
  });
  tokens.marcarUsado(token);
  const intentos = leerObjeto('intentos');
  delete intentos[correo];
  guardarObjeto('intentos', intentos);
}

/* ─────────── Mi cuenta ─────────── */

export async function actualizarCuenta(usuarioId, perfil, cambioPassword) {
  await esperar();
  const actual = usuarios.buscarPorId(usuarioId);
  if (!actual) throw new ServiceError(404, 'No encontramos tu cuenta.');

  const errores = { ...validarPerfil(perfil, actual.rol), ...prefijar(validarCambioPassword(cambioPassword), 'password_') };
  lanzarSiHayErrores(errores);

  const cambios = {
    nombres: limpiar(perfil.nombres),
    apellidos: limpiar(perfil.apellidos),
    telefono: String(perfil.telefono ?? '').replace(/\s/g, ''),
    notificaciones: { ...NOTIF_POR_DEFECTO, ...perfil.notificaciones },
  };
  // Campos que solo cambia la coordinación: correo, rol, código de alumno, estado.
  if (actual.rol === 'estudiante') Object.assign(cambios, { carrera: perfil.carrera, ciclo: perfil.ciclo });
  if (actual.rol === 'asesor') Object.assign(cambios, { gradoAcademico: perfil.gradoAcademico, departamento: perfil.departamento });

  let cambioClave = false;
  if (cambioPassword?.actual) {
    const hashActual = await hashPassword(actual.correo, cambioPassword.actual);
    if (hashActual !== actual.passwordHash) {
      throw new ServiceError(401, 'La contraseña actual es incorrecta. Intenta de nuevo.', {
        campos: { password_actual: 'Contraseña incorrecta' },
      });
    }
    cambios.passwordHash = await hashPassword(actual.correo, cambioPassword.nueva);
    cambioClave = true;
  }

  const actualizado = usuarios.actualizar(usuarioId, cambios);
  return { usuario: usuarios.sinSecretos(actualizado), cambioClave };
}

function prefijar(obj, prefijo) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [prefijo + k, v]));
}

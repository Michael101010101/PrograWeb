import ServiceError from '../../hu1-cuenta/services/ServiceError.js';
import * as usuarios from '../../hu1-cuenta/services/usuariosRepository.js';
import { esperar, guardarObjeto, leerObjeto } from '../../hu1-cuenta/services/localStore.js';
import { PERIODO } from '../../shared/config/periodo.js';
import { iniciales } from '../../shared/utils/formato.js';
import * as trabajos from './trabajosRepository.js';
import { ESTADOS, LIMITES, PLANTILLA_PLAN, TRANSICIONES } from '../config.js';
import { limpiar, validarMotivo, validarTrabajo } from '../utils/validaciones.js';

const ESTADOS_EDITABLES = ['propuesta', 'en_desarrollo'];
const CLAVE_BORRADORES = 'borradoresTrabajo';

function sinAcentos(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function datosIntegrante(usuarioId) {
  const u = usuarios.buscarPorId(usuarioId);
  if (!u) return { usuarioId, nombre: 'Integrante no encontrado', iniciales: '?', codigo: '', carrera: '', ciclo: '' };
  return {
    usuarioId,
    nombres: u.nombres,
    apellidos: u.apellidos,
    nombre: `${u.nombres} ${u.apellidos}`,
    iniciales: iniciales(u.nombres, u.apellidos),
    codigo: u.codigoAlumno ?? '',
    carrera: u.carrera ?? '',
    ciclo: u.ciclo ?? '',
  };
}

function aVista(t) {
  if (!t) return null;
  return {
    ...t,
    integrantes: t.integrantes.map((i) => ({ ...datosIntegrante(i.usuarioId), responsable: i.responsable })),
  };
}

function esResponsable(t, usuarioId) {
  return t.integrantes.some((i) => i.usuarioId === usuarioId && i.responsable);
}

function obtenerOFallar(trabajoId) {
  const t = trabajos.buscarPorId(trabajoId);
  if (!t) throw new ServiceError(404, 'No encontramos el trabajo. Puede haber sido retirado.');
  return t;
}

function exigirResponsable(t, usuario, accion) {
  if (!esResponsable(t, usuario.id)) {
    throw new ServiceError(403, `Solo el responsable del equipo puede ${accion}.`);
  }
}

function exigirEditable(t) {
  if (!ESTADOS_EDITABLES.includes(t.estado)) {
    throw new ServiceError(409, `El trabajo está ${ESTADOS[t.estado].label.toLowerCase()}: la ficha queda en modo lectura.`);
  }
}

export async function obtenerMiTrabajo(usuarioId) {
  await esperar(200);
  const propios = trabajos.listarPorIntegrante(usuarioId);
  const vigente = trabajos.buscarVigentePorIntegrante(usuarioId);
  const desistido = propios
    .filter((t) => t.estado === 'desistido')
    .sort((a, b) => String(b.cerradoEn).localeCompare(String(a.cerradoEn)))[0] ?? null;
  return { trabajo: aVista(vigente), ultimoDesistido: desistido };
}

export function resumenTrabajoVigente(usuarioId) {
  const t = trabajos.buscarVigentePorIntegrante(usuarioId);
  if (!t) return null;
  return { id: t.id, codigo: t.codigo, titulo: t.titulo, estado: t.estado, avance: t.avance?.porcentaje ?? 0, sinAsesor: !t.asesor };
}

function normalizarDatos(datos) {
  return {
    titulo: limpiar(datos.titulo),
    linea: datos.linea,
    resumen: String(datos.resumen ?? '').trim(),
    objetivos: String(datos.objetivos ?? '').trim(),
    palabrasClave: (datos.palabrasClave ?? []).map((p) => limpiar(p).toLowerCase()).filter(Boolean),
  };
}

function lanzarSiHayErrores(errores) {
  const n = Object.keys(errores).length;
  if (n > 0) {
    throw new ServiceError(400, `Revisa ${n} campo${n === 1 ? '' : 's'} antes de continuar.`, { campos: errores });
  }
}

export async function registrarTrabajo(usuario, datos) {
  await esperar();
  if (usuario.rol !== 'estudiante') throw new ServiceError(403, 'Solo los estudiantes registran trabajos.');

  const limpio = normalizarDatos(datos);
  lanzarSiHayErrores(validarTrabajo(limpio));

  const vigente = trabajos.buscarVigentePorIntegrante(usuario.id);
  if (vigente) {
    throw new ServiceError(409, 'Ya tienes un trabajo vigente.', { datos: { trabajo: aVista(vigente) } });
  }

  const ahora = new Date().toISOString();
  const nuevo = trabajos.crear({
    ...limpio,
    codigo: trabajos.siguienteCodigo(PERIODO.semestre),
    carrera: usuario.carrera,
    estado: 'propuesta',
    integrantes: [{ usuarioId: usuario.id, responsable: true }],
    asesor: null,
    avance: { porcentaje: 0, aprobados: 0, total: PLANTILLA_PLAN.length, proximoVencimiento: null, vencido: null },
    registradoEn: ahora,
    cerradoEn: null,
    historial: [{ de: null, a: 'propuesta', motivo: 'Registro del trabajo', fecha: ahora, usuarioId: usuario.id }],
  });
  descartarBorrador(usuario.id);
  return aVista(nuevo);
}

export async function actualizarFicha(usuario, trabajoId, datos) {
  await esperar();
  const t = obtenerOFallar(trabajoId);
  exigirResponsable(t, usuario, 'editar la ficha');
  exigirEditable(t);

  const limpio = normalizarDatos(datos);
  lanzarSiHayErrores(validarTrabajo(limpio));
  if (t.asesor && limpio.linea !== t.linea) {
    throw new ServiceError(409, 'La línea de investigación no puede cambiarse con un asesor asignado.', {
      campos: { linea: 'No editable: ya tienes asesor en esta línea' },
    });
  }
  return aVista(trabajos.actualizar(t.id, limpio));
}

export function obtenerBorrador(usuarioId) {
  return leerObjeto(CLAVE_BORRADORES)[usuarioId] ?? null;
}

export function guardarBorrador(usuarioId, valores) {
  const todos = leerObjeto(CLAVE_BORRADORES);
  const guardadoEn = new Date().toISOString();
  todos[usuarioId] = { valores, guardadoEn };
  guardarObjeto(CLAVE_BORRADORES, todos);
  return guardadoEn;
}

export function descartarBorrador(usuarioId) {
  const todos = leerObjeto(CLAVE_BORRADORES);
  delete todos[usuarioId];
  guardarObjeto(CLAVE_BORRADORES, todos);
}

function ocupacion(usuarioId, trabajoId) {
  const otro = trabajos.buscarVigentePorIntegrante(usuarioId);
  if (!otro || otro.id === trabajoId) return null;
  return { trabajoId: otro.id, titulo: otro.titulo, estado: otro.estado, desde: otro.registradoEn };
}

export async function buscarEstudiantes(texto, trabajoId) {
  await esperar(150);
  const q = sinAcentos(limpiar(texto));
  if (q.length < LIMITES.busquedaMin) return [];
  return usuarios
    .listar()
    .filter((u) => u.rol === 'estudiante' && u.estado !== 'bloqueado')
    .filter((u) => sinAcentos(`${u.nombres} ${u.apellidos}`).includes(q) || String(u.codigoAlumno ?? '').includes(q))
    .slice(0, 8)
    .map((u) => ({ ...datosIntegrante(u.id), ocupadoEn: ocupacion(u.id, trabajoId) }));
}

export async function guardarEquipo(usuario, trabajoId, integrantes) {
  await esperar();
  const t = obtenerOFallar(trabajoId);
  exigirResponsable(t, usuario, 'gestionar el equipo');
  exigirEditable(t);

  const ids = integrantes.map((i) => i.usuarioId);
  if (ids.length < 1 || ids.length > LIMITES.integrantesMax) {
    throw new ServiceError(400, `El equipo debe tener de 1 a ${LIMITES.integrantesMax} integrantes.`);
  }
  if (new Set(ids).size !== ids.length) throw new ServiceError(400, 'Hay integrantes repetidos.');
  if (integrantes.filter((i) => i.responsable).length !== 1) {
    throw new ServiceError(400, 'El equipo debe tener exactamente un responsable.');
  }
  if (!ids.includes(usuario.id)) {
    throw new ServiceError(400, 'No puedes retirarte a ti mismo. Transfiere la responsabilidad y pide que te retiren.');
  }

  for (const id of ids) {
    const u = usuarios.buscarPorId(id);
    if (!u || u.rol !== 'estudiante' || u.estado === 'bloqueado') {
      throw new ServiceError(400, 'Uno de los integrantes no es un estudiante habilitado.');
    }
    const ocupado = ocupacion(id, t.id);
    if (ocupado) {
      throw new ServiceError(409, `${u.nombres} ${u.apellidos} ya participa en otro trabajo vigente.`, {
        datos: { integrante: datosIntegrante(id), ocupadoEn: ocupado },
      });
    }
  }

  const actualizado = trabajos.actualizar(t.id, {
    integrantes: integrantes.map((i) => ({ usuarioId: i.usuarioId, responsable: Boolean(i.responsable) })),
  });
  return aVista(actualizado);
}

export function transicionesPermitidas(trabajo) {
  return TRANSICIONES[trabajo.estado] ?? [];
}

export async function cambiarEstado(usuario, trabajoId, destino, motivo) {
  await esperar();
  const t = obtenerOFallar(trabajoId);
  exigirResponsable(t, usuario, 'cambiar el estado');

  if (!transicionesPermitidas(t).includes(destino)) {
    throw new ServiceError(409, `No se puede pasar de ${ESTADOS[t.estado].label} a ${ESTADOS[destino]?.label ?? destino}.`);
  }
  const errorMotivo = validarMotivo(motivo);
  if (errorMotivo) throw new ServiceError(400, errorMotivo, { campos: { motivo: errorMotivo } });

  if (destino === 'concluido') {
    const { aprobados = 0, total = 0 } = t.avance ?? {};
    const pendientes = total - aprobados;
    if (total === 0 || pendientes > 0) {
      throw new ServiceError(409, `Quedan ${pendientes} entregable${pendientes === 1 ? '' : 's'} sin aprobar.`);
    }
  }

  const ahora = new Date().toISOString();
  const actualizado = trabajos.actualizar(t.id, {
    estado: destino,
    cerradoEn: ahora,
    ...(destino === 'desistido' && t.asesor ? { asesor: { ...t.asesor, cupoLiberado: true } } : {}),
    historial: [...(t.historial ?? []), { de: t.estado, a: destino, motivo: motivo.trim(), fecha: ahora, usuarioId: usuario.id }],
  });

  const notificados = t.asesor ? `${t.asesor.genero === 'f' ? 'a la asesora' : 'al asesor'} y a la coordinación` : 'a la coordinación';
  return { trabajo: aVista(actualizado), notificados };
}
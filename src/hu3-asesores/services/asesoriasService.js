import { DATOS_SEMILLA, GRADOS } from '../data/datosSemilla.js';
import { HOY } from '../utils/fechas.js';

// Servicio de la HU-3: toda la lógica y las validaciones viven aquí, no en los componentes.
// Cada función que modifica algo recibe los datos actuales y DEVUELVE datos nuevos
// (no modifica el objeto original), y lanza un Error con un mensaje si algo no es válido.
// En la entrega 2 estas funciones pasarán a llamar a la API con fetch.

const CLAVE = 'tfc.hu3';

// ─────────── Persistencia en localStorage ───────────

export function cargarDatos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado) return guardado;
  } catch {
    /* dato corrupto: se vuelve a la semilla */
  }
  const iniciales = structuredClone(DATOS_SEMILLA);
  guardarDatos(iniciales);
  return iniciales;
}

export function guardarDatos(datos) {
  localStorage.setItem(CLAVE, JSON.stringify(datos));
}

// ─────────── Consultas (no modifican nada) ───────────

export const cupoDisponible = (asesor) => asesor.cupoMaximo - asesor.cupoOcupado;

export const nombreAsesor = (asesor) => `${asesor.titulo} ${asesor.nombres} ${asesor.apellidos}`;

export const inicialesAsesor = (asesor) => `${asesor.nombres[0]}${asesor.apellidos[0]}`.toUpperCase();

export function buscarAsesor(datos, asesorId) {
  return datos.asesores.find((a) => a.id === asesorId) ?? null;
}

// Ficha del asesor que inició sesión (se enlaza por el id de usuario de la HU-1).
export function asesorDeUsuario(datos, usuarioId) {
  return datos.asesores.find((a) => a.usuarioId === usuarioId) ?? null;
}

// Trabajo vigente del estudiante que inició sesión.
export function trabajoDeEstudiante(datos, usuarioId) {
  return datos.trabajos.find((t) => t.integrantes.some((i) => i.usuarioId === usuarioId)) ?? null;
}

// La única solicitud pendiente de un trabajo (o null).
export function solicitudActiva(datos, codigoTrabajo) {
  return datos.solicitudes.find((s) => s.trabajo.codigo === codigoTrabajo && s.estado === 'pendiente') ?? null;
}

export function solicitudesDeAsesor(datos, asesorId) {
  return datos.solicitudes.filter((s) => s.asesorId === asesorId);
}

export function trabajosDeAsesor(datos, asesorId) {
  return datos.trabajos.filter((t) => t.asesorId === asesorId);
}

// Entregables de los trabajos del asesor, ordenados por fecha (el más cercano primero).
export function vencimientosDeAsesor(datos, asesorId) {
  const trabajos = trabajosDeAsesor(datos, asesorId);
  return datos.vencimientos
    .filter((v) => trabajos.some((t) => t.codigo === v.trabajoCodigo))
    .map((v) => ({ ...v, tituloTrabajo: trabajos.find((t) => t.codigo === v.trabajoCodigo).titulo }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// Filtra el directorio con los filtros de la pantalla 3.2.
export function filtrarAsesores(asesores, { texto, linea, departamento, soloConCupo }) {
  const buscado = texto.trim().toLowerCase();
  return asesores.filter((a) => {
    if (buscado && !nombreAsesor(a).toLowerCase().includes(buscado)) return false;
    if (linea && !a.lineas.includes(linea)) return false;
    if (departamento && a.departamento !== departamento) return false;
    if (soloConCupo && cupoDisponible(a) === 0) return false;
    return true;
  });
}

// Devuelve una copia ordenada (sort modifica el arreglo, por eso se copia con spread).
export function ordenarAsesores(asesores, criterio) {
  const copia = [...asesores];
  if (criterio === 'nombre') return copia.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
  if (criterio === 'experiencia') return copia.sort((a, b) => b.trabajosAsesorados - a.trabajosAsesorados);
  return copia.sort((a, b) => cupoDisponible(b) - cupoDisponible(a)); // 'cupo'
}

// ─────────── Acciones del estudiante ───────────

export function solicitarAsesoria(datos, { codigoTrabajo, asesorId, mensaje }) {
  const trabajo = datos.trabajos.find((t) => t.codigo === codigoTrabajo);
  const asesor = buscarAsesor(datos, asesorId);
  const texto = mensaje.trim();

  if (!trabajo) throw new Error('Primero debes registrar tu trabajo.');
  if (trabajo.asesorId) throw new Error('Tu trabajo ya tiene un asesor asignado.');
  if (solicitudActiva(datos, codigoTrabajo)) throw new Error('Ya tienes una solicitud activa para este trabajo.');
  if (!asesor || cupoDisponible(asesor) === 0) throw new Error('Este asesor no tiene cupo disponible.');
  if (!asesor.lineas.includes(trabajo.linea)) throw new Error(`El asesor no atiende la línea ${trabajo.linea}.`);
  if (texto.length < 20) throw new Error('El mensaje de sustento debe tener al menos 20 caracteres.');
  if (texto.length > 600) throw new Error('El mensaje de sustento no puede superar los 600 caracteres.');

  const nueva = {
    id: `s-${Date.now()}`,
    asesorId,
    estado: 'pendiente',
    fecha: HOY,
    trabajo: {
      codigo: trabajo.codigo,
      titulo: trabajo.titulo,
      linea: trabajo.linea,
      equipo: trabajo.integrantes.map((i, indice) => ({ nombre: i.nombre, responsable: indice === 0 })),
    },
    mensaje: texto,
    motivo: null,
    resueltaEl: null,
  };
  return { ...datos, solicitudes: [...datos.solicitudes, nueva] };
}

export function retirarSolicitud(datos, solicitudId) {
  return {
    ...datos,
    solicitudes: datos.solicitudes.map((s) =>
      s.id === solicitudId ? { ...s, estado: 'retirada', resueltaEl: HOY } : s
    ),
  };
}

// ─────────── Acciones del asesor ───────────

export function aceptarSolicitud(datos, solicitudId) {
  const solicitud = datos.solicitudes.find((s) => s.id === solicitudId);
  if (!solicitud || solicitud.estado !== 'pendiente') throw new Error('La solicitud ya no está pendiente.');

  const asesor = buscarAsesor(datos, solicitud.asesorId);
  // Validación del cupo al momento de aceptar
  if (cupoDisponible(asesor) === 0) throw new Error('No tienes cupo disponible para aceptar esta solicitud.');

  const ocupados = asesor.cupoOcupado + 1;
  const asesores = datos.asesores.map((a) =>
    a.id === asesor.id
      ? { ...a, cupoOcupado: ocupados, sinCupoDesde: ocupados === a.cupoMaximo ? HOY : null }
      : a
  );

  // El trabajo queda a cargo del asesor (si no existía en la vista de la HU-3, se crea).
  const existe = datos.trabajos.some((t) => t.codigo === solicitud.trabajo.codigo);
  const trabajoNuevo = {
    codigo: solicitud.trabajo.codigo,
    titulo: solicitud.trabajo.titulo,
    linea: solicitud.trabajo.linea,
    carrera: '',
    integrantes: solicitud.trabajo.equipo.map((e) => ({ usuarioId: null, nombre: e.nombre })),
    estado: 'en_desarrollo',
    avance: 0,
    porRevisar: 0,
    nota: { tono: 'warning', texto: 'Plan de entregables por definir' },
  };
  const trabajos = existe
    ? datos.trabajos.map((t) =>
        t.codigo === solicitud.trabajo.codigo
          ? { ...t, asesorId: asesor.id, estado: 'en_desarrollo', nota: trabajoNuevo.nota }
          : t
      )
    : [...datos.trabajos, { ...trabajoNuevo, asesorId: asesor.id }];

  const solicitudes = datos.solicitudes.map((s) =>
    s.id === solicitudId ? { ...s, estado: 'aceptada', resueltaEl: HOY } : s
  );

  return { ...datos, asesores, trabajos, solicitudes };
}

export function rechazarSolicitud(datos, solicitudId, motivo) {
  if (motivo.trim().length < 10) throw new Error('Escribe un motivo de al menos 10 caracteres.');
  return {
    ...datos,
    solicitudes: datos.solicitudes.map((s) =>
      s.id === solicitudId ? { ...s, estado: 'rechazada', motivo: motivo.trim(), resueltaEl: HOY } : s
    ),
  };
}

export function terminarAsesoria(datos, codigoTrabajo, motivo) {
  if (motivo.trim().length < 10) throw new Error('Escribe un motivo de al menos 10 caracteres.');
  const trabajo = datos.trabajos.find((t) => t.codigo === codigoTrabajo);
  if (!trabajo?.asesorId) throw new Error('El trabajo no tiene asesor.');

  const asesores = datos.asesores.map((a) =>
    a.id === trabajo.asesorId ? { ...a, cupoOcupado: a.cupoOcupado - 1, sinCupoDesde: null } : a
  );
  const trabajos = datos.trabajos.map((t) =>
    t.codigo === codigoTrabajo ? { ...t, asesorId: null, nota: null } : t
  );
  // Se registra el motivo para la coordinación.
  const registro = { codigoTrabajo, asesorId: trabajo.asesorId, motivo: motivo.trim(), fecha: HOY };

  return { ...datos, asesores, trabajos, historial: [...datos.historial, registro] };
}

export function guardarFicha(datos, asesorId, ficha) {
  const asesor = buscarAsesor(datos, asesorId);
  const cupoMaximo = Number(ficha.cupoMaximo);

  if (ficha.lineas.length === 0) throw new Error('Agrega al menos una línea de investigación.');
  if (ficha.lineas.length > 3) throw new Error('Puedes declarar hasta 3 líneas.');
  if (ficha.experiencia.length > 800) throw new Error('La experiencia no puede superar los 800 caracteres.');
  if (!Number.isInteger(cupoMaximo) || cupoMaximo < 1) throw new Error('El cupo máximo debe ser un número entero mayor a 0.');
  if (cupoMaximo < asesor.cupoOcupado) {
    throw new Error(`El cupo máximo no puede ser menor a los ${asesor.cupoOcupado} trabajos a cargo.`);
  }

  // Si cambió el grado, se actualiza también el título que se muestra (Dr., Mg., Ing.).
  const titulo =
    ficha.gradoAcademico === asesor.gradoAcademico
      ? asesor.titulo
      : GRADOS.find((g) => g.gradoAcademico === ficha.gradoAcademico).titulo;

  return {
    ...datos,
    asesores: datos.asesores.map((a) => (a.id === asesorId ? { ...a, ...ficha, titulo, cupoMaximo } : a)),
  };
}

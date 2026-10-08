import { CRITERIOS, DATOS_SEMILLA, HORAS, MODALIDADES, NOTA_APROBATORIA, SALAS, VENTANA } from '../data/datosSemilla.js';
import { HOY, diaSemana, formatearFecha, horaActual } from '../utils/fechas.js';

// Servicio de la HU-6: toda la lógica y las validaciones viven aquí, no en los componentes.
// Las funciones que modifican algo reciben los datos actuales y DEVUELVEN datos nuevos
// (sin modificar el original) o lanzan un Error con el mensaje para el usuario.
// En la entrega 2 estas funciones pasarán a llamar a la API con fetch.

const CLAVE = 'tfc.hu6';

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

export const nombreDocente = (d) => `${d.titulo} ${d.nombres} ${d.apellidos}`;

export const buscarTrabajo = (datos, codigo) => datos.trabajos.find((t) => t.codigo === codigo) ?? null;
export const buscarDocente = (datos, id) => datos.docentes.find((d) => d.id === id) ?? null;
export const buscarSustentacion = (datos, id) => datos.sustentaciones.find((s) => s.id === id) ?? null;
export const buscarSala = (salaId) => SALAS.find((s) => s.id === salaId) ?? null;

// Programada o reprogramada = todavía no se realiza.
export const estaPendiente = (s) => s.estado === 'programada' || s.estado === 'reprogramada';

// Texto de la sala: 'A-402 · pabellón A · 30 asientos'
export const textoSala = (sala) => `${sala.id} · ${sala.pabellon} · ${sala.asientos} asientos`;

// Última sustentación de un trabajo (o null si nunca se programó).
export function sustentacionDeTrabajo(datos, codigo) {
  return [...datos.sustentaciones].reverse().find((s) => s.trabajoCodigo === codigo) ?? null;
}

// Trabajo del estudiante que inició sesión.
export function trabajoDeEstudiante(datos, usuarioId) {
  return datos.trabajos.find((t) => t.equipo.some((i) => i.usuarioId === usuarioId)) ?? null;
}

// Trabajos concluidos que aún no tienen sustentación.
export function trabajosPorProgramar(datos) {
  return datos.trabajos.filter((t) => !sustentacionDeTrabajo(datos, t.codigo));
}

// Números de la tarjeta "Sustentaciones del periodo".
export function resumenPeriodo(datos) {
  return {
    programadas: datos.sustentaciones.filter(estaPendiente).length,
    realizadas: datos.sustentaciones.filter((s) => !estaPendiente(s)).length,
    porProgramar: trabajosPorProgramar(datos).length,
  };
}

// ¿Qué ocupa la sala en ese bloque? Devuelve un texto o null si está libre.
// idIgnorar: la sustentación que se está reprogramando (no choca consigo misma).
export function ocupanteDeSala(datos, { salaId, fecha, hora }, idIgnorar = null) {
  const sustentacion = datos.sustentaciones.find(
    (s) => s.id !== idIgnorar && estaPendiente(s) && s.salaId === salaId && s.fecha === fecha && s.hora === hora
  );
  if (sustentacion) return `«${buscarTrabajo(datos, sustentacion.trabajoCodigo).titulo}»`;
  const reserva = datos.reservas.find((r) => r.salaId === salaId && r.fecha === fecha && r.hora === hora);
  return reserva ? reserva.motivo : null;
}

// Estado de cada bloque de la sala ese día (tarjeta "Sala A-402 · 11/12/2026").
export function bloquesDeSala(datos, salaId, fecha, idIgnorar) {
  return HORAS.map((hora) => ({ hora, ocupante: ocupanteDeSala(datos, { salaId, fecha, hora }, idIgnorar) }));
}

// Hasta 2 alternativas libres: otra hora en la misma sala y la misma hora en otra sala.
export function alternativasLibres(datos, { salaId, fecha, hora }, idIgnorar) {
  const libre = (opcion) => !ocupanteDeSala(datos, opcion, idIgnorar);
  // Primero las horas siguientes; si no hay, las anteriores.
  const horas = [...HORAS.filter((h) => h > hora), ...HORAS.filter((h) => h < hora).reverse()];
  const mismaSala = horas.map((h) => ({ salaId, fecha, hora: h })).find(libre);
  const otraSala = SALAS.filter((s) => s.id !== salaId).map((s) => ({ salaId: s.id, fecha, hora })).find(libre);
  return [mismaSala, otraSala].filter(Boolean);
}

// Miembros del jurado que ya tienen otra sustentación en ese mismo bloque.
export function miembrosOcupados(datos, jurado, fecha, hora, idIgnorar) {
  return jurado
    .filter((m) =>
      datos.sustentaciones.some(
        (s) => s.id !== idIgnorar && estaPendiente(s) && s.fecha === fecha && s.hora === hora &&
          s.jurado.some((j) => j.docenteId === m.docenteId)
      )
    )
    .map((m) => nombreDocente(buscarDocente(datos, m.docenteId)));
}

// Cuántas veces es jurado en este ciclo.
export function cargaJurado(datos, docenteId) {
  const docente = buscarDocente(datos, docenteId);
  const enDatos = datos.sustentaciones.filter((s) => s.jurado.some((j) => j.docenteId === docenteId)).length;
  return docente.juradosPrevios + enDatos;
}

// Reglas del jurado. Devuelve los errores (vacío = válido) y el resumen de requisitos.
export function evaluarJurado(datos, trabajo, jurado) {
  const miembros = jurado.map((m) => buscarDocente(datos, m.docenteId));
  const doctores = miembros.filter((d) => d.grado === 'doctor').length;
  const delDepartamento = miembros.filter((d) => d.departamento === trabajo.departamento).length;
  const presidentes = jurado.filter((m) => m.presidente);

  const errores = [];
  if (jurado.length !== 3) errores.push(`El jurado debe tener 3 miembros (tiene ${jurado.length}).`);
  if (jurado.some((m) => m.docenteId === trabajo.asesorId)) errores.push('El asesor del trabajo no puede integrar el jurado.');
  if (doctores === 0) errores.push('Al menos un miembro debe tener grado de doctor.');
  if (delDepartamento === 0) errores.push(`Al menos un miembro debe ser del departamento de ${trabajo.departamento}.`);
  if (presidentes.length !== 1) errores.push('Designa a un presidente del jurado.');

  const cumplidos = `${jurado.length} miembros · ${doctores} doctor · ${delDepartamento} del departamento de ${trabajo.departamento}`;
  return { errores, cumplidos };
}

// Nota final ponderada (0–20, redondeada). null si falta alguna nota.
export function notaFinal(notas) {
  const valores = CRITERIOS.map((c) => notas[c.id]);
  if (valores.some((n) => n === '' || n === null || n === undefined)) return null;
  const suma = CRITERIOS.reduce((total, c) => total + Number(notas[c.id]) * c.peso, 0);
  return Math.round(suma / 100);
}

// ─────────── Validaciones internas ───────────

function validarProgramacion(datos, { fecha, hora, salaId, modalidad }, jurado, idIgnorar) {
  if (!fecha) throw new Error('Elige la fecha de la sustentación.');
  if (fecha < VENTANA.inicio || fecha > VENTANA.fin) {
    throw new Error(`La fecha debe estar dentro de la ventana ${formatearFecha(VENTANA.inicio)} – ${formatearFecha(VENTANA.fin)}.`);
  }
  if (diaSemana(fecha) === 'Domingo') throw new Error('No se programan sustentaciones los domingos.');
  if (!HORAS.includes(hora)) throw new Error('Elige un bloque de hora válido.');
  if (!MODALIDADES.includes(modalidad)) throw new Error('Elige la modalidad.');
  if (modalidad !== 'Virtual') {
    if (!buscarSala(salaId)) throw new Error('Elige una sala.');
    const ocupante = ocupanteDeSala(datos, { salaId, fecha, hora }, idIgnorar);
    if (ocupante) throw new Error(`La sala ${salaId} está ocupada en ese bloque por ${ocupante}.`);
  }
  const ocupados = miembrosOcupados(datos, jurado, fecha, hora, idIgnorar);
  if (ocupados.length > 0) throw new Error(`${ocupados.join(', ')} ya tiene otra sustentación en ese bloque.`);
}

function actualizarSustentacion(datos, id, cambios) {
  return {
    ...datos,
    sustentaciones: datos.sustentaciones.map((s) => (s.id === id ? { ...s, ...cambios } : s)),
  };
}

// ─────────── Acciones de la coordinación ───────────

export function programarSustentacion(datos, { id, trabajoCodigo, fecha, hora, salaId, modalidad }) {
  if (!buscarTrabajo(datos, trabajoCodigo)) throw new Error('Elige un trabajo concluido.');
  if (sustentacionDeTrabajo(datos, trabajoCodigo)) throw new Error('Ese trabajo ya tiene una sustentación.');
  validarProgramacion(datos, { fecha, hora, salaId, modalidad }, [], null);

  const nueva = {
    id, trabajoCodigo, estado: 'programada', programadaEl: HOY,
    fecha, hora, salaId: modalidad === 'Virtual' ? null : salaId, modalidad,
    jurado: [], acta: null, historial: [],
  };
  return { ...datos, sustentaciones: [...datos.sustentaciones, nueva] };
}

export function reprogramarSustentacion(datos, id, { fecha, hora, salaId, modalidad, motivo }) {
  const actual = buscarSustentacion(datos, id);
  if (!actual || !estaPendiente(actual)) throw new Error('Solo se reprograman sustentaciones pendientes.');
  if (motivo.trim().length < 10) throw new Error('Escribe el motivo de la reprogramación (al menos 10 caracteres).');
  validarProgramacion(datos, { fecha, hora, salaId, modalidad }, actual.jurado, id);

  const anterior = { fecha: actual.fecha, hora: actual.hora, salaId: actual.salaId, motivo: motivo.trim(), el: HOY };
  return actualizarSustentacion(datos, id, {
    estado: 'reprogramada', fecha, hora, salaId: modalidad === 'Virtual' ? null : salaId, modalidad,
    historial: [...actual.historial, anterior],
  });
}

export function guardarJurado(datos, id, jurado) {
  const sustentacion = buscarSustentacion(datos, id);
  if (!sustentacion || !estaPendiente(sustentacion)) throw new Error('La sustentación ya no admite cambios de jurado.');
  const trabajo = buscarTrabajo(datos, sustentacion.trabajoCodigo);

  const { errores } = evaluarJurado(datos, trabajo, jurado);
  if (errores.length > 0) throw new Error(errores[0]);
  const ocupados = miembrosOcupados(datos, jurado, sustentacion.fecha, sustentacion.hora, id);
  if (ocupados.length > 0) throw new Error(`${ocupados.join(', ')} ya tiene otra sustentación en ese bloque.`);

  return actualizarSustentacion(datos, id, { jurado });
}

// Valida notas (0–20) y resultado. `definitiva` = al registrar (no en el borrador).
function validarActa(acta, definitiva) {
  for (const c of CRITERIOS) {
    const nota = acta.notas[c.id];
    if (nota === '' || nota === null || nota === undefined) {
      if (definitiva) throw new Error(`Falta la nota de «${c.nombre}».`);
      continue;
    }
    const n = Number(nota);
    if (!Number.isInteger(n) || n < 0 || n > 20) throw new Error(`La nota de «${c.nombre}» debe ser un entero de 0 a 20.`);
  }
  if (!definitiva) return;

  const final = notaFinal(acta.notas);
  if (!acta.resultado) throw new Error('Elige el resultado.');
  if (final < NOTA_APROBATORIA && acta.resultado !== 'Desaprobado') {
    throw new Error(`Con nota final ${final} el resultado debe ser Desaprobado.`);
  }
  if (final >= NOTA_APROBATORIA && acta.resultado === 'Desaprobado') {
    throw new Error(`Con nota final ${final} el trabajo no puede quedar desaprobado.`);
  }
  if (acta.resultado !== 'Aprobado' && acta.observaciones.trim().length < 10) {
    throw new Error('Escribe las observaciones del jurado para este resultado.');
  }
}

// Para la página: revisa el acta antes de abrir el modal de confirmación.
export const revisarActa = (acta) => validarActa(acta, true);

export function guardarBorradorActa(datos, id, acta) {
  const sustentacion = buscarSustentacion(datos, id);
  if (sustentacion?.acta?.registrada) throw new Error('El acta ya es definitiva.');
  validarActa(acta, false);
  return actualizarSustentacion(datos, id, { acta: { ...acta, registrada: false } });
}

export function registrarActa(datos, id, acta) {
  const sustentacion = buscarSustentacion(datos, id);
  if (!sustentacion || !estaPendiente(sustentacion)) throw new Error('Esta sustentación no admite registrar acta.');
  if (sustentacion.jurado.length !== 3) throw new Error('Primero conforma el jurado.');
  validarActa(acta, true);

  return actualizarSustentacion(datos, id, {
    estado: acta.resultado === 'Desaprobado' ? 'desaprobada' : 'realizada',
    acta: { ...acta, registrada: true, registradaEl: sustentacion.fecha, registradaHora: horaActual() },
  });
}

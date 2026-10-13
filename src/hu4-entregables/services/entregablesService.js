import { DATOS_SEMILLA, PLANTILLA_CICLO } from '../data/datosSemilla.js';
import { HOY, SEMESTRE, diasEntre, dentroDelSemestre } from '../utils/fechas.js';

// Servicio de la HU-4: toda la lógica y las validaciones viven aquí, no en los componentes.
// Las funciones que modifican algo reciben los datos actuales y DEVUELVEN datos nuevos
// (no modifican el objeto original) y lanzan un Error con un mensaje si algo no es válido.
// En la entrega 2 estas funciones pasarán a llamar a la API con fetch.

const CLAVE = 'tfc.hu4';

export const PESO_MIN = 5;
export const PESO_MAX = 40;
export const DIAS_ALERTA = 14; // "Próximos a vencer · siguientes 14 días"

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

export function buscarTrabajo(datos, codigo) {
  return datos.trabajos.find((t) => t.codigo === codigo) ?? null;
}

// Trabajo del estudiante que inició sesión (se enlaza por el id de usuario de la HU-1).
export function trabajoDeEstudiante(datos, usuarioId) {
  return datos.trabajos.find((t) => t.integrantes.includes(usuarioId)) ?? null;
}

export function trabajosDeAsesor(datos, usuarioId) {
  return datos.trabajos.filter((t) => t.asesor?.usuarioId === usuarioId);
}

// Entregables de un plan, en su orden.
export function entregablesDe(datos, codigo) {
  return datos.entregables
    .filter((e) => e.trabajoCodigo === codigo)
    .sort((a, b) => a.orden - b.orden);
}

// Versiones de un entregable, de la más antigua a la más reciente.
export function avancesDe(datos, entregableId) {
  return datos.avances
    .filter((a) => a.entregableId === entregableId)
    .sort((a, b) => a.version - b.version);
}

export function ultimoAvance(datos, entregableId) {
  return avancesDe(datos, entregableId).at(-1) ?? null;
}

/**
 * Estado que se muestra del entregable, calculado desde su último avance:
 *  sin avances     -> 'vencido' si ya pasó la fecha límite, si no 'pendiente'
 *  en revisión     -> 'con_retraso' si se entregó tarde, si no 'entregado'
 *  observado / aprobado -> el mismo estado de la revisión
 */
export function estadoEntregable(datos, entregable, hoy = HOY) {
  const ultimo = ultimoAvance(datos, entregable.id);
  if (!ultimo) return entregable.fechaLimite < hoy ? 'vencido' : 'pendiente';
  if (ultimo.estado === 'en_revision') return ultimo.diasRetraso > 0 ? 'con_retraso' : 'entregado';
  return ultimo.estado; // 'observado' | 'aprobado'
}

// Un entregable se habilita cuando el anterior del plan está aprobado.
export function estaBloqueado(datos, entregable) {
  const anterior = entregablesDe(datos, entregable.trabajoCodigo).find((e) => e.orden === entregable.orden - 1);
  return Boolean(anterior) && estadoEntregable(datos, anterior) !== 'aprobado';
}

// Solo los entregables obligatorios cuentan para la suma de pesos y para el avance.
export function sumaPesos(entregables, excluirId = null) {
  return entregables
    .filter((e) => e.obligatorio && e.id !== excluirId)
    .reduce((suma, e) => suma + e.peso, 0);
}

// Avance acumulado = suma de los pesos de los entregables obligatorios aprobados.
export function calcularAvance(datos, codigo) {
  const aprobados = entregablesDe(datos, codigo).filter(
    (e) => e.obligatorio && estadoEntregable(datos, e) === 'aprobado'
  );
  return { porcentaje: sumaPesos(aprobados), aprobados };
}

/**
 * Todo lo que necesita la pantalla 4.1 en una sola llamada:
 * cada entregable con su estado, si está bloqueado, sus versiones y si se puede registrar avance.
 */
export function detallePlan(datos, codigo, hoy = HOY) {
  const trabajo = buscarTrabajo(datos, codigo);
  const items = entregablesDe(datos, codigo).map((e) => {
    const estado = estadoEntregable(datos, e, hoy);
    const avances = avancesDe(datos, e.id);
    const bloqueado = estaBloqueado(datos, e);
    const ultimo = avances.at(-1) ?? null;
    return {
      ...e,
      estado,
      avances,
      bloqueado,
      diasParaVencer: diasEntre(hoy, e.fechaLimite),
      ampliacionPendiente: datos.ampliaciones.find((a) => a.entregableId === e.id && a.estado === 'pendiente') ?? null,
      // Se puede subir una versión si el trabajo sigue en desarrollo, el entregable no está
      // bloqueado ni aprobado y no hay otra versión esperando revisión.
      puedeRegistrar:
        trabajo?.estado === 'en_desarrollo' && !bloqueado && estado !== 'aprobado' && ultimo?.estado !== 'en_revision',
    };
  });
  return { trabajo, items, suma: sumaPesos(items), avance: calcularAvance(datos, codigo) };
}

/**
 * Alertas de la pantalla 4.4:
 *  vencidos  -> entregables vencidos sin presentar
 *  proximos  -> entregables y requisitos que vencen en los siguientes 14 días
 */
export function alertasDe(datos, codigo, hoy = HOY) {
  const { trabajo, items } = detallePlan(datos, codigo, hoy);
  const aprobados = items.filter((e) => e.estado === 'aprobado');
  // Un trabajo concluido ya no genera alertas.
  if (trabajo?.estado === 'concluido') return { vencidos: [], proximos: [], aprobados, pendientes: [] };
  const enRango = (dias) => dias >= 0 && dias <= DIAS_ALERTA;

  const vencidos = items.filter((e) => e.estado === 'vencido');
  const proximos = [
    ...items
      .filter((e) => ['pendiente', 'observado'].includes(e.estado) && enRango(e.diasParaVencer))
      .map((e) => ({ ...e, tipo: 'entregable' })),
    ...datos.requisitos
      .map((r) => ({ ...r, tipo: 'requisito', diasParaVencer: diasEntre(hoy, r.fechaLimite) }))
      .filter((r) => enRango(r.diasParaVencer)),
  ].sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  return {
    vencidos,
    proximos,
    aprobados,
    pendientes: items.filter((e) => !['aprobado', 'vencido'].includes(e.estado)),
  };
}

// Comentario más reciente del asesor sobre cualquier entregable del trabajo.
export function ultimaRetroalimentacion(datos, codigo) {
  const ids = entregablesDe(datos, codigo).map((e) => e.id);
  const revisados = datos.avances
    .filter((a) => ids.includes(a.entregableId) && a.revision?.comentario)
    .sort((a, b) => b.revision.fecha.localeCompare(a.revision.fecha));
  if (revisados.length === 0) return null;
  const avance = revisados[0];
  return { ...avance, entregable: datos.entregables.find((e) => e.id === avance.entregableId) };
}

// ─────────── Acciones del estudiante ───────────

const esEnlaceValido = (texto) => {
  try {
    return ['http:', 'https:'].includes(new URL(texto).protocol);
  } catch {
    return false;
  }
};

export function registrarAvance(datos, entregableId, { enlace, descripcion }, hoy = HOY) {
  const entregable = datos.entregables.find((e) => e.id === entregableId);
  if (!entregable) throw new Error('El entregable no existe.');
  const item = detallePlan(datos, entregable.trabajoCodigo, hoy).items.find((e) => e.id === entregableId);

  if (item.bloqueado) throw new Error('Este entregable se habilita cuando se apruebe el anterior.');
  if (item.estado === 'aprobado') throw new Error('Este entregable ya está aprobado.');
  if (!item.puedeRegistrar) throw new Error('Ya tienes una versión esperando revisión de tu asesor.');
  if (!esEnlaceValido(enlace.trim())) throw new Error('Ingresa un enlace válido que empiece con http:// o https://');
  const texto = descripcion.trim();
  if (texto.length < 10) throw new Error('Describe lo entregado en al menos 10 caracteres.');
  if (texto.length > 600) throw new Error('La descripción no puede superar los 600 caracteres.');

  const nuevo = {
    id: `av-${Date.now()}`,
    entregableId,
    version: item.avances.length + 1, // la versión se calcula sola
    fecha: hoy,
    diasRetraso: Math.max(0, diasEntre(entregable.fechaLimite, hoy)),
    estado: 'en_revision',
    enlace: enlace.trim(),
    descripcion: texto,
    revision: null,
  };
  return { ...datos, avances: [...datos.avances, nuevo] };
}

export function solicitarAmpliacion(datos, entregableId, { nuevaFecha, motivo }, hoy = HOY) {
  const entregable = datos.entregables.find((e) => e.id === entregableId);
  if (!entregable) throw new Error('El entregable no existe.');
  if (datos.ampliaciones.some((a) => a.entregableId === entregableId && a.estado === 'pendiente')) {
    throw new Error('Ya enviaste una solicitud de ampliación para este entregable.');
  }
  if (!nuevaFecha) throw new Error('Elige la nueva fecha que propones.');
  if (nuevaFecha <= hoy || nuevaFecha <= entregable.fechaLimite) {
    throw new Error('La nueva fecha debe ser posterior a hoy y a la fecha límite actual.');
  }
  if (!dentroDelSemestre(nuevaFecha)) throw new Error(`La fecha debe caer dentro del semestre ${SEMESTRE.nombre}.`);
  if (motivo.trim().length < 20) throw new Error('Explica el motivo en al menos 20 caracteres.');

  const nueva = { id: `am-${Date.now()}`, entregableId, nuevaFecha, motivo: motivo.trim(), fecha: hoy, estado: 'pendiente' };
  return { ...datos, ampliaciones: [...datos.ampliaciones, nueva] };
}

// ─────────── Acciones del asesor ───────────

/**
 * Revisa la suma de pesos si se guarda `peso` en el plan (sin contar el entregable que se edita).
 * La pantalla la usa para mostrar el modal "No se puede guardar el entregable".
 */
export function simularSuma(datos, codigo, { peso, obligatorio }, excluirId = null) {
  const resto = sumaPesos(entregablesDe(datos, codigo), excluirId);
  const suma = resto + (obligatorio ? Number(peso) || 0 : 0);
  return { suma, exceso: Math.max(0, suma - 100) };
}

export function guardarEntregable(datos, codigo, formulario, entregableId = null) {
  const trabajo = buscarTrabajo(datos, codigo);
  if (!trabajo) throw new Error('El trabajo no existe.');
  if (trabajo.estado === 'concluido') throw new Error('El trabajo está concluido: el plan queda en modo lectura.');

  const plan = entregablesDe(datos, codigo);
  const anterior = entregableId ? plan.find((e) => e.id === entregableId) : null;
  if (entregableId && !anterior) throw new Error('El entregable no existe.');
  if (anterior && estadoEntregable(datos, anterior) === 'aprobado') {
    throw new Error('Los entregables aprobados no pueden editarse.');
  }

  const nombre = formulario.nombre.trim();
  const peso = Number(formulario.peso);
  if (nombre.length < 3) throw new Error('El nombre debe tener al menos 3 caracteres.');
  if (plan.some((e) => e.id !== entregableId && e.nombre.toLowerCase() === nombre.toLowerCase())) {
    throw new Error('Ya existe un entregable con ese nombre en el plan.');
  }
  if (formulario.descripcion.length > 400) throw new Error('La descripción no puede superar los 400 caracteres.');
  if (!formulario.fechaLimite) throw new Error('Elige la fecha límite.');
  if (!dentroDelSemestre(formulario.fechaLimite)) {
    throw new Error(`La fecha límite debe caer dentro del semestre ${SEMESTRE.nombre}.`);
  }
  if (!Number.isInteger(peso) || peso < PESO_MIN || peso > PESO_MAX) {
    throw new Error(`El peso debe ser un número entero entre ${PESO_MIN} y ${PESO_MAX}.`);
  }
  const { suma, exceso } = simularSuma(datos, codigo, { peso, obligatorio: formulario.obligatorio }, entregableId);
  if (exceso > 0) throw new Error(`Con este peso el plan suma ${suma}. Excede en ${exceso} puntos.`);

  const campos = {
    nombre,
    descripcion: formulario.descripcion.trim(),
    fechaLimite: formulario.fechaLimite,
    peso,
    obligatorio: formulario.obligatorio,
  };

  if (anterior) {
    return {
      ...datos,
      entregables: datos.entregables.map((e) => (e.id === entregableId ? { ...e, ...campos } : e)),
    };
  }
  const nuevo = { id: `e-${Date.now()}`, trabajoCodigo: codigo, orden: plan.length + 1, ...campos };
  return { ...datos, entregables: [...datos.entregables, nuevo] };
}

export function eliminarEntregable(datos, entregableId) {
  const entregable = datos.entregables.find((e) => e.id === entregableId);
  if (!entregable) throw new Error('El entregable no existe.');
  if (avancesDe(datos, entregableId).length > 0) {
    throw new Error('No se puede eliminar: el equipo ya registró avances en este entregable.');
  }
  // Se quita y se vuelve a numerar el resto del plan (1, 2, 3…).
  const restantes = datos.entregables.filter((e) => e.id !== entregableId);
  const renumerados = restantes.map((e) =>
    e.trabajoCodigo === entregable.trabajoCodigo && e.orden > entregable.orden ? { ...e, orden: e.orden - 1 } : e
  );
  return { ...datos, entregables: renumerados };
}

// Crea los 5 entregables de la plantilla del ciclo. Solo si el plan está vacío.
export function aplicarPlantilla(datos, codigo) {
  if (entregablesDe(datos, codigo).length > 0) {
    throw new Error('La plantilla solo puede usarse cuando el plan está vacío.');
  }
  const nuevos = PLANTILLA_CICLO.map((p, indice) => ({
    id: `e-${codigo}-${indice + 1}`,
    trabajoCodigo: codigo,
    orden: indice + 1,
    obligatorio: true,
    ...p,
  }));
  return { ...datos, entregables: [...datos.entregables, ...nuevos] };
}

export function responderAmpliacion(datos, ampliacionId, aceptar) {
  const solicitud = datos.ampliaciones.find((a) => a.id === ampliacionId);
  if (!solicitud || solicitud.estado !== 'pendiente') throw new Error('La solicitud ya fue respondida.');
  return {
    ...datos,
    ampliaciones: datos.ampliaciones.map((a) =>
      a.id === ampliacionId ? { ...a, estado: aceptar ? 'aceptada' : 'rechazada' } : a
    ),
    // Si se acepta, la fecha límite del entregable pasa a ser la nueva.
    entregables: aceptar
      ? datos.entregables.map((e) => (e.id === solicitud.entregableId ? { ...e, fechaLimite: solicitud.nuevaFecha } : e))
      : datos.entregables,
  };
}

// ─────────── Punto de integración con la HU-5 ───────────

/** La bandeja de revisión (HU-5) llama a esta función al aprobar u observar una versión. */
export function revisarAvance(datos, avanceId, { aprobado, comentario = '', revisor }, hoy = HOY) {
  const avance = datos.avances.find((a) => a.id === avanceId);
  if (!avance || avance.estado !== 'en_revision') throw new Error('Esta versión ya fue revisada.');
  if (!aprobado && comentario.trim().length === 0) throw new Error('Escribe un comentario para observar el avance.');
  return {
    ...datos,
    avances: datos.avances.map((a) =>
      a.id === avanceId
        ? { ...a, estado: aprobado ? 'aprobado' : 'observado', revision: { fecha: hoy, comentario: comentario.trim(), revisor } }
        : a
    ),
  };
}

// HU-7 · Formatos y etiquetas para mostrar lo que devuelve el API.

const RE_FECHA = /^(\d{4})-(\d{2})-(\d{2})/;
const dosDigitos = (n) => String(n).padStart(2, '0');

/** "AAAA-MM-DD" o fecha ISO → "DD/MM/AAAA". Las fechas solo-día no se corren por zona horaria. */
export function formatearFecha(valor) {
  if (!valor) return '—';
  if (typeof valor === 'string' && valor.length === 10) {
    const m = RE_FECHA.exec(valor);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return '—';
  return `${dosDigitos(d.getDate())}/${dosDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** "AAAA-MM-DD" → Date a medianoche local (sin corrimiento por zona horaria). */
export function fechaLocal(valor) {
  const m = typeof valor === 'string' ? RE_FECHA.exec(valor) : null;
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(valor);
}

/** "HH:MM:SS" → "HH:MM". */
export function formatearHora(valor) {
  return typeof valor === 'string' ? valor.slice(0, 5) : '—';
}

/** null o undefined → «—»; cualquier otro valor se muestra tal cual. */
export function textoONulo(valor, sufijo = '') {
  return valor === null || valor === undefined ? '—' : `${valor}${sufijo}`;
}

/** Porcentaje entero 0–100 de parte/total (0 si el total es 0). */
export function proporcion(parte, total) {
  return total > 0 ? Math.round((100 * parte) / total) : 0;
}

export const ETIQUETA_ROL = {
  estudiante: 'Estudiante',
  asesor: 'Asesor',
  coordinador: 'Administrador',
};

export const ETIQUETA_ESTADO_USUARIO = {
  activo: 'Activo',
  bloqueado: 'Bloqueado',
  pendiente_validacion: 'Por validar',
  sin_verificar: 'Sin verificar',
};

export const ETIQUETA_ESTADO_SUSTENTACION = {
  programada: 'Programada',
  realizada: 'Realizada',
  reprogramada: 'Reprogramada',
  desaprobada: 'Desaprobada',
};

export const CLASE_ESTADO_TRABAJO = {
  propuesta: 'estado-propuesta',
  en_desarrollo: 'estado-desarrollo',
  concluido: 'estado-concluido',
  desistido: 'estado-desistido',
};

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

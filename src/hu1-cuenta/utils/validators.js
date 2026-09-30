// Validaciones de la HU-1. Son funciones puras: en la entrega 2 se reutilizan en el servidor.

export const DOMINIO_ESTUDIANTE = '@aloe.ulima.edu.pe';
export const DOMINIO_DOCENTE = '@ulima.edu.pe';

const RE_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const RE_CORREO = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function limpiar(texto) {
  return String(texto ?? '').trim().replace(/\s+/g, ' ');
}

export function validarNombre(valor, campo = 'Este campo') {
  const v = limpiar(valor);
  if (!v) return `${campo} es obligatorio`;
  if (v.length < 2) return `${campo} debe tener al menos 2 caracteres`;
  if (v.length > 60) return `${campo} admite hasta 60 caracteres`;
  if (!RE_NOMBRE.test(v)) return `${campo} solo admite letras y espacios`;
  return null;
}

export function validarCorreo(valor, dominio) {
  const v = String(valor ?? '').trim().toLowerCase();
  if (!v) return 'Ingresa tu correo institucional';
  if (!RE_CORREO.test(v)) return 'El correo no tiene un formato válido';
  if (dominio && !v.endsWith(dominio)) return `Debe terminar en ${dominio}`;
  return null;
}

/** Correo institucional de cualquier rol (para login y recuperación). */
export function validarCorreoInstitucional(valor) {
  const v = String(valor ?? '').trim().toLowerCase();
  if (!v) return 'Ingresa tu correo institucional';
  if (!RE_CORREO.test(v)) return 'El correo no tiene un formato válido';
  if (!v.endsWith(DOMINIO_ESTUDIANTE) && !v.endsWith(DOMINIO_DOCENTE)) {
    return `Usa tu correo ${DOMINIO_ESTUDIANTE} o ${DOMINIO_DOCENTE}`;
  }
  return null;
}

export function reglasPassword(valor = '') {
  return {
    largo: valor.length >= 8,
    mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(valor),
    numero: /\d/.test(valor),
  };
}

export function validarPassword(valor) {
  if (!valor) return 'Ingresa una contraseña';
  const r = reglasPassword(valor);
  const faltas = [];
  if (!r.largo) {
    const n = 8 - valor.length;
    faltas.push(`${n} ${n === 1 ? 'carácter' : 'caracteres'}`);
  }
  if (!r.mayuscula) faltas.push('una mayúscula');
  if (!r.numero) faltas.push('un número');
  if (faltas.length === 0) return null;
  const lista = faltas.length > 1 ? `${faltas.slice(0, -1).join(', ')} y ${faltas.at(-1)}` : faltas[0];
  return `${r.largo ? 'Falta' : 'Muy corta: faltan'} ${lista}`;
}

export function validarConfirmacion(password, confirmacion) {
  if (!confirmacion) return 'Confirma la contraseña';
  if (password !== confirmacion) return 'Las contraseñas no coinciden';
  return null;
}

export function validarCodigoAlumno(valor) {
  const v = String(valor ?? '').trim();
  if (!v) return 'Ingresa tu código de alumno';
  if (!/^\d{8}$/.test(v)) return 'El código tiene 8 dígitos';
  return null;
}

export function validarTelefono(valor) {
  const v = String(valor ?? '').replace(/\s/g, '');
  if (!v) return null; // opcional
  if (!/^9\d{8}$/.test(v)) return 'Ingresa un celular de 9 dígitos que empiece con 9';
  return null;
}

export function requerido(valor, mensaje) {
  return limpiar(valor) ? null : mensaje;
}

function sinNulos(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, v]) => v));
}

export function validarRegistroEstudiante(d) {
  return sinNulos({
    nombres: validarNombre(d.nombres, 'Nombres'),
    apellidos: validarNombre(d.apellidos, 'Apellidos'),
    correo: validarCorreo(d.correo, DOMINIO_ESTUDIANTE),
    password: validarPassword(d.password),
    confirmacion: validarConfirmacion(d.password, d.confirmacion),
    carrera: requerido(d.carrera, 'Elige tu carrera'),
    ciclo: requerido(d.ciclo, 'Elige tu ciclo'),
    codigoAlumno: validarCodigoAlumno(d.codigoAlumno),
    aceptaReglamento: d.aceptaReglamento ? null : 'Debes aceptar el reglamento para continuar',
  });
}

export function validarRegistroAsesor(d) {
  return sinNulos({
    nombres: validarNombre(d.nombres, 'Nombres'),
    apellidos: validarNombre(d.apellidos, 'Apellidos'),
    correo: validarCorreo(d.correo, DOMINIO_DOCENTE),
    password: validarPassword(d.password),
    confirmacion: validarConfirmacion(d.password, d.confirmacion),
    gradoAcademico: requerido(d.gradoAcademico, 'Elige tu grado académico'),
    departamento: requerido(d.departamento, 'Elige tu departamento'),
  });
}

export function validarRegistroCoordinador(d) {
  return sinNulos({
    nombres: validarNombre(d.nombres, 'Nombres'),
    apellidos: validarNombre(d.apellidos, 'Apellidos'),
    password: validarPassword(d.password),
    confirmacion: validarConfirmacion(d.password, d.confirmacion),
  });
}

export function validarPerfil(d, rol) {
  const errores = {
    nombres: validarNombre(d.nombres, 'Nombres'),
    apellidos: validarNombre(d.apellidos, 'Apellidos'),
    telefono: validarTelefono(d.telefono),
  };
  if (rol === 'estudiante') {
    errores.carrera = requerido(d.carrera, 'Elige tu carrera');
    errores.ciclo = requerido(d.ciclo, 'Elige tu ciclo');
  }
  if (rol === 'asesor') {
    errores.gradoAcademico = requerido(d.gradoAcademico, 'Elige tu grado académico');
    errores.departamento = requerido(d.departamento, 'Elige tu departamento');
  }
  return sinNulos(errores);
}

/** Solo valida si el usuario empezó a llenar algún campo de contraseña. */
export function validarCambioPassword({ actual, nueva, confirmacion }) {
  if (!actual && !nueva && !confirmacion) return {};
  const errores = {
    actual: actual ? null : 'Ingresa tu contraseña actual',
    nueva: validarPassword(nueva),
    confirmacion: validarConfirmacion(nueva, confirmacion),
  };
  if (!errores.nueva && actual && nueva === actual) errores.nueva = 'Debe ser distinta a la actual';
  return sinNulos(errores);
}

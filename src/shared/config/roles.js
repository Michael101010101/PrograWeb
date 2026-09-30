// Roles del sistema. El id se usa en datos y rutas; label es lo que ve el usuario.
export const ROLES = {
  ESTUDIANTE: 'estudiante',
  ASESOR: 'asesor',
  COORDINADOR: 'coordinador',
};

export const ROL_INFO = {
  publico: { label: 'Público', detalle: 'sin sesión', chip: 'Visitante · sin sesión' },
  estudiante: { label: 'Estudiante', detalle: 'usuario normal', chip: 'Estudiante' },
  asesor: { label: 'Asesor', detalle: 'docente', chip: 'Asesor' },
  coordinador: { label: 'Administrador', detalle: 'coordinación TFC', chip: 'Administrador' },
};

// Vista principal a la que se redirige tras iniciar sesión.
export const INICIO_POR_ROL = {
  estudiante: '/estudiante/mi-trabajo',
  asesor: '/asesor/asesorados',
  coordinador: '/admin/tablero',
};

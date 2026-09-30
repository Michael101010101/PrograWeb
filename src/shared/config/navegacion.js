// Menú de la barra de navegación, propio de cada rol.
// Cada historia agrega aquí su entrada cuando tenga su vista lista.
export const NAV_POR_ROL = {
  publico: [
    { to: '/', label: 'Inicio', end: true },
    { to: '/proceso', label: 'El proceso' },
    { to: '/asesores', label: 'Directorio de asesores' },
    { to: '/cronograma', label: 'Cronograma' },
  ],
  estudiante: [
    { to: '/estudiante/mi-trabajo', label: 'Mi trabajo' },
    { to: '/estudiante/entregables', label: 'Entregables' },
    { to: '/estudiante/retroalimentacion', label: 'Retroalimentación' },
    { to: '/estudiante/asesores', label: 'Directorio de asesores' },
    { to: '/estudiante/sustentacion', label: 'Mi sustentación' },
    { to: '/cuenta', label: 'Mi cuenta' },
  ],
  asesor: [
    { to: '/asesor/asesorados', label: 'Mis asesorados' },
    { to: '/asesor/solicitudes', label: 'Solicitudes' },
    { to: '/asesor/revision', label: 'Bandeja de revisión' },
    { to: '/asesor/ficha', label: 'Mi ficha' },
    { to: '/cuenta', label: 'Mi cuenta' },
  ],
  coordinador: [
    { to: '/admin/tablero', label: 'Tablero' },
    { to: '/admin/trabajos', label: 'Trabajos' },
    { to: '/admin/carga', label: 'Carga por asesor' },
    { to: '/admin/sustentaciones', label: 'Sustentaciones' },
    { to: '/admin/usuarios', label: 'Usuarios' },
    { to: '/cuenta', label: 'Mi cuenta' },
  ],
};

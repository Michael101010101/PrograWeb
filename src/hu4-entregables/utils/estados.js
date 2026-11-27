// Estados del entregable que llegan de la API: etiqueta y tono de color de cada estado del entregable (lámina "Estados del entregable").
// Va en su propio archivo para que los componentes .jsx solo exporten componentes (regla de Vite/ESLint).
export const ESTADOS = {
  pendiente: { texto: 'Pendiente', tono: 'neutral' },
  entregado: { texto: 'Entregado', tono: 'info' },
  entregado_con_retraso: { texto: 'Con retraso', tono: 'warning' },
  observado: { texto: 'Observado', tono: 'accent' },
  aprobado: { texto: 'Aprobado', tono: 'success' },
  vencido: { texto: 'Vencido sin presentar', tono: 'danger' },
};

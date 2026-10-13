// Datos semilla de la HU-4 · Plan de entregables.
// Se copian a localStorage la primera vez (ver services/entregablesService.js).
// Los id de usuario ('u-001', 'u-101', …) son los del seed.json de la HU-1.

// Plantilla que la coordinación propone para el ciclo ("Usar plantilla del ciclo" en la 4.2).
export const PLANTILLA_CICLO = [
  { nombre: 'Plan de investigación', peso: 15, fechaLimite: '2026-09-25', descripcion: 'Problema, objetivos, justificación y cronograma del trabajo.' },
  { nombre: 'Marco teórico', peso: 20, fechaLimite: '2026-10-09', descripcion: 'Antecedentes y bases teóricas con al menos 15 fuentes revisadas.' },
  { nombre: 'Diseño metodológico', peso: 20, fechaLimite: '2026-10-23', descripcion: 'Tipo de investigación, población, muestra, instrumentos y plan de análisis.' },
  { nombre: 'Resultados preliminares', peso: 20, fechaLimite: '2026-11-06', descripcion: 'Primeros resultados con su análisis e interpretación.' },
  { nombre: 'Informe final', peso: 25, fechaLimite: '2026-11-27', descripcion: 'Documento completo listo para la revisión del jurado.' },
];

// Vista de los trabajos que usa la HU-4 (la entidad Trabajo es de la HU-2).
// estado: 'en_desarrollo' | 'concluido'. Solo los trabajos con asesor tienen plan.
const trabajos = [
  {
    codigo: 'TFC-2026-2-047',
    titulo: 'Modelo predictivo de deserción en estudiantes de primer ciclo',
    linea: 'Ciencia de datos aplicada',
    estado: 'en_desarrollo',
    integrantes: ['u-001', 'u-002'],
    asesor: { usuarioId: 'u-101', nombre: 'Dra. Mariela Quispe Ramos', trato: 'tu asesora' },
  },
  {
    codigo: 'TFC-2026-2-015',
    titulo: 'Plataforma de tutoría entre pares para cursos de matemática básica',
    linea: 'Innovación educativa',
    estado: 'en_desarrollo',
    integrantes: [],
    asesor: { usuarioId: 'u-101', nombre: 'Dra. Mariela Quispe Ramos', trato: 'tu asesora' },
  },
  {
    codigo: 'TFC-2026-2-012',
    titulo: 'Optimización de rutas de reparto para comercios de Lima Metropolitana',
    linea: 'Gestión de operaciones',
    estado: 'concluido',
    integrantes: ['u-004'],
    asesor: { usuarioId: 'u-102', nombre: 'Mg. Julio Vargas Aliaga', trato: 'tu asesor' },
  },
];

// Entregables de cada plan. `orden` es el número que se muestra ("4. Resultados preliminares").
// El ESTADO no se guarda: se calcula a partir de los avances (ver estadoEntregable en el servicio).
const entregables = [
  // TFC-2026-2-047 · plan del mockup 4.1 / 4.2
  { id: 'e-047-1', trabajoCodigo: 'TFC-2026-2-047', orden: 1, nombre: 'Plan de investigación', peso: 15, obligatorio: true, fechaLimite: '2026-08-28', descripcion: 'Problema, objetivos, justificación y cronograma.' },
  { id: 'e-047-2', trabajoCodigo: 'TFC-2026-2-047', orden: 2, nombre: 'Marco teórico', peso: 20, obligatorio: true, fechaLimite: '2026-09-18', descripcion: 'Antecedentes sobre deserción universitaria y modelos predictivos.' },
  { id: 'e-047-3', trabajoCodigo: 'TFC-2026-2-047', orden: 3, nombre: 'Diseño metodológico', peso: 20, obligatorio: true, fechaLimite: '2026-10-09', descripcion: 'Variables, muestra estratificada y técnica de validación.' },
  { id: 'e-047-4', trabajoCodigo: 'TFC-2026-2-047', orden: 4, nombre: 'Resultados preliminares', peso: 20, obligatorio: true, fechaLimite: '2026-08-30', descripcion: 'Primeros resultados del modelo entrenado con la base 2022-2025, con matriz de confusión y métricas de precisión y recall.' },
  { id: 'e-047-5', trabajoCodigo: 'TFC-2026-2-047', orden: 5, nombre: 'Informe final', peso: 25, obligatorio: true, fechaLimite: '2026-11-27', descripcion: 'Documento completo con anexos de código.' },

  // TFC-2026-2-012 · trabajo concluido, plan en modo lectura
  { id: 'e-012-1', trabajoCodigo: 'TFC-2026-2-012', orden: 1, nombre: 'Plan de investigación', peso: 15, obligatorio: true, fechaLimite: '2026-08-29', descripcion: '' },
  { id: 'e-012-2', trabajoCodigo: 'TFC-2026-2-012', orden: 2, nombre: 'Marco teórico', peso: 20, obligatorio: true, fechaLimite: '2026-09-20', descripcion: '' },
  { id: 'e-012-3', trabajoCodigo: 'TFC-2026-2-012', orden: 3, nombre: 'Diseño metodológico', peso: 20, obligatorio: true, fechaLimite: '2026-10-09', descripcion: '' },
  { id: 'e-012-4', trabajoCodigo: 'TFC-2026-2-012', orden: 4, nombre: 'Resultados preliminares', peso: 20, obligatorio: true, fechaLimite: '2026-10-30', descripcion: '' },
  { id: 'e-012-5', trabajoCodigo: 'TFC-2026-2-012', orden: 5, nombre: 'Informe final', peso: 25, obligatorio: true, fechaLimite: '2026-11-24', descripcion: '' },
  // TFC-2026-2-015 no tiene entregables: la asesora todavía debe definir su plan.
];

// Cada versión que sube el estudiante. La revisión (aprobar/observar) la hace el asesor en la HU-5.
// estado: 'en_revision' | 'observado' | 'aprobado'
const revision = (fecha, comentario = '') => ({ fecha, comentario, revisor: 'Dra. Mariela Quispe Ramos' });
const avances = [
  { id: 'av-01', entregableId: 'e-047-1', version: 1, fecha: '2026-08-20', diasRetraso: 0, estado: 'observado', enlace: 'https://drive.google.com/file/d/1aQ-plan-v1', descripcion: 'Primera versión del plan.', revision: revision('2026-08-22', 'Delimita mejor la población: solo primer ciclo.') },
  { id: 'av-02', entregableId: 'e-047-1', version: 2, fecha: '2026-08-24', diasRetraso: 0, estado: 'observado', enlace: 'https://drive.google.com/file/d/1aQ-plan-v2', descripcion: 'Población delimitada a primer ciclo.', revision: revision('2026-08-25', 'Falta el cronograma por etapas.') },
  { id: 'av-03', entregableId: 'e-047-1', version: 3, fecha: '2026-08-26', diasRetraso: 0, estado: 'aprobado', enlace: 'https://drive.google.com/file/d/1aQ-plan-v3', descripcion: 'Se agregó el cronograma por etapas.', revision: revision('2026-08-29', 'Plan aprobado.') },
  { id: 'av-04', entregableId: 'e-047-2', version: 1, fecha: '2026-09-01', diasRetraso: 0, estado: 'aprobado', enlace: 'https://drive.google.com/file/d/2bM-marco-v1', descripcion: 'Marco teórico con 18 fuentes.', revision: revision('2026-09-03', 'Buen marco teórico.') },
  { id: 'av-05', entregableId: 'e-047-3', version: 1, fecha: '2026-08-28', diasRetraso: 0, estado: 'observado', enlace: 'https://drive.google.com/file/d/3cK-diseno-v1', descripcion: 'Diseño metodológico inicial.', revision: revision('2026-08-30', 'La muestra no es representativa por carrera.') },
  { id: 'av-06', entregableId: 'e-047-3', version: 2, fecha: '2026-09-02', diasRetraso: 0, estado: 'aprobado', enlace: 'https://drive.google.com/file/d/3cK-diseno-v2', descripcion: 'Muestra estratificada por carrera.', revision: revision('2026-09-04', 'Metodología correcta. Pasa a resultados preliminares con la muestra estratificada por carrera.') },

  // TFC-2026-2-012: todo aprobado
  ...['1', '2', '3', '4', '5'].map((n) => ({
    id: `av-012-${n}`, entregableId: `e-012-${n}`, version: 1, fecha: '2026-08-27', diasRetraso: 0, estado: 'aprobado',
    enlace: `https://drive.google.com/file/d/012-entregable-${n}`, descripcion: 'Versión final.',
    revision: { fecha: '2026-08-29', comentario: 'Aprobado.', revisor: 'Mg. Julio Vargas Aliaga' },
  })),
];

// Requisitos administrativos de la oficina TFC: generan alertas pero no tienen peso.
const requisitos = [
  {
    id: 'r-01',
    nombre: 'Entrega de informe impreso',
    detalle: 'Requisito administrativo de la oficina TFC · no tiene peso',
    fechaLimite: '2026-09-18',
    pasos: [
      'Imprimir el informe del avance en A4, anillado.',
      'Incluir la carátula oficial con el código del trabajo.',
      'Entregarlo en la oficina TFC (pabellón A, 2.º piso), de 9:00 a 17:00.',
    ],
  },
];

export const DATOS_SEMILLA = { trabajos, entregables, avances, requisitos, ampliaciones: [] };

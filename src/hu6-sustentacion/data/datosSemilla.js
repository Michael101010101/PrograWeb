// Datos semilla de la HU-6 · Sustentación.
// Se copian a localStorage la primera vez (ver services/sustentacionesService.js).
// Los usuarioId ('u-004', 'u-101', …) son los del seed.json de la HU-1.

// Ventana de sustentaciones del periodo 2026-2
export const VENTANA = { inicio: '2026-12-07', fin: '2026-12-19' };

// Bloques de 60 minutos en los que se puede programar
export const HORAS = ['08:00', '09:00', '10:00', '11:00', '15:00'];

export const MODALIDADES = ['Presencial', 'Virtual', 'Híbrida'];

export const SALAS = [
  { id: 'A-402', pabellon: 'pabellón A', ubicacion: 'Pabellón A, cuarto piso', asientos: 30 },
  { id: 'B-201', pabellon: 'pabellón B', ubicacion: 'Pabellón B, segundo piso', asientos: 24 },
  { id: 'C-105', pabellon: 'pabellón C', ubicacion: 'Pabellón C, primer piso', asientos: 40 },
];

// Criterios del acta: el peso es el porcentaje dentro de la nota final
export const CRITERIOS = [
  { id: 'rigor', nombre: 'Rigor metodológico', peso: 30 },
  { id: 'resultados', nombre: 'Resultados y análisis', peso: 30 },
  { id: 'informe', nombre: 'Calidad del informe', peso: 20 },
  { id: 'exposicion', nombre: 'Exposición y defensa', peso: 20 },
];

export const RESULTADOS = ['Aprobado', 'Aprobado con observaciones', 'Desaprobado'];

export const NOTA_APROBATORIA = 11;

// Docentes que pueden ser jurado. juradosPrevios = jurados del ciclo fuera de estos datos.
const docentes = [
  { id: 'd-01', usuarioId: null, titulo: 'Dr.', nombres: 'Ricardo', apellidos: 'Cárdenas Loayza', grado: 'doctor', departamento: 'Ingeniería Civil', juradosPrevios: 1 },
  { id: 'd-02', usuarioId: null, titulo: 'Mg.', nombres: 'Sandra', apellidos: 'Bustamante Ríos', grado: 'magíster', departamento: 'Ingeniería Industrial', juradosPrevios: 2 },
  { id: 'd-03', usuarioId: null, titulo: 'Ing.', nombres: 'Luis Fernando', apellidos: 'Ocampo Salas', grado: 'ingeniero', departamento: 'Ingeniería Civil', juradosPrevios: 3 },
  { id: 'd-04', usuarioId: null, titulo: 'Dra.', nombres: 'Gabriela', apellidos: 'Torres Anchante', grado: 'doctor', departamento: 'Estudios Generales', juradosPrevios: 0 },
  { id: 'd-05', usuarioId: null, titulo: 'Dr.', nombres: 'Pedro', apellidos: 'Salazar Huamán', grado: 'doctor', departamento: 'Ingeniería de Sistemas', juradosPrevios: 0 },
  { id: 'd-06', usuarioId: 'u-102', titulo: 'Mg.', nombres: 'Julio', apellidos: 'Vargas Aliaga', grado: 'magíster', departamento: 'Ingeniería Industrial', juradosPrevios: 2 },
  { id: 'd-07', usuarioId: 'u-101', titulo: 'Dra.', nombres: 'Mariela', apellidos: 'Quispe Ramos', grado: 'doctor', departamento: 'Ingeniería de Sistemas', juradosPrevios: 2 },
  { id: 'd-08', usuarioId: null, titulo: 'Mg.', nombres: 'Carla', apellidos: 'Benavides Rojas', grado: 'magíster', departamento: 'Ingeniería Industrial', juradosPrevios: 0 },
];

// Vista de los trabajos concluidos que usa la HU-6 (la entidad Trabajo es de la HU-2).
// asesorId apunta a un docente; si el asesor no está en la lista, solo se guarda su nombre.
// conflictos: docentes con posible conflicto de interés con el equipo.
const trabajos = [
  {
    codigo: 'TFC-2026-2-012',
    titulo: 'Optimización de rutas de reparto para comercios de Lima Metropolitana',
    linea: 'Gestión de operaciones', departamento: 'Ingeniería Industrial',
    asesorId: 'd-06', asesor: 'Mg. Julio Vargas Aliaga',
    equipo: [
      { usuarioId: 'u-004', nombre: 'Diana Carolina Rojas Ttito', corto: 'Diana Rojas Ttito', responsable: true },
      { usuarioId: 'u-003', nombre: 'Jorge Luis Tapia Bendezú', corto: 'Jorge Tapia Bendezú', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-24',
    conflictos: [{ docenteId: 'd-04', motivo: 'dictó clases al equipo en 2026-1' }],
  },
  {
    codigo: 'TFC-2026-2-007',
    titulo: 'Clasificación automática de reclamos ciudadanos en municipalidades distritales',
    linea: 'Ciencia de datos aplicada', departamento: 'Ingeniería de Sistemas',
    asesorId: 'd-07', asesor: 'Dra. Mariela Quispe Ramos',
    equipo: [
      { usuarioId: null, nombre: 'Ana Lucía Ferreyra Loza', corto: 'Ana Ferreyra Loza', responsable: true },
      { usuarioId: null, nombre: 'Martín Alonso Gálvez Ruiz', corto: 'Martín Gálvez Ruiz', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-20', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-003',
    titulo: 'Monitoreo del consumo energético en edificios universitarios con sensores IoT',
    linea: 'Automatización y control', departamento: 'Ingeniería de Sistemas',
    asesorId: null, asesor: 'Dr. Óscar Villanueva Prado',
    equipo: [
      { usuarioId: null, nombre: 'Luciana Paredes Soto', corto: 'Luciana Paredes Soto', responsable: true },
      { usuarioId: null, nombre: 'Renato Díaz Cornejo', corto: 'Renato Díaz Cornejo', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-18', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-005',
    titulo: 'Gestión de inventarios con analítica predictiva para boticas de barrio',
    linea: 'Gestión de operaciones', departamento: 'Ingeniería Industrial',
    asesorId: 'd-02', asesor: 'Mg. Sandra Bustamante Ríos',
    equipo: [{ usuarioId: null, nombre: 'Valeria Núñez Quiroga', corto: 'Valeria Núñez Quiroga', responsable: true }],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-25', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-009',
    titulo: 'Control de calidad por visión artificial en una planta de galletas',
    linea: 'Automatización y control', departamento: 'Ingeniería Industrial',
    asesorId: null, asesor: 'Mg. Andrés Chávez Ninahuanca',
    equipo: [
      { usuarioId: null, nombre: 'Sebastián Lazo Medina', corto: 'Sebastián Lazo Medina', responsable: true },
      { usuarioId: null, nombre: 'Camila Ortiz Ruiz', corto: 'Camila Ortiz Ruiz', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-26', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-014',
    titulo: 'Plataforma de seguimiento de egresados para la facultad',
    linea: 'Ing. de software', departamento: 'Ingeniería de Sistemas',
    asesorId: 'd-05', asesor: 'Dr. Pedro Salazar Huamán',
    equipo: [{ usuarioId: null, nombre: 'Fabián Rosales Vera', corto: 'Fabián Rosales Vera', responsable: true }],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-23', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-018',
    titulo: 'Evaluación de pavimentos permeables en vías locales de Santiago de Surco',
    linea: 'Sostenibilidad urbana', departamento: 'Ingeniería Civil',
    asesorId: 'd-01', asesor: 'Dr. Ricardo Cárdenas Loayza',
    equipo: [
      { usuarioId: null, nombre: 'Andrea Molina Castro', corto: 'Andrea Molina Castro', responsable: true },
      { usuarioId: null, nombre: 'Joaquín Pérez Llanos', corto: 'Joaquín Pérez Llanos', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-27', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-021',
    titulo: 'Recomendador de cursos electivos basado en el historial académico',
    linea: 'Ciencia de datos aplicada', departamento: 'Ingeniería de Sistemas',
    asesorId: 'd-07', asesor: 'Dra. Mariela Quispe Ramos',
    equipo: [{ usuarioId: null, nombre: 'Daniela Huerta Ramos', corto: 'Daniela Huerta Ramos', responsable: true }],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-24', conflictos: [],
  },
  {
    codigo: 'TFC-2026-2-025',
    titulo: 'Simulación de colas en la atención de una agencia bancaria de Miraflores',
    linea: 'Gestión de operaciones', departamento: 'Ingeniería Industrial',
    asesorId: 'd-02', asesor: 'Mg. Sandra Bustamante Ríos',
    equipo: [
      { usuarioId: null, nombre: 'Gonzalo Ríos Tello', corto: 'Gonzalo Ríos Tello', responsable: true },
      { usuarioId: null, nombre: 'Mariana Cabrera Vílchez', corto: 'Mariana Cabrera Vílchez', responsable: false },
    ],
    entregables: { aprobados: 5, total: 5 }, informeAprobadoEl: '2026-11-26', conflictos: [],
  },
];

// Sustentaciones. estado: 'programada' | 'reprogramada' | 'realizada' | 'desaprobada'
const sustentaciones = [
  {
    id: 's-007', trabajoCodigo: 'TFC-2026-2-007', estado: 'programada', programadaEl: '2026-09-02',
    fecha: '2026-12-11', hora: '11:00', salaId: 'A-402', modalidad: 'Presencial',
    jurado: [
      { docenteId: 'd-05', presidente: true },
      { docenteId: 'd-02', presidente: false },
      { docenteId: 'd-08', presidente: false },
    ],
    acta: null, historial: [],
  },
  {
    id: 's-003', trabajoCodigo: 'TFC-2026-2-003', estado: 'realizada', programadaEl: '2026-09-01',
    fecha: '2026-12-09', hora: '09:00', salaId: 'B-201', modalidad: 'Presencial',
    jurado: [
      { docenteId: 'd-01', presidente: true },
      { docenteId: 'd-03', presidente: false },
      { docenteId: 'd-04', presidente: false },
    ],
    acta: {
      notas: { rigor: 16, resultados: 15, informe: 17, exposicion: 16 },
      resultado: 'Aprobado',
      observaciones: 'Se sugiere ampliar la muestra a dos edificios adicionales.',
      registrada: true, registradaEl: '2026-12-09', registradaHora: '10:20',
    },
    historial: [],
  },
];

// Reservas de salas por otras actividades de la facultad
const reservas = [
  { salaId: 'A-402', fecha: '2026-12-11', hora: '08:00', motivo: 'Examen de suficiencia de la facultad' },
];

export const DATOS_SEMILLA = { docentes, trabajos, sustentaciones, reservas };

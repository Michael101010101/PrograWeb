// Datos semilla de la HU-3 · Asesores y asignación.
// Se copian a localStorage la primera vez (ver services/asesoriasService.js).
// Los usuarioId ('u-101', 'u-102', …) son los del seed.json de la HU-1.

export const LINEAS = [
  'Automatización y control',
  'Ciencia de datos aplicada',
  'Gestión de operaciones',
  'Ing. de software',
  'Innovación educativa',
  'Sostenibilidad urbana',
];

export const DEPARTAMENTOS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Civil',
  'Estudios Generales',
];

export const GRADOS = [
  { gradoAcademico: 'Ingeniero', titulo: 'Ing.' },
  { gradoAcademico: 'Magíster', titulo: 'Mg.' },
  { gradoAcademico: 'Doctor', titulo: 'Dr.' },
];

// Ficha de cada asesor. El cupo disponible se calcula: cupoMaximo - cupoOcupado.
const asesores = [
  {
    id: 'a-01', usuarioId: 'u-103', titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Andrés', apellidos: 'Chávez Ninahuanca', correo: 'achavez@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control'],
    especialidad: 'Visión artificial en líneas de producción', trabajosAsesorados: 8,
    cupoMaximo: 6, cupoOcupado: 2, sinCupoDesde: null,
  },
  {
    id: 'a-02', usuarioId: null, titulo: 'Dr.', gradoAcademico: 'Doctor',
    nombres: 'Pedro', apellidos: 'Salazar Huamán', correo: 'psalazar@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas', lineas: ['Automatización y control', 'Ing. de software'],
    especialidad: 'Sistemas embebidos y sensórica', trabajosAsesorados: 12,
    cupoMaximo: 5, cupoOcupado: 3, sinCupoDesde: null,
  },
  {
    id: 'a-03', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Sandra', apellidos: 'Bustamante Ríos', correo: 'sbustamante@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control', 'Gestión de operaciones'],
    especialidad: 'Simulación de procesos', trabajosAsesorados: 15,
    cupoMaximo: 4, cupoOcupado: 3, sinCupoDesde: null,
  },
  {
    id: 'a-04', usuarioId: null, titulo: 'Ing.', gradoAcademico: 'Ingeniero',
    nombres: 'Luis Fernando', apellidos: 'Ocampo Salas', correo: 'locampo@ulima.edu.pe',
    departamento: 'Ingeniería Civil', lineas: ['Automatización y control'],
    especialidad: 'Control de estructuras inteligentes', trabajosAsesorados: 10,
    cupoMaximo: 5, cupoOcupado: 5, sinCupoDesde: '2026-09-03',
  },
  {
    id: 'a-05', usuarioId: null, titulo: 'Dra.', gradoAcademico: 'Doctor',
    nombres: 'Gabriela', apellidos: 'Torres Anchante', correo: 'gtorres@ulima.edu.pe',
    departamento: 'Estudios Generales', lineas: ['Automatización y control', 'Innovación educativa'],
    especialidad: 'Instrumentación para laboratorios', trabajosAsesorados: 6,
    cupoMaximo: 5, cupoOcupado: 2, sinCupoDesde: null,
  },
  {
    id: 'a-06', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Héctor', apellidos: 'Mendoza Cárcamo', correo: 'hmendoza@ulima.edu.pe',
    departamento: 'Ingeniería Civil', lineas: ['Automatización y control', 'Sostenibilidad urbana'],
    especialidad: 'Monitoreo ambiental con sensores', trabajosAsesorados: 9,
    cupoMaximo: 6, cupoOcupado: 5, sinCupoDesde: null,
  },
  {
    id: 'a-07', usuarioId: 'u-101', titulo: 'Dra.', gradoAcademico: 'Doctor',
    nombres: 'Mariela', apellidos: 'Quispe Ramos', correo: 'mquispe@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas',
    lineas: ['Ciencia de datos aplicada', 'Innovación educativa', 'Ing. de software'],
    especialidad: 'Analítica educativa y minería de datos', trabajosAsesorados: 34,
    cupoMaximo: 6, cupoOcupado: 3, sinCupoDesde: null,
    experiencia:
      'Doce años como docente investigadora en analítica educativa. Ha asesorado 34 trabajos de fin de carrera, con publicaciones sobre predicción de rendimiento académico y minería de datos en plataformas virtuales.',
    concluidos: 29, tiempoRevision: '2.4 días', sustentacionesJurado: 11,
  },
  {
    id: 'a-08', usuarioId: 'u-102', titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Julio César', apellidos: 'Vargas Aliaga', correo: 'jvargas@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Gestión de operaciones'],
    especialidad: 'Logística y cadena de suministro', trabajosAsesorados: 11,
    cupoMaximo: 5, cupoOcupado: 3, sinCupoDesde: null,
  },
  {
    id: 'a-09', usuarioId: null, titulo: 'Dr.', gradoAcademico: 'Doctor',
    nombres: 'Ricardo', apellidos: 'Cárdenas Loayza', correo: 'rcardenas@ulima.edu.pe',
    departamento: 'Ingeniería Civil', lineas: ['Sostenibilidad urbana'],
    especialidad: 'Movilidad urbana sostenible', trabajosAsesorados: 14,
    cupoMaximo: 4, cupoOcupado: 3, sinCupoDesde: null,
  },
  {
    id: 'a-10', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Carla', apellidos: 'Benavides Rojas', correo: 'cbenavides@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control', 'Gestión de operaciones'],
    especialidad: 'Control estadístico de procesos', trabajosAsesorados: 7,
    cupoMaximo: 4, cupoOcupado: 1, sinCupoDesde: null,
  },
  {
    id: 'a-11', usuarioId: null, titulo: 'Dr.', gradoAcademico: 'Doctor',
    nombres: 'Óscar', apellidos: 'Villanueva Prado', correo: 'ovillanueva@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas', lineas: ['Automatización y control'],
    especialidad: 'Robótica móvil y control', trabajosAsesorados: 18,
    cupoMaximo: 6, cupoOcupado: 4, sinCupoDesde: null,
  },
  {
    id: 'a-12', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Lucía', apellidos: 'Paredes Zevallos', correo: 'lparedes@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control'],
    especialidad: 'Mantenimiento predictivo', trabajosAsesorados: 5,
    cupoMaximo: 4, cupoOcupado: 2, sinCupoDesde: null,
  },
  {
    id: 'a-13', usuarioId: null, titulo: 'Ing.', gradoAcademico: 'Ingeniero',
    nombres: 'Renzo', apellidos: 'Alvarado Cueva', correo: 'ralvarado@ulima.edu.pe',
    departamento: 'Ingeniería Civil', lineas: ['Automatización y control', 'Sostenibilidad urbana'],
    especialidad: 'Domótica y eficiencia energética', trabajosAsesorados: 4,
    cupoMaximo: 3, cupoOcupado: 1, sinCupoDesde: null,
  },
  {
    id: 'a-14', usuarioId: null, titulo: 'Dra.', gradoAcademico: 'Doctor',
    nombres: 'Patricia', apellidos: 'Lozano Medina', correo: 'plozano@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas', lineas: ['Automatización y control', 'Ciencia de datos aplicada'],
    especialidad: 'Internet de las cosas industrial', trabajosAsesorados: 20,
    cupoMaximo: 6, cupoOcupado: 5, sinCupoDesde: null,
  },
  {
    id: 'a-15', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Fernando', apellidos: 'Quiroz Delgado', correo: 'fquiroz@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control'],
    especialidad: 'Automatización con PLC', trabajosAsesorados: 9,
    cupoMaximo: 5, cupoOcupado: 3, sinCupoDesde: null,
  },
  {
    id: 'a-16', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Rocío', apellidos: 'Huamaní Castro', correo: 'rhuamani@ulima.edu.pe',
    departamento: 'Estudios Generales', lineas: ['Automatización y control', 'Innovación educativa'],
    especialidad: 'Laboratorios remotos', trabajosAsesorados: 3,
    cupoMaximo: 3, cupoOcupado: 1, sinCupoDesde: null,
  },
  {
    id: 'a-17', usuarioId: null, titulo: 'Dr.', gradoAcademico: 'Doctor',
    nombres: 'Alberto', apellidos: 'Sánchez Ugarte', correo: 'asanchez@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas', lineas: ['Automatización y control', 'Ing. de software'],
    especialidad: 'Software para sistemas de control', trabajosAsesorados: 16,
    cupoMaximo: 5, cupoOcupado: 4, sinCupoDesde: null,
  },
  {
    id: 'a-18', usuarioId: null, titulo: 'Ing.', gradoAcademico: 'Ingeniero',
    nombres: 'Miguel Ángel', apellidos: 'Torres Vega', correo: 'mtorres@ulima.edu.pe',
    departamento: 'Ingeniería Industrial', lineas: ['Automatización y control'],
    especialidad: 'Sensórica para agroindustria', trabajosAsesorados: 2,
    cupoMaximo: 4, cupoOcupado: 2, sinCupoDesde: null,
  },
  {
    id: 'a-19', usuarioId: null, titulo: 'Mg.', gradoAcademico: 'Magíster',
    nombres: 'Silvia', apellidos: 'Montoya Herrera', correo: 'smontoya@ulima.edu.pe',
    departamento: 'Ingeniería de Sistemas', lineas: ['Ciencia de datos aplicada'],
    especialidad: 'Aprendizaje automático', trabajosAsesorados: 10,
    cupoMaximo: 5, cupoOcupado: 5, sinCupoDesde: '2026-09-02',
  },
  {
    id: 'a-20', usuarioId: null, titulo: 'Dra.', gradoAcademico: 'Doctor',
    nombres: 'Verónica', apellidos: 'Ríos Palacios', correo: 'vrios@ulima.edu.pe',
    departamento: 'Estudios Generales', lineas: ['Innovación educativa'],
    especialidad: 'Diseño instruccional', trabajosAsesorados: 8,
    cupoMaximo: 4, cupoOcupado: 2, sinCupoDesde: null,
  },
];

// Solicitudes de asesoría. estado: 'pendiente' | 'aceptada' | 'rechazada' | 'retirada'
const solicitudes = [
  {
    id: 's-029', asesorId: 'a-07', estado: 'pendiente', fecha: '2026-09-01',
    trabajo: {
      codigo: 'TFC-2026-2-029',
      titulo: 'Detección temprana de fallas en bombas de agua mediante señales de vibración',
      linea: 'Ciencia de datos aplicada',
      equipo: [
        { nombre: 'Karla Sofía Aguirre Ynga', responsable: true },
        { nombre: 'Bruno Matías Palomino Chávez', responsable: false },
      ],
    },
    mensaje:
      'Su trabajo sobre analítica predictiva en mantenimiento fue el punto de partida de nuestra propuesta. Contamos con 14 meses de registros de vibración de la planta de Lurín.',
    motivo: null, resueltaEl: null,
  },
  {
    id: 's-033', asesorId: 'a-07', estado: 'pendiente', fecha: '2026-09-03',
    trabajo: {
      codigo: 'TFC-2026-2-033',
      titulo: 'Tablero de indicadores de asistencia para colegios públicos de Lima Sur',
      linea: 'Innovación educativa',
      equipo: [{ nombre: 'Milagros Beatriz Ccahuana Solís', responsable: true }],
    },
    mensaje:
      'Trabajo con la UGEL 01 y necesito orientación metodológica para validar los indicadores con los directores de tres colegios.',
    motivo: null, resueltaEl: null,
  },
  {
    id: 's-011', asesorId: 'a-07', estado: 'aceptada', fecha: '2026-08-31',
    trabajo: {
      codigo: 'TFC-2026-2-012',
      titulo: 'Modelo predictivo de deserción en estudiantes de primer ciclo',
      linea: 'Ciencia de datos aplicada',
      equipo: [
        { nombre: 'Rosa Elena Quispe Mendoza', responsable: true },
        { nombre: 'Diego Alonso Ramírez Puente', responsable: false },
      ],
    },
    mensaje: 'Queremos aplicar su experiencia en analítica educativa al problema de la deserción.',
    motivo: null, resueltaEl: '2026-09-01',
  },
  {
    id: 's-014', asesorId: 'a-07', estado: 'aceptada', fecha: '2026-08-31',
    trabajo: {
      codigo: 'TFC-2026-2-015',
      titulo: 'Plataforma de tutoría entre pares para cursos de matemática básica',
      linea: 'Innovación educativa',
      equipo: [{ nombre: 'Milagros Beatriz Ccahuana Solís', responsable: true }],
    },
    mensaje: 'Necesito orientación para medir el impacto de la tutoría entre pares.',
    motivo: null, resueltaEl: '2026-09-02',
  },
  {
    id: 's-018', asesorId: 'a-07', estado: 'rechazada', fecha: '2026-09-01',
    trabajo: {
      codigo: 'TFC-2026-2-018',
      titulo: 'Aplicativo de reservas para canchas deportivas municipales',
      linea: 'Ing. de software',
      equipo: [{ nombre: 'Kevin Arturo Salas Rengifo', responsable: true }],
    },
    mensaje: 'Buscamos asesoría para la arquitectura del aplicativo.',
    motivo: 'El alcance es de desarrollo de software sin componente de investigación; sugiero buscar asesor en Ing. de software aplicada.',
    resueltaEl: '2026-09-02',
  },
];

// Vista de los trabajos que usa la HU-3 (la entidad Trabajo es de la HU-2).
// estado: 'propuesta' | 'en_desarrollo' | 'concluido'
const trabajos = [
  {
    codigo: 'TFC-2026-2-041',
    titulo: 'Automatización del control de calidad en líneas de envasado de conservas',
    linea: 'Automatización y control', carrera: 'Ingeniería Industrial',
    integrantes: [
      { usuarioId: 'u-003', nombre: 'Jorge Luis Tapia Bendezú' },
      { usuarioId: 'u-004', nombre: 'Diana Carolina Rojas Ttito' },
    ],
    estado: 'propuesta', asesorId: null, avance: 0, porRevisar: 0, nota: null,
  },
  {
    codigo: 'TFC-2026-2-012',
    titulo: 'Modelo predictivo de deserción en estudiantes de primer ciclo',
    linea: 'Ciencia de datos aplicada', carrera: 'Ingeniería de Sistemas',
    integrantes: [
      { usuarioId: 'u-001', nombre: 'Rosa Elena Quispe Mendoza' },
      { usuarioId: 'u-002', nombre: 'Diego Alonso Ramírez Puente' },
    ],
    estado: 'en_desarrollo', asesorId: 'a-07', avance: 55, porRevisar: 2,
    nota: { tono: 'danger', texto: '1 entregable vencido sin presentar' },
  },
  {
    codigo: 'TFC-2026-2-015',
    titulo: 'Plataforma de tutoría entre pares para cursos de matemática básica',
    linea: 'Innovación educativa', carrera: 'Ingeniería de Sistemas',
    integrantes: [{ usuarioId: null, nombre: 'Milagros Beatriz Ccahuana Solís' }],
    estado: 'en_desarrollo', asesorId: 'a-07', avance: 55, porRevisar: 1,
    nota: { tono: 'warning', texto: 'Próximo vencimiento 12/09/2026' },
  },
  {
    codigo: 'TFC-2026-2-007',
    titulo: 'Clasificación automática de reclamos ciudadanos en municipalidades distritales',
    linea: 'Ciencia de datos aplicada', carrera: 'Ingeniería de Sistemas',
    integrantes: [
      { usuarioId: null, nombre: 'Jorge Luis Tapia Bendezú' },
      { usuarioId: null, nombre: 'Ana Lucía Ferreyra Loza' },
    ],
    estado: 'concluido', asesorId: 'a-07', avance: 100, porRevisar: 0,
    nota: { tono: 'muted', texto: 'Sustentación pendiente de programar por coordinación' },
  },
];

// Próximos entregables de los asesorados (la entidad Entregable es de la HU-4).
const vencimientos = [
  { trabajoCodigo: 'TFC-2026-2-012', entregable: '4. Resultados preliminares', fecha: '2026-08-30', peso: 20 },
  { trabajoCodigo: 'TFC-2026-2-015', entregable: '3. Diseño metodológico', fecha: '2026-09-12', peso: 20 },
  { trabajoCodigo: 'TFC-2026-2-012', entregable: '5. Informe final', fecha: '2026-11-27', peso: 25 },
  { trabajoCodigo: 'TFC-2026-2-015', entregable: '4. Resultados preliminares', fecha: '2026-10-16', peso: 20 },
  { trabajoCodigo: 'TFC-2026-2-015', entregable: '5. Informe final', fecha: '2026-11-27', peso: 25 },
];

export const DATOS_SEMILLA = { asesores, solicitudes, trabajos, vencimientos, historial: [] };

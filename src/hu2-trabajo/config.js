
export const LINEAS_INVESTIGACION = [
  'Ciencia de datos aplicada',
  'Automatización y control',
  'Gestión de operaciones',
  'Innovación educativa',
  'Ingeniería de software',
  'Sostenibilidad urbana',
];

export const ESTADOS = {
  propuesta: { label: 'Propuesta' },
  en_desarrollo: { label: 'En desarrollo' },
  concluido: { label: 'Concluido' },
  desistido: { label: 'Desistido' },
};
export const ESTADOS_VIGENTES = ['propuesta', 'en_desarrollo', 'concluido'];
export const TRANSICIONES = {
  propuesta: ['desistido'],
  en_desarrollo: ['concluido', 'desistido'],
  concluido: [],
  desistido: [],
};

export const LIMITES = {
  tituloMin: 20,
  tituloMax: 160,
  resumenMin: 300,
  resumenMax: 1200,
  objetivosMin: 20,
  objetivosMax: 800,
  palabrasMin: 3,
  palabrasMax: 6,
  palabraMax: 40,
  integrantesMax: 3,
  motivoMin: 40,
  motivoMax: 500,
  busquedaMin: 3,
};

export const PLANTILLA_PLAN = [
  { nombre: 'Plan de investigación', peso: 15 },
  { nombre: 'Marco teórico', peso: 20 },
  { nombre: 'Diseño metodológico', peso: 20 },
  { nombre: 'Resultados preliminares', peso: 20 },
  { nombre: 'Informe final', peso: 25 },
];
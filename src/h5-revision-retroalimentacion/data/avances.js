import { DATOS_SEMILLA } from './referenciaHu4.js';
// Escenario del mockup 5.2: Diseño metodológico v2 queda pendiente de revisión.
export const datosDemo = { ...DATOS_SEMILLA,
  avances: DATOS_SEMILLA.avances.map((a) => a.id === 'av-06' ? { ...a, estado: 'en_revision', revision: null } : a),
};

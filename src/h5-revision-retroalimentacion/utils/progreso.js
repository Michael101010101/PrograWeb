import { versionesDe } from '../services/revisionService.js';
export function progresoTrabajo(datos, codigo) {
  const entregables = datos.entregables.filter((e) => e.trabajoCodigo === codigo);
  const aprobados = entregables.filter((e) => versionesDe(datos, e.id)[0]?.estado === 'aprobado');
  const porcentaje = aprobados.filter((e) => e.obligatorio).reduce((suma, e) => suma + e.peso, 0);
  return { porcentaje, aprobados: aprobados.length, total: entregables.length };
}

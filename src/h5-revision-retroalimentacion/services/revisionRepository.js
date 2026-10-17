import { DATOS_SEMILLA } from '../../hu4-entregables/data/datosSemilla.js';
import { datosDemo } from '../data/avances.js';
import { adaptarHu4 } from './adaptador.js';
import { aplicarEventos, validarAccion } from './revisionService.js';
export const CLAVE_CATALOGO = 'tfc.hu5.catalogo.v1';
export const PREFIJO_EVENTO = 'tfc.hu5.evento.v1.';
const EVENTO_LOCAL = 'hu5-cambio';
export function crearRepositorio(almacen, destino) {
  let cacheFirma;
  let cache;
  function leer() {
    try {
      const origen = almacen.getItem('tfc.entregables') ?? almacen.getItem('tfc.hu4');
      const catalogo = origen ?? almacen.getItem(CLAVE_CATALOGO) ?? JSON.stringify(datosDemo);
      const claves = Array.from({ length: almacen.length }, (_, i) => almacen.key(i)).filter((k) => k?.startsWith(PREFIJO_EVENTO)).sort();
      const registros = claves.map((k) => almacen.getItem(k));
      const trabajosHu2 = almacen.getItem('tfc.trabajos');
      const firma = JSON.stringify([catalogo, registros, trabajosHu2]);
      if (firma === cacheFirma) return cache;
      const base = JSON.parse(catalogo);
      if (trabajosHu2) {
        const trabajos = JSON.parse(trabajosHu2);
        base.trabajos = [...base.trabajos.filter((t) => !trabajos.some((real) => real.codigo === t.codigo)),
          ...trabajos.map((t) => {
            const previo = base.trabajos.find((item) => item.codigo === t.codigo);
            return { ...previo, ...t, asesor: t.asesor ? { ...previo?.asesor, ...t.asesor, usuarioId: t.asesor.usuarioId ?? t.asesor.id } : null };
          })];
      }
      cache = { datos: aplicarEventos(adaptarHu4(base), registros.map((r) => JSON.parse(r))), error: null };
      cacheFirma = firma;
    } catch {
      if (!cache?.error) cache = { datos: { trabajos: [], entregables: [], avances: [] }, error: 'No se pudieron leer los datos de revisión. Comprueba el almacenamiento del navegador.' };
      cacheFirma = undefined;
    }
    return cache;
  }
  function suscribir(callback) {
    const storage = (e) => { if (e.key === null || e.key === 'tfc.hu4' || e.key === 'tfc.entregables' || e.key === 'tfc.trabajos' || e.key === CLAVE_CATALOGO || e.key?.startsWith(PREFIJO_EVENTO)) callback(); };
    destino.addEventListener('storage', storage);
    destino.addEventListener(EVENTO_LOCAL, callback);
    destino.addEventListener('entregables-cambio', callback);
    return () => { destino.removeEventListener('storage', storage); destino.removeEventListener(EVENTO_LOCAL, callback); destino.removeEventListener('entregables-cambio', callback); };
  }
  function ejecutar(usuario, accion) {
    const snapshot = leer();
    if (snapshot.error) throw new Error(snapshot.error);
    validarAccion(snapshot.datos, usuario, accion);
    const evento = { ...accion, texto: (accion.texto || '').trim(), id: globalThis.crypto.randomUUID(),
      fecha: new Date().toISOString(), autorId: usuario.id, autor: `${usuario.nombres} ${usuario.apellidos}`, rol: usuario.rol };
    try {
      if (!almacen.getItem('tfc.entregables') && !almacen.getItem('tfc.hu4') && !almacen.getItem(CLAVE_CATALOGO)) almacen.setItem(CLAVE_CATALOGO, JSON.stringify(datosDemo));
      // Clave independiente por evento: ninguna pestaña sobrescribe el historial de otra.
      almacen.setItem(PREFIJO_EVENTO + evento.id, JSON.stringify(evento));
    } catch { throw new Error('No se pudo guardar. Comprueba el espacio o los permisos del navegador.'); }
    destino.dispatchEvent(new Event(EVENTO_LOCAL));
    return evento;
  }
  return { leer, suscribir, ejecutar };
}
let instancia;
export function repositorioRevision() {
  if (!instancia) {
    let almacen;
    try { almacen = window.localStorage; if (!almacen.getItem('tfc.entregables')) almacen.setItem('tfc.entregables', JSON.stringify(DATOS_SEMILLA)); }
    catch { almacen = { getItem() { throw new Error('Almacenamiento no disponible'); } }; }
    const repositorio = crearRepositorio(almacen, window);
    instancia = { ...repositorio, ejecutar: (usuario, accion) =>
      navigator.locks ? navigator.locks.request('tfc-hu5-escritura', () => repositorio.ejecutar(usuario, accion))
        : Promise.resolve().then(() => repositorio.ejecutar(usuario, accion)) };
  }
  return instancia;
}

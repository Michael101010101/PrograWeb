
import { api } from '../../shared/api.js';
import { TRANSICIONES } from '../config.js';

export function obtenerCatalogos() {
  return api('/trabajos/catalogos');
}

export function obtenerMiTrabajo() {
  return api('/trabajos/mio');
}

export async function listarMisTrabajos(estado = '') {
  const { trabajos } = await api(`/trabajos/mios${estado ? `?estado=${encodeURIComponent(estado)}` : ''}`);
  return trabajos;
}

export async function resumenTrabajoVigente() {
  const { trabajo } = await api('/trabajos/mio/resumen');
  return trabajo;
}

export async function buscarEstudiantes(texto, trabajoId) {
  const q = new URLSearchParams({ q: texto, ...(trabajoId ? { trabajoId } : {}) });
  const { estudiantes } = await api(`/trabajos/estudiantes?${q}`);
  return estudiantes;
}

export function transicionesPermitidas(trabajo) {
  return TRANSICIONES[trabajo.estado] ?? [];
}

export async function registrarTrabajo(_usuario, datos) {
  const { trabajo } = await api('/trabajos', { method: 'POST', body: datos });
  descartarBorrador(_usuario?.id);
  return trabajo;
}

export async function actualizarFicha(_usuario, trabajoId, datos) {
  const { trabajo } = await api(`/trabajos/${encodeURIComponent(trabajoId)}`, { method: 'PUT', body: datos });
  return trabajo;
}

export async function guardarEquipo(_usuario, trabajoId, integrantes) {
  const cuerpo = { integrantes: integrantes.map((i) => ({ usuarioId: i.usuarioId, responsable: Boolean(i.responsable) })) };
  const { trabajo } = await api(`/trabajos/${encodeURIComponent(trabajoId)}/equipo`, { method: 'PUT', body: cuerpo });
  return trabajo;
}

export function cambiarEstado(_usuario, trabajoId, estado, motivo) {
  return api(`/trabajos/${encodeURIComponent(trabajoId)}/estado`, { method: 'PATCH', body: { estado, motivo } });
}

const CLAVE_BORRADORES = 'tfc.borradoresTrabajo';

function leerBorradores() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_BORRADORES)) ?? {};
  } catch {
    return {};
  }
}

function escribirBorradores(todos) {
  try {
    localStorage.setItem(CLAVE_BORRADORES, JSON.stringify(todos));
  } catch {
    return;
  }
}

export function obtenerBorrador(usuarioId) {
  return leerBorradores()[usuarioId] ?? null;
}

export function guardarBorrador(usuarioId, valores) {
  const todos = leerBorradores();
  const guardadoEn = new Date().toISOString();
  todos[usuarioId] = { valores, guardadoEn };
  escribirBorradores(todos);
  return guardadoEn;
}

export function descartarBorrador(usuarioId) {
  if (!usuarioId) return;
  const todos = leerBorradores();
  delete todos[usuarioId];
  escribirBorradores(todos);
}
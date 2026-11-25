/**
 * Error de servicio con código HTTP equivalente, para que en la entrega 2
 * el mismo manejo sirva con las respuestas reales de la API.
 *   400 validación · 401 credenciales · 403 sin permiso / cuenta no habilitada
 *   404 no existe · 409 conflicto (duplicado) · 410 enlace vencido · 423 bloqueo temporal
 */
export default class ServiceError extends Error {
  constructor(status, mensaje, { campos = {}, datos = {} } = {}) {
    super(mensaje);
    this.name = 'ServiceError';
    this.status = status;
    this.campos = campos;
    this.datos = datos;
  }
}

import './estadosTrabajo.css';

export default function EstadoToast({ tipo = 'exito' }) {
  const esExito = tipo === 'exito';

  return (
    <div
      className={
        esExito
          ? 'hu2-toast hu2-toast-exito'
          : 'hu2-toast hu2-toast-error'
      }
    >
      <div className="hu2-toast-icono">
        {esExito ? '✓' : '!'}
      </div>

      <div>
        <strong>
          {esExito
            ? 'Estado actualizado a Concluido'
            : 'No se pudo actualizar el estado'}
        </strong>

        <p>
          {esExito
            ? 'Se notificó a la asesora y a la coordinación.'
            : 'Quedan 2 entregables sin aprobar.'}
        </p>
      </div>

      <button type="button">×</button>
    </div>
  );
}
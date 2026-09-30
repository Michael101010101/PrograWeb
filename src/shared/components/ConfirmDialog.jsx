import Modal from './Modal.jsx';

/**
 * Diálogo de confirmación para acciones destructivas o irreversibles.
 * variante: 'peligro' (botón rojo) | 'primario'
 */
export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'peligro',
  procesando = false,
  onConfirmar,
  onCancelar,
  children,
}) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCancelar}
      titulo={titulo}
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCancelar} disabled={procesando}>{textoCancelar}</button>
          <button
            className={`btn ${variante === 'peligro' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirmar}
            disabled={procesando}
          >
            {procesando ? 'Procesando…' : textoConfirmar}
          </button>
        </>
      }
    >
      {mensaje && <p>{mensaje}</p>}
      {children}
    </Modal>
  );
}

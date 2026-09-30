import { useEffect, useId, useRef } from 'react';

/** Modal base: cierra con Escape y con clic fuera; enfoca el primer control al abrir. */
export default function Modal({ abierto, onCerrar, titulo, children, acciones, ancho, centrado = false, cerrable = true }) {
  const ref = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!abierto) return undefined;
    const anterior = document.activeElement;
    const primero = ref.current?.querySelector('input, textarea, select, button:not(.modal__close)');
    primero?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape' && cerrable) onCerrar?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      anterior?.focus?.();
    };
  }, [abierto, cerrable, onCerrar]);

  if (!abierto) return null;

  const clases = ['modal', ancho === 'wide' && 'modal--wide', centrado && 'modal--center'].filter(Boolean).join(' ');

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && cerrable && onCerrar?.()}>
      <div className={clases} role="dialog" aria-modal="true" aria-labelledby={tituloId} ref={ref}>
        {titulo && (
          <div className="modal__head">
            <h2 id={tituloId}>{titulo}</h2>
            {cerrable && !centrado && (
              <button className="modal__close" onClick={onCerrar} aria-label="Cerrar">×</button>
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
        {acciones && <div className="modal__actions">{acciones}</div>}
      </div>
    </div>
  );
}

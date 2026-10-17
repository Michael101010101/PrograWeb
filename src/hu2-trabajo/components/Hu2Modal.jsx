import { useEffect, useId, useRef } from 'react';
import './estadosTrabajo.css';

export default function Hu2Modal({ abierto, onCerrar, titulo, className = '', children, cerrable = true }) {
  const ref = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!abierto) return undefined;
    const anterior = document.activeElement;
    ref.current?.querySelector('textarea, input, select, button:not(.hu2-modal-cerrar)')?.focus();
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

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && cerrable && onCerrar?.()}>
      <div className={`hu2-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={tituloId} ref={ref}>
        {typeof titulo === 'string' ? <h2 id={tituloId}>{titulo}</h2> : titulo?.(tituloId)}
        {children}
      </div>
    </div>
  );
}
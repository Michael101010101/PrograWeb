import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);
const ICONOS = { exito: '✓', aviso: '!', error: '!' };

/**
 * Notificaciones de resultado para toda operación de escritura.
 * Uso: const { mostrar } = useToast(); mostrar({ tipo: 'exito', titulo, mensaje });
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const contador = useRef(0);

  const cerrar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    ({ tipo = 'exito', titulo, mensaje, duracion = 5000 }) => {
      contador.current += 1;
      const id = contador.current;
      setToasts((prev) => [...prev, { id, tipo, titulo, mensaje }]);
      if (duracion) setTimeout(() => cerrar(id), duracion);
    },
    [cerrar]
  );

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tipo}`} role={t.tipo === 'error' ? 'alert' : 'status'}>
            <span className="alert__icon" aria-hidden="true">{ICONOS[t.tipo]}</span>
            <div>
              <p className="toast__title">{t.titulo}</p>
              {t.mensaje && <p className="toast__msg">{t.mensaje}</p>}
            </div>
            <button className="toast__close" onClick={() => cerrar(t.id)} aria-label="Cerrar notificación">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

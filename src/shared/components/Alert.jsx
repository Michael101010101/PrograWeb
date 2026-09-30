const ICONOS = { error: '!', warning: '!', success: '✓', info: 'i' };

export default function Alert({ tipo = 'error', children, titulo }) {
  return (
    <div className={`alert alert--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <span className="alert__icon" aria-hidden="true">{ICONOS[tipo]}</span>
      <div>
        {titulo && <strong>{titulo} </strong>}
        {children}
      </div>
    </div>
  );
}

import { useId, useState } from 'react';

/** Campo con etiqueta, ayuda y error junto al control. */
export function Field({ label, error, hint, children, className = '', htmlFor }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <span className="field__error" role="alert">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}

export function TextField({ label, error, hint, className, id, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} error={error} hint={hint} className={className} htmlFor={inputId}>
      <input id={inputId} className={`input ${error ? 'input--error' : ''}`} aria-invalid={Boolean(error)} {...props} />
    </Field>
  );
}

export function PasswordField({ label, error, hint, className, id, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} error={error} hint={hint} className={className} htmlFor={inputId}>
      <div className="field__control">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={`input input--with-action ${error ? 'input--error' : ''}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button type="button" className="field__action" onClick={() => setVisible((v) => !v)}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </Field>
  );
}

export function SelectField({ label, error, hint, className, id, opciones = [], placeholder, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} error={error} hint={hint} className={className} htmlFor={inputId}>
      <select id={inputId} className={`select ${error ? 'input--error' : ''}`} aria-invalid={Boolean(error)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </Field>
  );
}

const PASOS = ['Paso 1 · Correo', 'Paso 2 · Envío del enlace', 'Paso 3 · Nueva contraseña'];

export default function Stepper({ paso, compacto = false }) {
  return (
    <ol className={`stepper ${compacto ? 'stepper--compacto' : ''}`} aria-label={`Paso ${paso} de ${PASOS.length}`} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {PASOS.map((texto, i) => (
        <li key={texto} className={`stepper__step ${i < paso ? 'is-done' : ''}`} aria-current={i + 1 === paso ? 'step' : undefined}>
          {texto}
        </li>
      ))}
    </ol>
  );
}

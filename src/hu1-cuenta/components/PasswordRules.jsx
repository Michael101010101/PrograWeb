import { reglasPassword } from '../utils/validators.js';

/** Lista de requisitos de la contraseña que se marca mientras el usuario escribe. */
export default function PasswordRules({ valor }) {
  const r = reglasPassword(valor);
  const items = [
    ['largo', 'Al menos 8 caracteres'],
    ['mayuscula', 'Incluye una mayúscula'],
    ['numero', 'Incluye un número'],
  ];
  return (
    <ul className="password-rules" aria-label="Requisitos de la contraseña">
      {items.map(([clave, texto]) => (
        <li key={clave} className={r[clave] ? 'ok' : ''}>
          {r[clave] ? '✓' : '○'} {texto}
        </li>
      ))}
    </ul>
  );
}

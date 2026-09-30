import { ROL_INFO } from '../config/roles.js';

export default function RoleBadge({ rol = 'publico' }) {
  return <span className={`badge badge--${rol}`}>{ROL_INFO[rol]?.chip ?? rol}</span>;
}

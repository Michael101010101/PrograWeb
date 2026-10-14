const etiquetas = { en_revision: 'En revisión', aprobado: 'Aprobado', observado: 'Observado', pendiente: 'Pendiente', vencido: 'Vencido sin presentar', en_desarrollo: 'En desarrollo', concluido: 'Concluido' };
export default function Estado({ estado }) {
  return <span className={`h5-estado h5-estado--${estado}`}>{etiquetas[estado] ?? estado}</span>;
}

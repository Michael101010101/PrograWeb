/** Estado vacío o de resultado: icono, título, texto y acciones. */
export default function EmptyState({ icono = '✓', tono, titulo, texto, children, className = '' }) {
  return (
    <div className={`empty-state ${className}`}>
      <div className={`empty-state__icon ${tono ? `empty-state__icon--${tono}` : ''}`} aria-hidden="true">{icono}</div>
      <h2>{titulo}</h2>
      {texto && <p className="empty-state__text">{texto}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}

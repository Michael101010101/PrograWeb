import Alert from '../../shared/components/Alert.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';

/**
 * Muestra el estado de una vista que depende del API:
 * cargando → indicador · error → mensaje y "Reintentar" · vacio → estado vacío · si no, el contenido.
 */
export default function EstadoVista({
  cargando,
  error,
  alReintentar,
  vacio = false,
  tituloVacio = 'Sin datos',
  textoVacio,
  children,
}) {
  if (cargando) {
    return (
      <p className="descripcion" aria-busy="true" role="status">
        Cargando…
      </p>
    );
  }

  if (error) {
    return (
      <Alert tipo="error" titulo="No pudimos cargar los datos.">
        {error.message || 'Ocurrió un error.'}{' '}
        {alReintentar && (
          <button type="button" className="hu7-boton-texto" onClick={alReintentar}>
            Reintentar
          </button>
        )}
      </Alert>
    );
  }

  if (vacio) return <EmptyState icono="i" titulo={tituloVacio} texto={textoVacio} />;

  return children;
}

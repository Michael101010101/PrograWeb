/**
 * Grupo de botones donde solo uno queda elegido (Modalidad, Resultado).
 * Es un componente controlado: el valor vive en el padre y se cambia con onCambiar.
 */
export default function Segmentado({ opciones, valor, onCambiar, etiqueta, deshabilitado = false }) {
  return (
    <div className="hu6-segmentado" role="group" aria-label={etiqueta}>
      {opciones.map((opcion) => (
        <button
          key={opcion}
          type="button"
          className={`hu6-segmento ${opcion === valor ? 'hu6-segmento--activo' : ''}`}
          aria-pressed={opcion === valor}
          disabled={deshabilitado}
          onClick={() => onCambiar(opcion)}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}

import { DEPARTAMENTOS, LINEAS } from '../data/datosSemilla.js';

/**
 * Caja de filtros del directorio (3.2). Es un componente "controlado":
 * los valores vienen del padre en `filtros` y cada cambio se avisa con onCambiar(campo, valor).
 */
export default function FiltrosDirectorio({ filtros, onCambiar }) {
  return (
    <div className="card hu3-filtros">
      <div className="field">
        <label className="field__label" htmlFor="hu3-buscar">Buscar</label>
        <input
          id="hu3-buscar"
          className="input"
          type="search"
          placeholder="Nombre del asesor..."
          value={filtros.texto}
          onChange={(e) => onCambiar('texto', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="hu3-linea">Línea de investigación</label>
        <select id="hu3-linea" className="select" value={filtros.linea} onChange={(e) => onCambiar('linea', e.target.value)}>
          <option value="">Todas</option>
          {LINEAS.map((linea) => <option key={linea} value={linea}>{linea}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="hu3-depto">Departamento</label>
        <select id="hu3-depto" className="select" value={filtros.departamento} onChange={(e) => onCambiar('departamento', e.target.value)}>
          <option value="">Todos</option>
          {DEPARTAMENTOS.map((depto) => <option key={depto} value={depto}>{depto}</option>)}
        </select>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={filtros.soloConCupo}
          onChange={(e) => onCambiar('soloConCupo', e.target.checked)}
        />
        Solo con cupo
      </label>
    </div>
  );
}

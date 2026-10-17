import Alert from '../../shared/components/Alert.jsx';
import BarraPesos from './BarraPesos.jsx';
import { PESO_MAX, PESO_MIN } from '../services/entregablesService.js';
import { SEMESTRE } from '../utils/fechas.js';

/**
 * Formulario "Nuevo entregable" / "Editar entregable" de la pantalla 4.2.
 * Es un componente controlado: los valores viven en la página (`valores`) y cada cambio
 * se avisa con `onCambiar(campo, valor)`. Así la página puede recalcular la suma en vivo.
 */
export default function FormularioEntregable({ valores, editando, error, suma, pesos, onCambiar, onGuardar, onCancelar }) {
  const cambiar = (campo) => (evento) =>
    onCambiar(campo, evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value);

  const enviar = (evento) => {
    evento.preventDefault();
    onGuardar();
  };

  return (
    <form className="card hu4-form" onSubmit={enviar} noValidate>
      <h2>{editando ? `Editar entregable ${editando.orden}` : 'Nuevo entregable'}</h2>

      {error && <Alert tipo="error">{error}</Alert>}

      <div className="field">
        <label className="field__label" htmlFor="ent-nombre">Nombre</label>
        <input id="ent-nombre" className="input" maxLength={80} value={valores.nombre} onChange={cambiar('nombre')} />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="ent-descripcion">Descripción</label>
        <textarea id="ent-descripcion" className="textarea" maxLength={400} value={valores.descripcion} onChange={cambiar('descripcion')} />
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field__label" htmlFor="ent-fecha">Fecha límite</label>
          <input
            id="ent-fecha"
            className="input"
            type="date"
            min={SEMESTRE.inicio}
            max={SEMESTRE.fin}
            value={valores.fechaLimite}
            onChange={cambiar('fechaLimite')}
          />
          <span className="field__hint">Debe caer dentro del semestre {SEMESTRE.nombre}</span>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="ent-peso">Peso</label>
          <input
            id="ent-peso"
            className="input"
            type="number"
            min={PESO_MIN}
            max={PESO_MAX}
            value={valores.peso}
            onChange={cambiar('peso')}
          />
          <span className="field__hint">Entre {PESO_MIN} y {PESO_MAX}</span>
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" checked={valores.obligatorio} onChange={cambiar('obligatorio')} />
        Es obligatorio para calcular el avance
      </label>

      <BarraPesos suma={suma} pesos={pesos} />

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn--primary btn--lg">Guardar entregable</button>
      </div>
    </form>
  );
}

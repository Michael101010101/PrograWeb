import Hu2Modal from './Hu2Modal.jsx';
import './estadosTrabajo.css';

const CAMPOS = [
  ['titulo', 'TÍTULO DEL TRABAJO'],
  ['linea', 'LÍNEA DE INVESTIGACIÓN'],
  ['resumen', 'RESUMEN'],
  ['objetivos', 'OBJETIVOS'],
  ['palabrasClave', 'PALABRAS CLAVE'],
];

export default function ErrorRegistroModal({ abierto, errores = {}, valores = {}, onCerrar, titulo = 'No pudimos registrar el trabajo' }) {
  const conError = CAMPOS.filter(([campo]) => errores[campo]);
  const n = conError.length;

  return (
    <Hu2Modal abierto={abierto} onCerrar={onCerrar} titulo={titulo} className="hu2-modal-registro">
      <div className="hu2-alerta hu2-alerta-error" role="alert">
        Revisa {n} campo{n === 1 ? '' : 's'} antes de continuar.
      </div>

      {conError.map(([campo, etiqueta]) => (
        <div className="hu2-campo-error" key={campo}>
          <label>{etiqueta}</label>
          {campo === 'linea' && (
            <select value="" disabled>
              <option value="">Selecciona una línea</option>
            </select>
          )}
          {(campo === 'resumen' || campo === 'objetivos') && <textarea value={valores[campo] ?? ''} readOnly />}
          {campo === 'titulo' && <input type="text" value={valores.titulo ?? ''} readOnly />}
          {campo === 'palabrasClave' && (
            <input type="text" value={(valores.palabrasClave ?? []).join(', ') || 'Sin palabras clave'} readOnly />
          )}
          <small>{errores[campo]}</small>
        </div>
      ))}

      <div className="hu2-acciones-derecha">
        <button type="button" className="hu2-btn-principal" onClick={onCerrar}>
          Corregir campos
        </button>
      </div>
    </Hu2Modal>
  );
}
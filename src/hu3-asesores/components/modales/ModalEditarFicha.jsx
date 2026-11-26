import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { useDatos } from '../../../shared/context/DatosContext.jsx';

const MAX_EXPERIENCIA = 800;
const MAX_LINEAS = 3;

/** 3.1 Editar ficha · rol Asesor (diapositiva 26). */
export default function ModalEditarFicha({ asesor, onGuardar, onCerrar }) {
  // Grados, departamentos y líneas vienen de la API (GET /api/catalogos)
  const { catalogos } = useDatos();
  const LINEAS = catalogos.lineas ?? [];

  // Copia local de los campos: solo se guardan al pulsar "Guardar ficha".
  const [ficha, setFicha] = useState({
    gradoAcademico: asesor.gradoAcademico,
    departamento: asesor.departamento,
    lineas: asesor.lineas,
    experiencia: asesor.experiencia ?? '',
    cupoMaximo: asesor.cupoMaximo,
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo, valor) => {
    setFicha({ ...ficha, [campo]: valor });
    setError('');
  };

  const agregarLinea = (linea) => {
    if (linea && ficha.lineas.length < MAX_LINEAS) cambiar('lineas', [...ficha.lineas, linea]);
  };
  const quitarLinea = (linea) => cambiar('lineas', ficha.lineas.filter((l) => l !== linea));

  // Las validaciones las hace el servidor (PUT /api/asesores/me); si algo no es válido, devuelve 400 con el mensaje
  const guardar = async () => {
    setGuardando(true);
    try {
      await onGuardar(ficha);
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  };

  const disponibles = LINEAS.filter((l) => !ficha.lineas.includes(l));

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Editar mi ficha"
      ancho="wide"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn--primary" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar ficha'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="field">
          <label className="field__label" htmlFor="hu3-grado">Grado académico</label>
          <select id="hu3-grado" className="select" value={ficha.gradoAcademico} onChange={(e) => cambiar('gradoAcademico', e.target.value)}>
            {catalogos.gradosAcademicos.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="hu3-depto-ficha">Departamento</label>
          <select id="hu3-depto-ficha" className="select" value={ficha.departamento} onChange={(e) => cambiar('departamento', e.target.value)}>
            {catalogos.departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <span className="field__label">Líneas de investigación</span>
        <div className="hu3-lineas-input">
          {ficha.lineas.map((linea) => (
            <span key={linea} className="hu3-chip">
              {linea}
              <button type="button" className="hu3-chip__quitar" aria-label={`Quitar ${linea}`} onClick={() => quitarLinea(linea)}>×</button>
            </span>
          ))}
          {ficha.lineas.length < MAX_LINEAS && (
            <select aria-label="Agregar línea" value="" onChange={(e) => agregarLinea(e.target.value)}>
              <option value="">Agregar línea...</option>
              {disponibles.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          )}
        </div>
        <span className="field__hint">Hasta 3 líneas · solo recibirás solicitudes de estas líneas</span>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="hu3-experiencia">Experiencia</label>
        <textarea
          id="hu3-experiencia"
          className="textarea"
          rows={4}
          maxLength={MAX_EXPERIENCIA}
          value={ficha.experiencia}
          onChange={(e) => cambiar('experiencia', e.target.value)}
        />
        <span className="field__hint">{ficha.experiencia.length} / {MAX_EXPERIENCIA}</span>
      </div>

      <div className="field" style={{ maxWidth: 220 }}>
        <label className="field__label" htmlFor="hu3-cupo">Cupo máximo</label>
        <input
          id="hu3-cupo"
          className="input"
          type="number"
          min={asesor.cupoOcupado}
          value={ficha.cupoMaximo}
          onChange={(e) => cambiar('cupoMaximo', e.target.value)}
        />
        <span className="field__hint">No puede ser menor a los {asesor.cupoOcupado} trabajos a cargo</span>
      </div>

      {error && <Alert tipo="error">{error}</Alert>}
    </Modal>
  );
}

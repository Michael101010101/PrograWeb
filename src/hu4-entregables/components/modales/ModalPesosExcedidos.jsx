import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import BarraPesos from '../BarraPesos.jsx';

/**
 * Modal 4.2 "No se puede guardar el entregable" (los pesos pasan de 100).
 * Muestra los pesos actuales con el entregable en edición resaltado y deja corregir el peso aquí mismo:
 * "Guardar entregable" solo se habilita cuando la suma vuelve a ser 100 o menos.
 *  - `filas`: [{ id, orden, nombre, peso }] del plan, ya con el peso que se intentó guardar
 *  - `resaltadoId`: id de la fila que se está editando o creando
 *  - `sumaSinEste`: suma del resto del plan (sin el entregable en edición)
 */
export default function ModalPesosExcedidos({ filas, resaltadoId, pesoInicial, sumaSinEste, onGuardar, onCerrar }) {
  const [peso, setPeso] = useState(String(pesoInicial));
  const suma = sumaSinEste + (Number(peso) || 0);
  const excede = suma > 100;

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="No se puede guardar el entregable"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn--primary" disabled={excede} onClick={() => onGuardar(Number(peso))}>
            Guardar entregable
          </button>
        </>
      }
    >
      <div className="field">
        <label className="field__label" htmlFor="peso-corregido">Peso</label>
        <input
          id="peso-corregido"
          className={`input ${excede ? 'input--error' : ''}`}
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
        {excede && <span className="field__error">Con este peso el plan suma {suma}</span>}
      </div>

      <BarraPesos suma={suma} pesos={[]} />

      <div className="hu4-pesos-actuales">
        <p className="text-label">Pesos actuales</p>
        <ul>
          {filas.map((f) => (
            <li key={f.id} className={f.id === resaltadoId ? 'is-resaltado' : ''}>
              <span>{f.orden}. {f.nombre}</span>
              <span>{f.id === resaltadoId ? Number(peso) || 0 : f.peso}</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

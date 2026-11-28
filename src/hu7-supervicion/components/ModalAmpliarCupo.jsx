import { useState } from 'react';
import Modal from '../../shared/components/Modal.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { Field, TextField } from '../../shared/components/FormField.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { ampliarCupo } from '../api/clienteApiHu7.js';
import { nombreConGrado } from '../utils/cargaAsesores.js';

// Mismos límites que valida el servidor (adminAsesores.service.js).
const CUPO_MAX = 10;
const MOTIVO = { min: 10, max: 300 };

/** Amplía el cupo máximo del asesor en el periodo activo. El modal sirve de confirmación. */
export default function ModalAmpliarCupo({ asesor, semestre, alCerrar, alAmpliar }) {
  const { mostrar } = useToast();
  const actual = asesor?.cupoMaximo ?? null;
  const [cupo, setCupo] = useState(actual === null ? '' : String(Math.min(actual + 1, CUPO_MAX)));
  const [motivo, setMotivo] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [guardando, setGuardando] = useState(false);

  if (!asesor) return null;
  const nombre = nombreConGrado(asesor);
  const numero = /^\d+$/.test(cupo) ? Number(cupo) : null;

  const handleConfirmar = async (e) => {
    e.preventDefault();
    const campos = {};
    if (numero === null || numero < 1 || numero > CUPO_MAX) campos.cupoMaximo = `Ingresa un número entero de 1 a ${CUPO_MAX}.`;
    else if (actual !== null && numero <= actual) campos.cupoMaximo = `Debe ser mayor a ${actual}.`;
    const texto = motivo.trim();
    if (!texto) campos.motivo = 'Indica el motivo de la ampliación.';
    else if (texto.length < MOTIVO.min) campos.motivo = `Escribe al menos ${MOTIVO.min} caracteres (llevas ${texto.length}).`;
    else if (texto.length > MOTIVO.max) campos.motivo = `Admite hasta ${MOTIVO.max} caracteres (llevas ${texto.length}).`;
    setErrores(campos);
    setErrorGeneral(null);
    if (Object.keys(campos).length) return;

    setGuardando(true);
    try {
      const respuesta = await ampliarCupo(asesor.id, { cupoMaximo: numero, motivo: texto });
      mostrar({
        tipo: 'exito',
        titulo: 'Cupo ampliado',
        mensaje: `${nombre}: de ${respuesta.cupo.cupoAnterior} a ${respuesta.cupo.cupoMaximo} cupos.`,
      });
      alAmpliar(respuesta.asesor);
    } catch (error) {
      if (error.campos && Object.keys(error.campos).length) setErrores(error.campos);
      else setErrorGeneral(error.message || 'No se pudo ampliar el cupo.');
      mostrar({ tipo: 'error', titulo: 'No se amplió el cupo', mensaje: error.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={guardando ? undefined : alCerrar}
      titulo="Ampliar cupo máximo"
      acciones={
        <>
          <button type="button" className="btn btn--ghost" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" form="form-ampliar-cupo" className="btn btn--primary" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Confirmar ampliación'}
          </button>
        </>
      }>
      <form id="form-ampliar-cupo" onSubmit={handleConfirmar} noValidate>
        {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}
        <p>
          <strong>{nombre}</strong> · {asesor.trabajosACargo} trabajos a cargo · cupo actual{' '}
          <strong>{actual ?? '—'}</strong>
        </p>
        <TextField
          label="Nuevo cupo máximo"
          type="number"
          inputMode="numeric"
          min={actual === null ? 1 : actual + 1}
          max={CUPO_MAX}
          value={cupo}
          error={errores.cupoMaximo}
          hint={`Entero mayor al actual, hasta ${CUPO_MAX}.`}
          onChange={(e) => setCupo(e.target.value)} />
        <Field label="Motivo" htmlFor="motivo-cupo" error={errores.motivo} hint={`Mínimo ${MOTIVO.min} caracteres · ${motivo.trim().length} / ${MOTIVO.max}`}>
          <textarea
            id="motivo-cupo"
            className={`input textarea ${errores.motivo ? 'input--error' : ''}`}
            rows={3}
            maxLength={MOTIVO.max}
            aria-invalid={Boolean(errores.motivo)}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)} />
        </Field>
        {numero !== null && actual !== null && numero > actual && (
          <Alert tipo="warning">
            El límite cambiará de <strong>{actual}</strong> a <strong>{numero}</strong> cupos
            {semestre ? ` en el periodo ${semestre}` : ''}.
          </Alert>
        )}
      </form>
    </Modal>
  );
}

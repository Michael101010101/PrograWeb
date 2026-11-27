import { useState } from 'react';
import Modal from '../../shared/components/Modal.jsx';
import Alert from '../../shared/components/Alert.jsx';
import { Field, TextField } from '../../shared/components/FormField.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { escribirAsesor } from '../api/clienteApiHu7.js';
import { nombreConGrado } from '../utils/cargaAsesores.js';

// Mismos límites que valida el servidor (adminAsesores.service.js).
const ASUNTO = { min: 3, max: 120 };
const CONTENIDO = { min: 10, max: 1000 };

function validarTexto(valor, { min, max }, vacio) {
  const texto = valor.trim();
  if (!texto) return vacio;
  if (texto.length < min) return `Escribe al menos ${min} caracteres (llevas ${texto.length}).`;
  if (texto.length > max) return `Admite hasta ${max} caracteres (llevas ${texto.length}).`;
  return null;
}

/** Formulario para dejar un mensaje al asesor. Solo se guarda; no se envía correo. */
export default function ModalEscribirAsesor({ asesor, alCerrar }) {
  const { mostrar } = useToast();
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (!asesor) return null;
  const nombre = nombreConGrado(asesor);

  const handleEnviar = async (e) => {
    e.preventDefault();
    const campos = {};
    const eAsunto = validarTexto(asunto, ASUNTO, 'Indica el asunto.');
    if (eAsunto) campos.asunto = eAsunto;
    const eContenido = validarTexto(contenido, CONTENIDO, 'Escribe el mensaje.');
    if (eContenido) campos.contenido = eContenido;
    setErrores(campos);
    setErrorGeneral(null);
    if (Object.keys(campos).length) return;

    setEnviando(true);
    try {
      await escribirAsesor(asesor.id, { asunto: asunto.trim(), contenido: contenido.trim() });
      mostrar({ tipo: 'exito', titulo: 'Mensaje guardado', mensaje: `Quedó registrado para ${nombre}.` });
      alCerrar();
    } catch (error) {
      if (error.status === 400 && error.campos && Object.keys(error.campos).length) setErrores(error.campos);
      else setErrorGeneral(error.message || 'No se pudo guardar el mensaje.');
      mostrar({ tipo: 'error', titulo: 'No se guardó el mensaje', mensaje: error.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto
      onCerrar={enviando ? undefined : alCerrar}
      titulo={`Escribir a ${nombre}`}
      acciones={
        <>
          <button type="button" className="btn btn--ghost" onClick={alCerrar} disabled={enviando}>
            Cancelar
          </button>
          <button type="submit" form="form-escribir-asesor" className="btn btn--primary" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar mensaje'}
          </button>
        </>
      }>
      <form id="form-escribir-asesor" onSubmit={handleEnviar} noValidate>
        {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}
        <TextField
          label="Asunto"
          value={asunto}
          maxLength={ASUNTO.max}
          error={errores.asunto}
          hint={`${asunto.trim().length} / ${ASUNTO.max}`}
          onChange={(e) => setAsunto(e.target.value)} />
        <Field label="Mensaje" htmlFor="mensaje-asesor" error={errores.contenido} hint={`Mínimo ${CONTENIDO.min} caracteres · ${contenido.trim().length} / ${CONTENIDO.max}`}>
          <textarea
            id="mensaje-asesor"
            className={`input textarea ${errores.contenido ? 'input--error' : ''}`}
            rows={5}
            maxLength={CONTENIDO.max}
            aria-invalid={Boolean(errores.contenido)}
            placeholder="Indicación sobre la carga de trabajos o derivación de solicitudes…"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)} />
        </Field>
        <p className="field__hint">El mensaje queda registrado en el sistema; no se envía por correo.</p>
      </form>
    </Modal>
  );
}

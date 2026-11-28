import { useState } from 'react';
import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';
import { diasEntre, formatearFecha, hoy } from '../../utils/fechas.js';

/** 3.3 Ya tienes una solicitud activa · rol Estudiante (diapositiva 27). */
export default function ModalSolicitudActiva({ solicitud, asesor, onRetirar, onCerrar }) {
  const [retirando, setRetirando] = useState(false);
  const articulo = asesor.titulo === 'Dra.' ? 'a la' : 'al';
  const fecha = formatearFecha(solicitud.fecha);

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Ya tienes una solicitud activa"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Cerrar</button>
          <button
            className="btn btn--danger-outline"
            disabled={retirando}
            onClick={async () => {
              setRetirando(true);
              await onRetirar();
              setRetirando(false);
            }}
          >
            {retirando ? 'Retirando…' : 'Retirar solicitud'}
          </button>
        </>
      }
    >
      <Alert tipo="warning">
        Enviaste una solicitud {articulo} {asesor.nombre} el {fecha} y aún está pendiente. Debes retirarla
        antes de solicitar a otro asesor.
      </Alert>

      <div className="hu3-fila-asesor" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <strong style={{ fontWeight: 500 }}>{asesor.nombre}</strong>
          <span className="badge badge--warning">Pendiente</span>
        </div>
        <span className="text-muted text-aux">
          Enviada el {fecha} · {diasEntre(solicitud.fecha, hoy())} días en espera
        </span>
      </div>
    </Modal>
  );
}

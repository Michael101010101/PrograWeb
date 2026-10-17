import Modal from '../../../shared/components/Modal.jsx';
import Alert from '../../../shared/components/Alert.jsx';

/** 6.3 Confirmar registro de acta · rol Administrador (diapositiva 47). */
export default function ModalRegistrarActa({ resultado, nota, onConfirmar, onCerrar }) {
  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Registrar el acta"
      acciones={
        <>
          <button className="btn btn--ghost" onClick={onCerrar}>Revisar de nuevo</button>
          <button className="btn btn--primary" onClick={onConfirmar}>Registrar acta</button>
        </>
      }
    >
      <div className="hu6-caja-gris hu6-resultado">
        <div>
          <p className="text-label">Resultado</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>{resultado}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="text-label">Nota final</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: resultado === 'Desaprobado' ? 'var(--danger)' : 'var(--success)' }}>{nota}</p>
        </div>
      </div>
      <Alert tipo="warning">
        El acta queda definitiva: se notifica al equipo, al asesor y a la Secretaría Académica. Solo Secretaría puede
        rectificarla después.
      </Alert>
    </Modal>
  );
}

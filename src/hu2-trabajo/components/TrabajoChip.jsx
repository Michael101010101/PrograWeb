import useTrabajoVigente from '../hooks/useTrabajoVigente.js';
import './estadosTrabajo.css';

export default function TrabajoChip() {
  const trabajo = useTrabajoVigente();

  if (trabajo === undefined) {
    return <span className="hu2-chip-trabajo hu2-chip-trabajo--vacio" aria-busy="true">Cargando…</span>;
  }

  if (!trabajo) {
    return <span className="hu2-chip-trabajo hu2-chip-trabajo--vacio">Sin trabajo registrado</span>;
  }

  return (
    <span className="hu2-chip-trabajo" title={`${trabajo.codigo} · ${trabajo.titulo}`}>
      <span className="hu2-chip-trabajo__titulo">{trabajo.titulo}</span>
      {trabajo.sinAsesor ? (
        <span className="hu2-chip-trabajo__sin-asesor">Sin asesor</span>
      ) : (
        <>
          <span className="hu2-mini-barra" aria-hidden="true">
            <span className="hu2-mini-barra-relleno" style={{ display: 'block', width: `${trabajo.avance}%` }}></span>
          </span>
          <strong>{trabajo.avance}%</strong>
        </>
      )}
    </span>
  );
}
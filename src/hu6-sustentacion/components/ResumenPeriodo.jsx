import { Link } from 'react-router-dom';

/** Tarjeta "Sustentaciones del periodo" (programadas, realizadas, por programar). */
export default function ResumenPeriodo({ resumen }) {
  return (
    <section className="card">
      <p className="text-label">Sustentaciones del periodo</p>
      <ul className="hu6-lista-datos">
        <li><span>Programadas</span><strong>{resumen.programadas}</strong></li>
        <li><span>Realizadas</span><strong>{resumen.realizadas}</strong></li>
        <li><span>Concluidos por programar</span><strong>{resumen.porProgramar}</strong></li>
      </ul>
      <div className="hu6-pie-enlace">
        <Link to="/admin/sustentaciones">Ver calendario completo</Link>
      </div>
    </section>
  );
}

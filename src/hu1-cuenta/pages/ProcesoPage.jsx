import { Link } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import PageHead from '../../shared/components/PageHead.jsx';
import { PERIODO } from '../../shared/config/periodo.js';

const ETAPAS = [
  {
    titulo: 'Registro del trabajo y del equipo',
    quien: 'Estudiante',
    texto: 'Registra tu trabajo con título, línea de investigación, resumen, objetivos y palabras clave. Puedes sumar hasta dos compañeros que no tengan otro trabajo vigente.',
  },
  {
    titulo: 'Solicitud y asignación de asesor',
    quien: 'Estudiante y asesor',
    texto: 'Elige un asesor con cupo en tu línea y envíale una solicitud con un mensaje de sustento. Solo puedes tener una solicitud activa; el asesor la acepta o la rechaza con un motivo.',
  },
  {
    titulo: 'Plan de entregables',
    quien: 'Asesor',
    texto: 'Tu asesor define los entregables con fecha límite y peso. Los pesos suman 100 y el avance del trabajo se calcula con los entregables aprobados.',
  },
  {
    titulo: 'Revisión de avances',
    quien: 'Estudiante y asesor',
    texto: 'Registras cada avance con el enlace al documento. El asesor lo aprueba u observa; si lo observa, subes una nueva versión. Recibes alertas de vencimientos.',
  },
  {
    titulo: 'Sustentación y acta',
    quien: 'Coordinación',
    texto: 'Con el trabajo concluido, la coordinación programa la sustentación, conforma el jurado y registra el acta con la calificación por criterios.',
  },
];

export default function ProcesoPage() {
  return (
    <PageLayout navInfo={`Semestre ${PERIODO.semestre} · etapa 3 de 5 en curso`}>
      <PageHead
        migas="Inicio · El proceso"
        titulo="El proceso en 5 etapas"
        descripcion="Del registro de la propuesta hasta la sustentación. Cada etapa tiene fechas definidas en el cronograma del semestre."
        acciones={<Link to="/cronograma" className="btn btn--outline">Ver cronograma</Link>}
      />

      <ol className="stack" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 16 }}>
        {ETAPAS.map((e, i) => {
          const crono = PERIODO.cronograma[i];
          return (
            <li key={e.titulo} className="card" style={{ marginTop: 0, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <span className="avatar avatar--soft" aria-hidden="true">{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <h2>{e.titulo}</h2>
                  {crono.estado === 'en_curso' && <span className="badge badge--warning">En curso</span>}
                  {crono.estado === 'cerrada' && <span className="badge badge--success">Cerrada</span>}
                </div>
                <p className="text-muted text-aux" style={{ marginBottom: 8 }}>{e.quien} · {crono.rango}</p>
                <p>{e.texto}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="card card--soft" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <p>¿Listo para empezar? Crea tu cuenta con tu correo institucional.</p>
        <Link to="/registro/estudiante" className="btn btn--primary">Registrar mi trabajo</Link>
      </div>
    </PageLayout>
  );
}
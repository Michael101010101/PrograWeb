import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useAsesorias from '../hooks/useAsesorias.js';
import {
  asesorDeUsuario,
  cupoDisponible,
  inicialesAsesor,
  nombreAsesor,
  trabajosDeAsesor,
} from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import ModalEditarFicha from '../components/modales/ModalEditarFicha.jsx';

/** 3.1 Mi ficha de asesor · lectura (diapositiva 22) + Editar ficha (diapositiva 26). */
export default function MiFichaPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const { datos, guardarFicha } = useAsesorias();
  const [editando, setEditando] = useState(false);

  const asesor = asesorDeUsuario(datos, usuario.id);
  if (!asesor) return <PaginaAsesor datos={datos} asesor={null} />;

  const disponible = cupoDisponible(asesor);
  const porcentaje = Math.round((asesor.cupoOcupado / asesor.cupoMaximo) * 100);
  const trabajos = trabajosDeAsesor(datos, asesor.id);
  const pendientes = datos.solicitudes.filter((s) => s.asesorId === asesor.id && s.estado === 'pendiente').length;
  const porRevisar = trabajos.reduce((suma, t) => suma + t.porRevisar, 0);
  const planesSinDefinir = trabajos.filter((t) => t.nota?.texto === 'Plan de entregables por definir').length;

  const cifras = [
    ['Trabajos asesorados', asesor.trabajosAsesorados],
    ['Concluidos', asesor.concluidos ?? '—'],
    ['Tiempo de revisión', asesor.tiempoRevision ?? '—'],
    ['Sustentaciones como jurado', asesor.sustentacionesJurado ?? '—'],
  ];

  const guardar = (ficha) => {
    guardarFicha(asesor.id, ficha); // lanza Error si algún dato no es válido
    setEditando(false);
    mostrar({ tipo: 'exito', titulo: 'Ficha actualizada', mensaje: 'Los estudiantes ya ven tus cambios en el directorio.' });
  };

  return (
    <PaginaAsesor datos={datos} asesor={asesor} footerDetalle={`cupo ${disponible} de ${asesor.cupoMaximo} disponible`}>
      <PageHead
        migas="Inicio · Mi ficha de asesor"
        titulo="Mi ficha de asesor"
        descripcion="Así te ven los estudiantes en el directorio público."
        acciones={<button className="btn btn--outline btn--lg" onClick={() => setEditando(true)}>Editar ficha</button>}
      />

      <div className="hu3-ficha">
        <div className="hu3-ficha__principal">
          <section className="card hu3-ficha__perfil">
            <span className="avatar avatar--soft hu3-ficha__avatar" aria-hidden="true">{inicialesAsesor(asesor)}</span>
            <div>
              <h2>{nombreAsesor(asesor)}</h2>
              <p className="hu3-ficha__meta">
                {asesor.gradoAcademico} · Departamento de {asesor.departamento} · {asesor.correo}
              </p>
              <div className="hu3-chips">
                {asesor.lineas.map((linea) => <span key={linea} className="hu3-chip">{linea}</span>)}
              </div>
            </div>
          </section>

          <section className="card">
            <h2 style={{ marginBottom: 12 }}>Experiencia</h2>
            <p>{asesor.experiencia || 'Aún no registras tu experiencia. Usa «Editar ficha» para agregarla.'}</p>
            <div className="hu3-cifras">
              {cifras.map(([etiqueta, valor]) => (
                <div key={etiqueta}>
                  <p className="text-label">{etiqueta}</p>
                  <p className="hu3-cifra__valor">{valor}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="hu3-ficha__lateral">
          <section className="card">
            <p className="text-label">Cupo de asesoría</p>
            <p className="hu3-cupo-grande"><strong>{disponible}</strong> disponibles de {asesor.cupoMaximo}</p>
            <div className="hu3-barra-cupo"><div style={{ width: `${porcentaje}%` }} /></div>
            <p className="text-muted text-aux">{asesor.cupoOcupado} trabajos a cargo · {porcentaje}% del cupo ocupado</p>
          </section>

          <section className="card">
            <p className="text-label">Pendientes de tu rol</p>
            <ul className="hu3-pendientes">
              <li><span>Solicitudes recibidas</span><strong>{pendientes}</strong></li>
              <li><span>Avances por revisar</span><strong>{porRevisar}</strong></li>
              <li><span>Planes sin definir</span><strong>{planesSinDefinir}</strong></li>
            </ul>
            <button className="btn btn--outline btn--block" onClick={() => navigate('/asesor/revision')}>
              Ir a la bandeja de revisión
            </button>
          </section>

          <section className="card card--subtle">
            <p className="text-label">Visibilidad</p>
            <p className="text-muted text-aux" style={{ marginTop: 6 }}>
              Solo recibes solicitudes de las líneas declaradas en tu ficha. Si tu cupo llega a 0, dejas de aparecer
              en el filtro «Solo con cupo».
            </p>
          </section>
        </aside>
      </div>

      {editando && <ModalEditarFicha asesor={asesor} onGuardar={guardar} onCerrar={() => setEditando(false)} />}
    </PaginaAsesor>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useMiFicha } from '../hooks/useAsesorias.js';
import * as servicio from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import ModalEditarFicha from '../components/modales/ModalEditarFicha.jsx';

/**
 * 3.1 Mi ficha de asesor · lectura (diapositiva 22) + Editar ficha (diapositiva 26).
 * Datos: GET /api/asesores/me · Guardar: PUT /api/asesores/me
 */
export default function MiFichaPage() {
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const ficha = useMiFicha();
  const [editando, setEditando] = useState(false);

  const asesor = ficha.datos?.asesor;
  const resumen = ficha.datos?.resumen;

  // Si el servidor rechaza algún dato (400), el error llega al modal y lo muestra sin cerrarse
  const guardar = async (cambios) => {
    await servicio.guardarFicha(cambios);
    setEditando(false);
    mostrar({ tipo: 'exito', titulo: 'Ficha actualizada', mensaje: 'Los estudiantes ya ven tus cambios en el directorio.' });
    ficha.recargar();
  };

  // Mientras carga o si hubo un error, PaginaAsesor muestra el aviso correspondiente
  if (!asesor) {
    return <PaginaAsesor ficha={null} cargando={ficha.cargando} error={ficha.error} onReintentar={ficha.recargar} />;
  }

  const disponible = asesor.cupoDisponible;
  const porcentaje = Math.round((asesor.cupoOcupado / asesor.cupoMaximo) * 100);

  const cifras = [
    ['Trabajos asesorados', asesor.trabajosAsesorados],
    ['Concluidos', asesor.concluidos ?? '—'],
    ['Tiempo de revisión', asesor.tiempoRevision ?? '—'],
    ['Sustentaciones como jurado', asesor.sustentacionesJurado ?? '—'],
  ];

  return (
    <PaginaAsesor
      ficha={ficha.datos}
      cargando={ficha.cargando}
      error={ficha.error}
      footerDetalle={`cupo ${disponible} de ${asesor.cupoMaximo} disponible`}
    >
      <PageHead
        migas="Inicio · Mi ficha de asesor"
        titulo="Mi ficha de asesor"
        descripcion="Así te ven los estudiantes en el directorio público."
        acciones={<button className="btn btn--outline btn--lg" onClick={() => setEditando(true)}>Editar ficha</button>}
      />

      <div className="hu3-ficha">
        <div className="hu3-ficha__principal">
          <section className="card hu3-ficha__perfil">
            <span className="avatar avatar--soft hu3-ficha__avatar" aria-hidden="true">{asesor.iniciales}</span>
            <div>
              <h2>{asesor.nombre}</h2>
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
              <li><span>Solicitudes recibidas</span><strong>{resumen.solicitudesPendientes}</strong></li>
              <li><span>Avances por revisar</span><strong>{resumen.avancesPorRevisar}</strong></li>
              <li><span>Planes sin definir</span><strong>{resumen.planesSinDefinir}</strong></li>
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

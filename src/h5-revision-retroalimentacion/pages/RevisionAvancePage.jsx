import { useParams } from 'react-router-dom';
import { useState } from 'react';
import PageLayout from '../../shared/components/PageLayout.jsx';
import '../styles/RevisionAvancePage.css';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import { useRevision } from '../context/RevisionContext.jsx';

export default function RevisionAvancePage() {
  const { id } = useParams();
  const { usuario } = useAuth();
const {avances,cambiarEstadoAvance, agregarComentario,} = useRevision();
  const [comentario, setComentario] = useState('');

 const avance = avances.find(
  (item) => String(item.id) === id
);

  if (!avance) {
    return (
      <PageLayout>
        <h1>Avance no encontrado</h1>
      </PageLayout>
    );
  }

const handleObservar = () => {
  if (comentario.trim() === '') {
    alert('Debes escribir un comentario antes de observar el avance.');
    return;
  }

 const nuevoComentario = {
      id: Date.now(),
      autor: `${usuario.nombres} ${usuario.apellidos}`,
      rol: usuario.rol,
      texto: comentario.trim(),
};

  agregarComentario(id, nuevoComentario);
  setComentario('');
  cambiarEstadoAvance(id, 'observado');

  alert('Avance observado correctamente.');
};

const handleAprobar = () => {
  if (comentario.trim() !== '') {
        const nuevoComentario = {
      id: Date.now(),
      autor: `${usuario.nombres} ${usuario.apellidos}`,
      rol: usuario.rol,
      texto: comentario.trim(),
};

    agregarComentario(id, nuevoComentario);
    setComentario('');
  }

  cambiarEstadoAvance(id, 'aprobado');

  alert('Avance aprobado correctamente.');
};

  return (
    <PageLayout>
      <section className="h5-revision">

        {/* Encabezado */}
        <div className="h5-revision__encabezado">
          <p className="h5-revision__ruta">
            Inicio · Bandeja de revisión · {avance.entregable}
          </p>

          <h1>Revisión de un avance</h1>
             <p>
                Estado: <strong>{avance.estado}</strong>
            </p>
        </div>

        {/* Información principal */}
        <div className="h5-revision__card">

          <div className="h5-revision__datos">
            <div>
              <span className="h5-revision__label">TRABAJO</span>
              <h2>{avance.trabajo}</h2>
              <p>{avance.estudiante}</p>
            </div>

            <div className="h5-revision__meta">
              <div>
                <span className="h5-revision__label">ENTREGABLE</span>
                <p>{avance.entregable}</p>
              </div>

              <div>
                <span className="h5-revision__label">VERSIÓN</span>
                <p>{avance.version}</p>
              </div>

              <div>
                <span className="h5-revision__label">FECHA DE ENTREGA</span>
                <p>{avance.entrega}</p>
              </div>
            </div>
          </div>

          {/* Documento entregado */}
          <div className="h5-revision__documento">
            <div>
              <span className="h5-revision__label">
                DOCUMENTO ENTREGADO
              </span>

              <p className="h5-revision__archivo">
                {avance.entregable.replaceAll(' ', '_')}.pdf
              </p>
            </div>

            <button type="button" className="h5-revision__btn-documento">
              Ver documento
            </button>
          </div>

        </div>

        {/* Historial */}
        <div className="h5-revision__seccion">
          <h2>Versiones anteriores</h2>

          <div className="h5-revision__historial">
            <p>
              Esta es la versión <strong>{avance.version}</strong> del
              entregable.
            </p>

            <button type="button" className="h5-revision__btn-secundario">
              Ver historial de versiones
            </button>
          </div>
        </div>

        {/* Retroalimentación */}
        <div className="h5-revision__seccion">
          <h2>Comentarios y retroalimentación</h2>

              <div className="h5-revision__comentarios">
          {(avance.comentarios || []).length === 0 ? (
            <p className="h5-revision__sin-comentarios">
              Aún no hay comentarios para esta versión.
            </p>
          ) : (
            avance.comentarios.map((item) => (
              <div key={item.id} className="h5-revision__comentario">
                <strong>{item.autor}</strong>
                <p>{item.texto}</p>
              </div>
            ))
          )}
        </div>

          <label
            className="h5-revision__label"
            htmlFor="comentario-asesor"
          >
            COMENTARIO PARA EL ESTUDIANTE
          </label>

         <textarea
             id="comentario-asesor"
             className="h5-revision__textarea"
             placeholder="Escribe aquí tus observaciones o comentarios sobre el avance..."
             value={comentario}
             onChange={(e) => setComentario(e.target.value)}
                />
        </div>

        {/* Acciones */}
        <div className="h5-revision__acciones">
         <button
             type="button"
             className="h5-revision__btn-observar"
             onClick={handleObservar}
            >
             Observar avance
            </button>

         <button
               type="button"
               className="h5-revision__btn-aprobar"
               onClick={handleAprobar}
              >
              Aprobar avance
            </button>
        </div>

      </section>
    </PageLayout>
  );
}
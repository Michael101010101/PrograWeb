import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import '../styles/BandejaRevisionPage.css';
import { useRevision } from '../context/RevisionContext.jsx';


export default function BandejaRevisionPage() {
  const navigate = useNavigate();
  const { avances } = useRevision();
  const [pestanaActiva, setPestanaActiva] = useState('pendientes');

  const pendientes = avances.filter(
    (avance) => avance.estado === 'pendiente'
  );

  const revisados = avances.filter(
    (avance) =>
      avance.estado === 'aprobado' ||
      avance.estado === 'observado'
  );

  const avancesMostrados =
  pestanaActiva === 'pendientes' ? pendientes : revisados;

  return (
    <PageLayout>
      <section className="h5-bandeja">

        <div className="h5-bandeja__encabezado">
          <div>
            <p className="h5-bandeja__etiqueta">REVISIÓN DE AVANCES</p>
            <h1>Bandeja de revisión</h1>
            <p className="h5-bandeja__resumen">
              {pendientes.length} avances pendientes · ordenados por antigüedad de entrega
            </p>
          </div>
        </div>

        <div className="h5-bandeja__tabs">
          <button
            type="button"
            className={pestanaActiva === 'pendientes' ? 'activo' : ''}
            onClick={() => setPestanaActiva('pendientes')}
          >
            Pendientes ({pendientes.length})
          </button>

          <button
            type="button"
            className={pestanaActiva === 'revisados' ? 'activo' : ''}
            onClick={() => setPestanaActiva('revisados')}
          >
            Revisados ({revisados.length})
          </button>
        </div>

        <div className="h5-bandeja__tabla-contenedor">
          <table className="h5-bandeja__tabla">
            <thead>
              <tr>
                <th>Trabajo</th>
                <th>Entregable</th>
                <th>Versión</th>
                <th>Entrega</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {avancesMostrados.map((avance) => (
                <tr key={avance.id}>
                  <td>
                    <strong>{avance.trabajo}</strong>
                    <span className="h5-bandeja__estudiante">
                      {avance.estudiante}
                    </span>
                  </td>

                  <td>{avance.entregable}</td>

                  <td>
                    <span className="h5-bandeja__version">
                      {avance.version}
                    </span>
                  </td>

                  <td>
                    <span>{avance.entrega}</span>
                    <span className="h5-bandeja__antiguedad">
                      {avance.antiguedad}
                    </span>
                  </td>

                 <td>
                    {pestanaActiva === 'pendientes' ? (
                      <button
                        type="button"
                        className="btn-revisar"
                        onClick={() => navigate(`/asesor/revision/${avance.id}`)}
                      >
                        Revisar
                      </button>
                    ) : (
                      <div className="h5-bandeja__revision-resultado">
                        <span className={`h5-bandeja__estado h5-bandeja__estado--${avance.estado}`}>
                          {avance.estado === 'aprobado' ? 'Aprobado' : 'Observado'}
                        </span>

                        <button
                          type="button"
                          className="btn-revisar"
                          onClick={() => navigate(`/asesor/revision/${avance.id}`)}
                        >
                          Ver revisión
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </PageLayout>
  );
}
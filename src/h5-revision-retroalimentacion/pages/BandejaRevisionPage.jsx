import { useNavigate } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import '../styles/BandejaRevisionPage.css';
import { avancesPendientes } from '../data/avances.js';


export default function BandejaRevisionPage() {
    const navigate = useNavigate();
  return (
    <PageLayout>
      <section className="h5-bandeja">

        <div className="h5-bandeja__encabezado">
          <div>
            <p className="h5-bandeja__etiqueta">REVISIÓN DE AVANCES</p>
            <h1>Bandeja de revisión</h1>
            <p className="h5-bandeja__resumen">
              6 avances pendientes · ordenados por antigüedad de entrega
            </p>
          </div>
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
              {avancesPendientes.map((avance) => (
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
                   <button
                 type="button"
                 className="btn-revisar"
                 onClick={() => navigate(`/asesor/revision/${avance.id}`)}>
                     Revisar
                    </button>
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../shared/components/PageHead.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';
import { useAuth } from '../../hu1-cuenta/context/AuthContext.jsx';
import useAsesorias from '../hooks/useAsesorias.js';
import { asesorDeUsuario, cupoDisponible, trabajosDeAsesor, vencimientosDeAsesor } from '../services/asesoriasService.js';
import PaginaAsesor from '../components/PaginaAsesor.jsx';
import AsesoradoCard from '../components/AsesoradoCard.jsx';
import TablaVencimientos from '../components/TablaVencimientos.jsx';
import ModalTerminarAsesoria from '../components/modales/ModalTerminarAsesoria.jsx';

/** 3.5 Mis asesorados · rol Asesor (diapositivas 25 y 29). */
export default function MisAsesoradosPage() {
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const { datos, terminar } = useAsesorias();

  const [verTodos, setVerTodos] = useState(false);
  const [porTerminar, setPorTerminar] = useState(null); // trabajo del modal "Terminar asesoría"

  const asesor = asesorDeUsuario(datos, usuario.id);
  const trabajos = asesor ? trabajosDeAsesor(datos, asesor.id) : [];
  const porRevisar = trabajos.reduce((suma, t) => suma + t.porRevisar, 0);
  const vencimientos = asesor ? vencimientosDeAsesor(datos, asesor.id) : [];

  const confirmarTermino = (motivo) => {
    terminar(porTerminar.codigo, motivo); // lanza Error si el motivo no es válido
    setPorTerminar(null);
    mostrar({ tipo: 'exito', titulo: 'Asesoría terminada', mensaje: 'Se notificó al equipo y a la coordinación.' });
  };

  const verSustentacion = () => {
    mostrar({ tipo: 'aviso', titulo: 'Sustentación pendiente', mensaje: 'La coordinación aún no la programa (HU-6).' });
  };

  return (
    <PaginaAsesor datos={datos} asesor={asesor} footerDetalle={`${trabajos.length} trabajos a cargo`}>
      <PageHead
        migas="Inicio · Mis asesorados"
        titulo="Mis asesorados"
        descripcion={`${trabajos.length} trabajos a cargo · ${porRevisar} avances pendientes de revisión`}
        acciones={
          <button className="btn btn--outline btn--lg" onClick={() => navigate('/asesor/revision')}>
            Ir a la bandeja de revisión
          </button>
        }
      />

      {trabajos.length === 0 ? (
        <div className="card" style={{ maxWidth: 560, margin: '0 auto', borderStyle: 'dashed' }}>
          <EmptyState
            icono="✉"
            titulo="Aún no tienes asesorados"
            texto="Cuando aceptes una solicitud, el trabajo aparecerá aquí con su avance."
          >
            <button className="btn btn--outline" onClick={() => navigate('/asesor/solicitudes')}>Ver solicitudes</button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="hu3-asesorados">
            {trabajos.map((trabajo) => (
              <AsesoradoCard
                key={trabajo.codigo}
                trabajo={trabajo}
                onTerminar={setPorTerminar}
                onVerSustentacion={verSustentacion}
              />
            ))}
          </div>

          <TablaVencimientos
            titulo="Próximos vencimientos de mis asesorados"
            vencimientos={verTodos ? vencimientos : vencimientos.slice(0, 3)}
            accion={
              vencimientos.length > 3 && (
                <button className="link-button" style={{ fontWeight: 600, fontSize: 14 }} onClick={() => setVerTodos(!verTodos)}>
                  {verTodos ? 'Ver menos' : 'Ver todos'}
                </button>
              )
            }
          />
        </>
      )}

      {porTerminar && (
        <ModalTerminarAsesoria
          trabajo={porTerminar}
          cupo={cupoDisponible(asesor)}
          onConfirmar={confirmarTermino}
          onCerrar={() => setPorTerminar(null)}
        />
      )}
    </PaginaAsesor>
  );
}

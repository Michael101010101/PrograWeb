import { Navigate, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../hu1-cuenta/guards/RutaProtegida.jsx';
import SoloPublico from '../hu1-cuenta/guards/SoloPublico.jsx';
import EnConstruccion from '../shared/components/EnConstruccion.jsx';

// H5 · Revisión y retroalimentación
import BandejaRevisionPage from '../h5-revision-retroalimentacion/pages/BandejaRevisionPage.jsx';
import RevisionAvancePage from '../h5-revision-retroalimentacion/pages/RevisionAvancePage.jsx';
import RevisionLayout from '../h5-revision-retroalimentacion/components/RevisionLayout.jsx';
import RetroalimentacionPage from '../h5-revision-retroalimentacion/pages/RetroalimentacionPage.jsx';
import HistorialVersionesPage from '../h5-revision-retroalimentacion/pages/HistorialVersionesPage.jsx';
import TrabajoConsolidadoPage from '../h5-revision-retroalimentacion/pages/TrabajoConsolidadoPage.jsx';

// HU-1 · Cuenta y acceso
import LandingPage from '../hu1-cuenta/pages/LandingPage.jsx';
import LoginPage from '../hu1-cuenta/pages/LoginPage.jsx';
import RegistroEstudiantePage from '../hu1-cuenta/pages/RegistroEstudiantePage.jsx';
import RegistroAsesorPage from '../hu1-cuenta/pages/RegistroAsesorPage.jsx';
import RegistroCoordinadorPage from '../hu1-cuenta/pages/RegistroCoordinadorPage.jsx';
import RecuperarPasswordPage from '../hu1-cuenta/pages/RecuperarPasswordPage.jsx';
import NuevaPasswordPage from '../hu1-cuenta/pages/NuevaPasswordPage.jsx';
import VerificarCorreoPage from '../hu1-cuenta/pages/VerificarCorreoPage.jsx';
import MiCuentaPage from '../hu1-cuenta/pages/MiCuentaPage.jsx';
import InvitacionesPage from '../hu1-cuenta/pages/InvitacionesPage.jsx';
import NotFoundPage from '../hu1-cuenta/pages/NotFoundPage.jsx';

// HU-2 · Registro del trabajo
import MiTrabajoPage from '../hu2-trabajo/pages/MiTrabajoPage.jsx';
import RegistrarTrabajoPage from '../hu2-trabajo/pages/RegistrarTrabajoPage.jsx';
import EquipoTrabajoPage from '../hu2-trabajo/pages/EquipoTrabajoPage.jsx';

// HU-7 · Supervisión y métricas
import TableroAdmin from '../hu7-supervicion/pages/TableroAdmin.jsx';
import GestionUsuarios from '../hu7-supervicion/pages/GestionUsuarios.jsx';
import CargaAsesores from '../hu7-supervicion/pages/CargaAsesores.jsx';
import TrabajosAdmin from '../hu7-supervicion/pages/TrabajosAdmin.jsx';

// HU-4 · Plan de entregables
import PlanEntregablesPage from '../hu4-entregables/pages/PlanEntregablesPage.jsx';
import AlertasVencimientoPage from '../hu4-entregables/pages/AlertasVencimientoPage.jsx';
import DefinirPlanPage from '../hu4-entregables/pages/DefinirPlanPage.jsx';

// HU-3 · Asesores y asignación
import DirectorioAsesoresPage from '../hu3-asesores/pages/DirectorioAsesoresPage.jsx';
import SolicitudesRecibidasPage from '../hu3-asesores/pages/SolicitudesRecibidasPage.jsx';
import MisAsesoradosPage from '../hu3-asesores/pages/MisAsesoradosPage.jsx';
import DetalleAsesoradoPage from '../hu3-asesores/pages/DetalleAsesoradoPage.jsx';
import MiFichaPage from '../hu3-asesores/pages/MiFichaPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/proceso" element={<EnConstruccion titulo="El proceso" historia="HU-1 (contenido informativo)" />} />
      <Route path="/cronograma" element={<EnConstruccion titulo="Cronograma" historia="HU-1 (contenido informativo)" />} />
      <Route path="/asesores" element={<DirectorioAsesoresPage />} />
      <Route path="/verificar/:token" element={<VerificarCorreoPage />} />

      {/* Solo sin sesión */}
      <Route element={<SoloPublico />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro/estudiante" element={<RegistroEstudiantePage />} />
        <Route path="/registro/asesor" element={<RegistroAsesorPage />} />
        <Route path="/registro/coordinador" element={<RegistroCoordinadorPage />} />
        <Route path="/recuperar" element={<RecuperarPasswordPage />} />
        <Route path="/recuperar/:token" element={<NuevaPasswordPage />} />
      </Route>

      {/* Cualquier rol con sesión */}
      <Route element={<RutaProtegida />}>
        <Route path="/cuenta" element={<MiCuentaPage />} />
      </Route>

      {/* Estudiante */}
      <Route path="/estudiante" element={<RutaProtegida roles={['estudiante']} />}>
        <Route path="mi-trabajo" element={<MiTrabajoPage />} />
        <Route path="mi-trabajo/ficha" element={<MiTrabajoPage vistaFicha />} />
        <Route path="mi-trabajo/registrar" element={<RegistrarTrabajoPage key="registrar" modo="registrar" />} />
        <Route path="mi-trabajo/editar" element={<RegistrarTrabajoPage key="editar" modo="editar" />} />
        <Route path="mi-trabajo/equipo" element={<EquipoTrabajoPage />} />
        <Route path="entregables" element={<PlanEntregablesPage />} />
        <Route path="entregables/alertas" element={<AlertasVencimientoPage />} />
        <Route path="retroalimentacion" element={<RevisionLayout />}>
          <Route index element={<RetroalimentacionPage />} />
          <Route path="historial/:entregableId" element={<HistorialVersionesPage />} />
          <Route path="trabajo/:codigo" element={<Navigate to="/estudiante/mi-trabajo" replace />} />
        </Route>
        <Route path="asesores" element={<DirectorioAsesoresPage />} />
        <Route path="sustentacion" element={<EnConstruccion titulo="Mi sustentación" historia="HU-6" />} />
      </Route>

      {/* Asesor */}
      <Route path="/asesor" element={<RutaProtegida roles={['asesor']} />}>
        <Route path="asesorados" element={<MisAsesoradosPage />} />
        <Route path="asesorados/:codigo" element={<DetalleAsesoradoPage />} />
        <Route path="asesorados/:codigo/plan" element={<DefinirPlanPage />} />
        <Route path="solicitudes" element={<SolicitudesRecibidasPage />} />
        <Route path="revision" element={<RevisionLayout />}>
          <Route index element={<BandejaRevisionPage />} />
          <Route path="historial/:entregableId" element={<HistorialVersionesPage />} />
          <Route path="trabajo/:codigo" element={<TrabajoConsolidadoPage />} />
          <Route path=":id" element={<RevisionAvancePage />} />
        </Route>
        <Route path="ficha" element={<MiFichaPage />} />
      </Route>

      {/* Administrador · coordinación (HU-7) */}
      <Route path="/admin" element={<RutaProtegida roles={['coordinador']} />}>
        <Route path="invitaciones" element={<InvitacionesPage />} />
        <Route path="tablero" element={<TableroAdmin />} />
        <Route path="trabajos" element={<TrabajosAdmin />} />
        <Route path="carga" element={<CargaAsesores />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="sustentaciones" element={<EnConstruccion titulo="Sustentaciones" historia="HU-6" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import { Route, Routes } from 'react-router-dom';
import RutaProtegida from '../hu1-cuenta/guards/RutaProtegida.jsx';
import SoloPublico from '../hu1-cuenta/guards/SoloPublico.jsx';
import EnConstruccion from '../shared/components/EnConstruccion.jsx';

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

// Cada historia reemplaza sus <EnConstruccion /> por sus páginas reales al integrar su rama.
export default function AppRouter() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/proceso" element={<EnConstruccion titulo="El proceso" historia="HU-1 (contenido informativo)" />} />
      <Route path="/cronograma" element={<EnConstruccion titulo="Cronograma" historia="HU-1 (contenido informativo)" />} />
      <Route path="/asesores" element={<EnConstruccion titulo="Directorio de asesores" historia="HU-3" />} />
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
        <Route path="mi-trabajo" element={<EnConstruccion titulo="Mi trabajo" historia="HU-2" />} />
        <Route path="entregables" element={<EnConstruccion titulo="Plan de entregables" historia="HU-4" />} />
        <Route path="retroalimentacion" element={<EnConstruccion titulo="Retroalimentación" historia="HU-5" />} />
        <Route path="asesores" element={<EnConstruccion titulo="Directorio de asesores" historia="HU-3" />} />
        <Route path="sustentacion" element={<EnConstruccion titulo="Mi sustentación" historia="HU-6" />} />
      </Route>

      {/* Asesor */}
      <Route path="/asesor" element={<RutaProtegida roles={['asesor']} />}>
        <Route path="asesorados" element={<EnConstruccion titulo="Mis asesorados" historia="HU-3" />} />
        <Route path="solicitudes" element={<EnConstruccion titulo="Solicitudes recibidas" historia="HU-3" />} />
        <Route path="revision" element={<EnConstruccion titulo="Bandeja de revisión" historia="HU-5" />} />
        <Route path="ficha" element={<EnConstruccion titulo="Mi ficha de asesor" historia="HU-3" />} />
      </Route>

      {/* Administrador · coordinación */}
      <Route path="/admin" element={<RutaProtegida roles={['coordinador']} />}>
        <Route path="invitaciones" element={<InvitacionesPage />} />
        <Route path="tablero" element={<EnConstruccion titulo="Tablero del periodo" historia="HU-7" />} />
        <Route path="trabajos" element={<EnConstruccion titulo="Trabajos del periodo" historia="HU-7" />} />
        <Route path="carga" element={<EnConstruccion titulo="Carga por asesor" historia="HU-7" />} />
        <Route path="sustentaciones" element={<EnConstruccion titulo="Sustentaciones" historia="HU-6" />} />
        <Route path="usuarios" element={<EnConstruccion titulo="Gestión de usuarios" historia="HU-7" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

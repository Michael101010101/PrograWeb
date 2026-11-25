import { AuthProvider } from './hu1-cuenta/context/AuthContext.jsx';
import { ToastProvider } from './shared/components/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';
import { DatosProvider } from './shared/context/DatosContext.jsx';

export default function App() {
  return (
    <ToastProvider>
      <DatosProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </DatosProvider>
    </ToastProvider>
  );
}

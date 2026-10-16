import { AuthProvider } from './hu1-cuenta/context/AuthContext.jsx';
import { ToastProvider } from './shared/components/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  );
}

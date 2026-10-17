import { AuthProvider } from './hu1-cuenta/context/AuthContext.jsx';
import { ToastProvider } from './shared/components/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';
import CargaAsesores from './hu7-supervicion/pages/CargaAsesores.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div>
          
          <CargaAsesores/>
         
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

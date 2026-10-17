import { AuthProvider } from './hu1-cuenta/context/AuthContext.jsx';
import { ToastProvider } from './shared/components/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';
import CargaAsesores from './hu7-supervicion/pages/CargaAsesores.jsx';
import TrabajosAdmin from './hu7-supervicion/pages/TrabajosAdmin.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div>
          
          <TrabajosAdmin/>
         
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

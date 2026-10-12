import { AuthProvider } from './hu1-cuenta/context/AuthContext.jsx';
import { ToastProvider } from './shared/components/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';
import TableroAdmin from './hu7-supervicion/pages/TableroAdmin.jsx';

export default function App() {
return (
    <ToastProvider>
      <AuthProvider>
        <div>
          <TableroAdmin />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

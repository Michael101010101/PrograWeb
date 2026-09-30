import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../shared/components/PageLayout.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import * as authService from '../services/authService.js';

/** Destino del enlace de verificación que "llega" al correo tras el registro. */
export default function VerificarCorreoPage() {
  const { token } = useParams();
  const [estado, setEstado] = useState({ cargando: true });
  const ejecutado = useRef(false); // evita doble llamada en StrictMode (el token es de un solo uso)

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;
    authService
      .verificarCorreo(token)
      .then((u) => setEstado({ usuario: u }))
      .catch((err) => setEstado({ error: err.message }));
  }, [token]);

  return (
    <PageLayout centrado>
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        {estado.cargando && <p className="text-muted" style={{ textAlign: 'center' }}>Verificando tu correo…</p>}
        {estado.usuario && (
          <EmptyState icono="✓" titulo="Correo verificado" texto={`La cuenta ${estado.usuario.correo} ya está activa.`}>
            <Link to="/login" className="btn btn--primary">Iniciar sesión</Link>
          </EmptyState>
        )}
        {estado.error && (
          <EmptyState icono="!" tono="warning" titulo="No pudimos verificar tu correo" texto={estado.error}>
            <Link to="/login" className="btn btn--primary">Ir a iniciar sesión</Link>
          </EmptyState>
        )}
      </div>
    </PageLayout>
  );
}

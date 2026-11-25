import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';
import { guardarSesion, leerSesion } from '../../shared/sesion.js';

const AuthContext = createContext(null);

/**
 * Estado global de la sesión. Guarda el JWT que entrega el servidor y el usuario.
 * Expone: usuario, cargando, ingresoAnterior, iniciarSesion, cerrarSesion, actualizarUsuario
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [ingresoAnterior, setIngresoAnterior] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app: si hay un token guardado, se pide el usuario al servidor.
  useEffect(() => {
    const sesion = leerSesion();
    if (!sesion?.token) {
      setCargando(false);
      return;
    }
    authService
      .obtenerUsuarioSesion()
      .then((u) => {
        setUsuario(u);
        setIngresoAnterior(sesion.ingresoAnterior ?? null);
      })
      .catch(() => guardarSesion(null)) // token vencido o cuenta deshabilitada
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(async (correo, password, recordar) => {
    const { token, usuario: u, ingresoAnterior: previo } = await authService.iniciarSesion(correo, password);
    guardarSesion({ token, ingresoAnterior: previo }, recordar);
    setUsuario(u);
    setIngresoAnterior(previo);
    return u;
  }, []);

  const cerrarSesion = useCallback(() => {
    guardarSesion(null);
    setUsuario(null);
    setIngresoAnterior(null);
  }, []);

  const actualizarUsuario = useCallback((u) => setUsuario(u), []);

  const valor = useMemo(
    () => ({ usuario, cargando, ingresoAnterior, iniciarSesion, cerrarSesion, actualizarUsuario }),
    [usuario, cargando, ingresoAnterior, iniciarSesion, cerrarSesion, actualizarUsuario]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

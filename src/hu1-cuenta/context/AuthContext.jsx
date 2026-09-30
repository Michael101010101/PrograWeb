import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);
const CLAVE_SESION = 'tfc.sesion';

function leerSesion() {
  const crudo = localStorage.getItem(CLAVE_SESION) ?? sessionStorage.getItem(CLAVE_SESION);
  try {
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

function guardarSesion(sesion, recordar) {
  localStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_SESION);
  if (sesion) (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION, JSON.stringify(sesion));
}

/**
 * Estado global de la sesión. Expone:
 *  usuario, cargando, ingresoAnterior,
 *  iniciarSesion(correo, password, recordar), cerrarSesion(), actualizarUsuario(u)
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [ingresoAnterior, setIngresoAnterior] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const sesion = leerSesion();
    if (!sesion) {
      setCargando(false);
      return;
    }
    authService.obtenerUsuarioSesion(sesion.usuarioId).then((u) => {
      if (u) {
        setUsuario(u);
        setIngresoAnterior(sesion.ingresoAnterior ?? null);
      } else {
        guardarSesion(null); // la cuenta fue bloqueada o eliminada
      }
      setCargando(false);
    });
  }, []);

  const iniciarSesion = useCallback(async (correo, password, recordar) => {
    const { usuario: u, ingresoAnterior: previo } = await authService.iniciarSesion(correo, password);
    guardarSesion({ usuarioId: u.id, ingresoAnterior: previo }, recordar);
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

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.js';

const AuthContext = createContext(null);

/**
 * Estado de sesión del administrador. La sesión vive en una cookie HttpOnly;
 * aquí sólo se guarda en memoria el perfil público devuelto por /auth/me.
 */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | anonymous

  useEffect(() => {
    let active = true;
    authService.me().then(
      ({ admin: me }) => {
        if (!active) return;
        setAdmin(me);
        setStatus('authenticated');
      },
      () => active && setStatus('anonymous'),
    );
    // Si cualquier petición devuelve 401 (sesión expirada) se vuelve al login
    const onUnauthorized = () => {
      setAdmin(null);
      setStatus('anonymous');
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => {
      active = false;
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const { admin: me } = await authService.login(username, password);
    setAdmin(me);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setAdmin(null);
      setStatus('anonymous');
    }
  }, []);

  // Actualiza el perfil en memoria (p. ej. tras editar el propio nombre o usuario)
  const updateCurrentAdmin = useCallback((data) => setAdmin((a) => ({ ...a, ...data })), []);

  const value = useMemo(
    () => ({ admin, status, login, logout, updateCurrentAdmin }),
    [admin, status, login, logout, updateCurrentAdmin],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

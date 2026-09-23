import { createContext, useContext, useEffect } from 'react';
import { siteService } from '../services/site.js';
import { useAsync } from '../hooks/useAsync.js';
import { applyTheme } from '../utils/theme.js';

const SiteContext = createContext(null);

/** Carga en una sola petición la configuración pública del sitio y aplica el tema */
export function SiteProvider({ children }) {
  const state = useAsync(siteService.getPublic);
  const theme = state.data?.site?.theme;

  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite debe usarse dentro de <SiteProvider>');
  return ctx;
}

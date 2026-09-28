import { useEffect } from 'react';
import { startKeepAlive } from '../services/keepAlive.js';

/**
 * Mantiene activo el backend mientras la app está abierta.
 * Usar una sola vez en el componente raíz. El intervalo se limpia al desmontar.
 */
export function useKeepAlive() {
  useEffect(() => startKeepAlive(), []);
}

// Keep-alive del backend: hace un ping ligero periódico para que Render
// no suspenda el servicio mientras la aplicación está abierta.
// Es completamente silencioso: no muestra nada, no registra nada y nunca lanza errores.
import { apiUrl } from './api.js';

/** Cada cuánto se hace el ping mientras la app está abierta */
export const KEEP_ALIVE_INTERVAL_MS = 15 * 60 * 1000;

/** Tiempo máximo de espera: un arranque en frío de Render puede tardar ~1 minuto */
const PING_TIMEOUT_MS = 60 * 1000;

/** Evita pings duplicados si el componente se monta dos veces seguidas (StrictMode) */
const MIN_PING_GAP_MS = 60 * 1000;

const HEALTH_PATH = '/health';

let lastPingAt = 0;

/** Un ping al health check. Nunca lanza errores ni deja rastro en la interfaz. */
export async function pingBackend() {
  lastPingAt = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    await fetch(apiUrl(HEALTH_PATH), {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    });
  } catch {
    // Render iniciando, sin conexión o timeout: se ignora a propósito.
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Inicia el keep-alive: un ping inicial y luego uno cada KEEP_ALIVE_INTERVAL_MS.
 * Devuelve una función que detiene el intervalo. Un ping ya enviado se deja terminar
 * (es inofensivo y tiene su propio timeout): cancelarlo impediría el ping inicial
 * cuando React monta y desmonta el componente seguido (StrictMode en desarrollo).
 */
export function startKeepAlive({ interval = KEEP_ALIVE_INTERVAL_MS } = {}) {
  if (Date.now() - lastPingAt >= MIN_PING_GAP_MS) pingBackend();
  const intervalId = setInterval(pingBackend, interval);

  return function stopKeepAlive() {
    clearInterval(intervalId);
  };
}

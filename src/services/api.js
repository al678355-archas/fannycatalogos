// Cliente HTTP único. Las cookies de sesión (HttpOnly) viajan con credentials: 'include';
// el frontend nunca tiene acceso al token.

export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Construye una URL absoluta de la API (para <img src>, enlaces de descarga, etc.) */
export const apiUrl = (path) => `${API_URL}${path}`;

async function request(method, path, body) {
  const isForm = body instanceof FormData;
  let response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      credentials: 'include',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión.', 0);
  }

  // Nuestra API siempre responde JSON. Si llega otra cosa (HTML, 404 de otro servidor...),
  // /api no está llegando al backend: proxy sin configurar o backend apagado.
  const isJson = response.headers.get('content-type')?.includes('application/json');
  if (!isJson) {
    console.error(
      `[api] ${method} ${apiUrl(path)} respondió ${response.status} sin JSON. ` +
        'Verifica que el backend esté corriendo y que /api apunte a él ' +
        '(proxy de Vite en desarrollo o rewrites de vercel.json en producción).',
    );
    throw new ApiError('No se pudo conectar con el servidor. Intenta de nuevo en unos minutos.', response.status);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event('auth:unauthorized'));
    throw new ApiError(data?.error || `Error ${response.status}`, response.status, data?.details);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

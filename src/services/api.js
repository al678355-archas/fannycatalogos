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

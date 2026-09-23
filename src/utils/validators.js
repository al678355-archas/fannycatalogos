export const MAX_IMAGE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Validación previa en el navegador (el backend vuelve a validar el contenido real) */
export function validateImageFile(file) {
  if (!file) return 'Selecciona una imagen';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Formato no permitido. Usa JPG, PNG o WEBP';
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `La imagen supera ${MAX_IMAGE_MB} MB`;
  return null;
}

const SAFE_URL = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;
export const isSafeUrl = (v) => !v || SAFE_URL.test(v);
export const URL_HINT = 'Usa /ruta, #seccion, https://..., mailto: o tel:';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');

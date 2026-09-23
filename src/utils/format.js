/** "1250.00" -> "$1,250.00" según moneda y locale configurados */
export function formatPrice(value, currency = 'MXN', locale = 'es-MX') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/** Normaliza lo que escribe el usuario: "1,250.5" -> "1250.50"; null si no es válido */
export function parsePriceInput(input) {
  const raw = String(input ?? '').replace(/[$\s,]/g, '');
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(raw)) return null;
  const [int, dec = ''] = raw.split('.');
  return `${String(Number(int))}.${dec.padEnd(2, '0')}`;
}

export function formatDate(value, locale = 'es-MX') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  return bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/** Divide un texto en párrafos por líneas en blanco */
export const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

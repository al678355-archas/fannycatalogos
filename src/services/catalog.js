import { api, apiUrl } from './api.js';

export const catalogService = {
  share: () => api.get('/catalog/share'),
  /** style: 'color' (colores de la página) | 'plain' (blanco y negro) */
  pdfUrl: ({ style = 'color', inline = false } = {}) => {
    const params = new URLSearchParams();
    if (style === 'plain') params.set('style', 'plain');
    if (inline) params.set('inline', '1');
    const query = params.toString();
    return apiUrl(`/catalog/pdf${query ? `?${query}` : ''}`);
  },
  qrUrl: (opts = {}) => {
    const params = new URLSearchParams({ size: String(opts.size || 512) });
    if (opts.download) params.set('download', '1');
    if (opts.v) params.set('v', String(opts.v));
    return apiUrl(`/catalog/qr?${params}`);
  },
};

import { api, apiUrl } from './api.js';

export const catalogService = {
  share: () => api.get('/catalog/share'),
  pdfUrl: () => apiUrl('/catalog/pdf'),
  qrUrl: (opts = {}) => {
    const params = new URLSearchParams({ size: String(opts.size || 512) });
    if (opts.download) params.set('download', '1');
    if (opts.v) params.set('v', String(opts.v));
    return apiUrl(`/catalog/qr?${params}`);
  },
};

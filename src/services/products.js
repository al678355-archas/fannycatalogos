import { api } from './api.js';

export const productsService = {
  listPublic: () => api.get('/products'),
  listAll: () => api.get('/products/all'),
  stats: () => api.get('/products/stats'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  // El backend exige la palabra de confirmación como protección adicional
  remove: (id) => api.delete(`/products/${id}?confirm=ELIMINAR`),
  reorder: (ids) => api.put('/products/reorder', { ids }),
};

import { api } from './api.js';

export const contentService = {
  listAll: () => api.get('/content/all'),
  create: (data) => api.post('/content', data),
  update: (id, data) => api.put(`/content/${id}`, data),
  remove: (id) => api.delete(`/content/${id}`),
  reorder: (ids) => api.put('/content/reorder', { ids }),
};

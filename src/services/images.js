import { api } from './api.js';

export const imagesService = {
  list: () => api.get('/images'),
  upload: (file, alt = '') => {
    const form = new FormData();
    form.append('image', file);
    if (alt) form.append('alt', alt);
    return api.post('/images', form);
  },
  updateAlt: (id, alt) => api.patch(`/images/${id}`, { alt }),
  remove: (id) => api.delete(`/images/${id}`),
};

import { api } from './api.js';

export const adminsService = {
  list: () => api.get('/admins'),
  create: (data) => api.post('/admins', data),
  update: (id, data) => api.patch(`/admins/${id}`, data),
  resetPassword: (id, newPassword) => api.put(`/admins/${id}/password`, { newPassword }),
  // El backend exige la palabra de confirmación como protección adicional
  remove: (id) => api.delete(`/admins/${id}?confirm=ELIMINAR`),
};

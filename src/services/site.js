import { api } from './api.js';

export const siteService = {
  getPublic: () => api.get('/site'),
  updateAppearance: (data) => api.put('/site', data),
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getHeader: () => api.get('/header'),
  updateHeader: (data) => api.put('/header', data),
  getFooter: () => api.get('/footer'),
  updateFooter: (data) => api.put('/footer', data),
};

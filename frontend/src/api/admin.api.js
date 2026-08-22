import api from './client';

export const adminApi = {
  getAdminStats: () => api.get('/admin/stats'),
};

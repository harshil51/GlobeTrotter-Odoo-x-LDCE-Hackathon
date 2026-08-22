import api from './client';

export const stopsApi = {
  addStop: (stopData) => api.post('/stops', stopData),
  updateStop: (id, stopData) => api.put(`/stops/${id}`, stopData),
  deleteStop: (id) => api.delete(`/stops/${id}`),
  reorderStops: (stopsList) => api.put('/stops/reorder', { stops: stopsList }),
};

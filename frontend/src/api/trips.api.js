import api from './client';

export const tripsApi = {
  getTrips: () => api.get('/trips'),
  getTripById: (id) => api.get(`/trips/${id}`),
  createTrip: (tripData) => api.post('/trips', tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
};

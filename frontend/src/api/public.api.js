import api from './client';

export const publicApi = {
  getCommunityTrips: () => api.get('/public/trips'),
  getPublicTrip: (shareToken) => api.get(`/public/trips/${shareToken}`),
  shareTrip: (tripId) => api.post(`/public/trips/${tripId}/share`),
  unshareTrip: (tripId) => api.post(`/public/trips/${tripId}/unshare`),
  copyTrip: (shareToken) => api.post(`/public/trips/${shareToken}/copy`),
};

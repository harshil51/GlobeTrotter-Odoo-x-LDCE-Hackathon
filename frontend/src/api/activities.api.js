import api from './client';

export const activitiesApi = {
  addTripActivity: (activityData) => api.post('/trip-activities', activityData),
  updateTripActivity: (id, activityData) => api.put(`/trip-activities/${id}`, activityData),
  deleteTripActivity: (id) => api.delete(`/trip-activities/${id}`),
};

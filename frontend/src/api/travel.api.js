import api from './client';

export const travelApi = {
  searchDestinations: (query) => api.get('/travel/destinations/search', { params: { q: query } }),
  getPlaceDetails: (id) => api.get(`/travel/places/${id}`),
  searchFlights: (origin, destination, departureDate, adults) => 
    api.get('/travel/flights', { params: { origin, destination, departureDate, adults } }),
  searchHotels: (cityCode) => api.get('/travel/hotels', { params: { cityCode } }),
  generateTripPlan: (requestData) => api.post('/travel/generate-plan', requestData),
  getGeneratedPlan: (tripId) => api.get(`/travel/plan/${tripId}`),
};

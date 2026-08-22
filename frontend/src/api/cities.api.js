import api from './client';

export const citiesApi = {
  searchCities: (query = '', country = '', limit = 50) => 
    api.get('/cities', { params: { query, country, limit } }),
  getCityById: (id) => api.get(`/cities/${id}`),
  getCityActivities: (cityId, category = '') => 
    api.get(`/cities/${cityId}/activities`, { params: { category } }),
  getAllActivities: (query = '', category = '', limit = 100) => 
    api.get('/cities/activities/all', { params: { query, category, limit } }),
};

import api from './client';

export const countriesApi = {
  // Fetch all countries
  getCountries: async () => {
    // Basic session storage cache to prevent hitting backend repeatedly
    const cached = sessionStorage.getItem('countriesList');
    if (cached) {
      return JSON.parse(cached);
    }
    const data = await api.get('/travel/countries');
    if (data && data.length > 0) {
      sessionStorage.setItem('countriesList', JSON.stringify(data));
    }
    return data;
  },

  // Fetch specific country details
  getCountryDetails: async (code) => {
    return await api.get(`/travel/countries/${code}`);
  },
};

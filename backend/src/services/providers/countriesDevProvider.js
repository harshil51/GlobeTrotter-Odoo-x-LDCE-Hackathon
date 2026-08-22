const axios = require('axios');

class CountriesDevProvider {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://countries.dev/api',
      timeout: 5000,
    });
    this.cache = new Map();
  }

  async getCountries() {
    if (this.cache.has('countries')) {
      return this.cache.get('countries');
    }
    try {
      const response = await this.client.get('/countries');
      this.cache.set('countries', response.data);
      return response.data;
    } catch (error) {
      console.error('Countries.dev Error (/countries):', error.message);
      return this._mockCountries();
    }
  }

  async getCountryDetails(alphaCode) {
    if (this.cache.has(`country_${alphaCode}`)) {
      return this.cache.get(`country_${alphaCode}`);
    }
    try {
      const response = await this.client.get(`/alpha/${alphaCode}`);
      this.cache.set(`country_${alphaCode}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Countries.dev Error (/alpha/${alphaCode}):`, error.message);
      return this._mockCountryDetails(alphaCode);
    }
  }

  async getCities() {
    try {
      const response = await this.client.get('/cities');
      return response.data;
    } catch (error) {
      console.error('Countries.dev Error (/cities):', error.message);
      return [];
    }
  }

  async getPlaces() {
    try {
      const response = await this.client.get('/places');
      return response.data;
    } catch (error) {
      console.error('Countries.dev Error (/places):', error.message);
      return [];
    }
  }

  async getIpInfo(ip) {
    try {
      const response = await this.client.get(`/ip`, { params: { ip } });
      return response.data;
    } catch (error) {
      console.error('Countries.dev Error (/ip):', error.message);
      return null;
    }
  }

  _mockCountries() {
    return [
      { name: 'India', code: 'IN', flag: '🇮🇳', region: 'Asia', capital: 'New Delhi', currency: 'INR' },
      { name: 'United States', code: 'US', flag: '🇺🇸', region: 'Americas', capital: 'Washington, D.C.', currency: 'USD' },
      { name: 'Japan', code: 'JP', flag: '🇯🇵', region: 'Asia', capital: 'Tokyo', currency: 'JPY' },
      { name: 'France', code: 'FR', flag: '🇫🇷', region: 'Europe', capital: 'Paris', currency: 'EUR' },
      { name: 'Australia', code: 'AU', flag: '🇦🇺', region: 'Oceania', capital: 'Canberra', currency: 'AUD' },
      { name: 'Brazil', code: 'BR', flag: '🇧🇷', region: 'Americas', capital: 'Brasília', currency: 'BRL' },
    ];
  }

  _mockCountryDetails(alphaCode) {
    const mockData = this._mockCountries().find(c => c.code.toLowerCase() === alphaCode.toLowerCase());
    return mockData ? mockData : null;
  }
}

module.exports = new CountriesDevProvider();

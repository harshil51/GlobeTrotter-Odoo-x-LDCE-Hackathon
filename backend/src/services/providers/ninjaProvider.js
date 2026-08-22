const axios = require('axios');

class NinjaProvider {
  constructor() {
    this.apiKey = process.env.API_NINJAS_KEY;
    this.client = axios.create({
      baseURL: 'https://api.api-ninjas.com/v1',
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  }

  async getCountryInfo(name) {
    if (!this.apiKey) return this._mockCountryInfo(name);

    try {
      // The user requested allcountries endpoint
      const response = await this.client.get('/allcountries', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      console.error('API Ninjas Country Error:', error.message);
      return this._mockCountryInfo(name);
    }
  }

  async getCityInfo(name) {
    if (!this.apiKey) return this._mockCityInfo(name);

    try {
      const response = await this.client.get('/city', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      console.error('API Ninjas City Error:', error.message);
      return this._mockCityInfo(name);
    }
  }

  _mockCountryInfo(name) {
    return [
      {
        name: name,
        capital: 'Mock Capital',
        currency: { code: 'MCK', name: 'Mock Currency' },
        region: 'Mock Region',
        population: 1000000,
        source: 'Mock Provider (No API Key)'
      }
    ];
  }

  _mockCityInfo(name) {
    return [
      {
        name: name,
        latitude: 0,
        longitude: 0,
        country: 'Mock Country',
        population: 500000,
        is_capital: true,
        source: 'Mock Provider (No API Key)'
      }
    ];
  }
}

module.exports = new NinjaProvider();

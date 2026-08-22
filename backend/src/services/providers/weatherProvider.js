const axios = require('axios');

class WeatherProvider {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.client = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5',
    });
  }

  async getForecast(lat, lon) {
    if (!this.apiKey) return this._mockForecast();

    try {
      const response = await this.client.get('/forecast', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      return this._normalizeForecast(response.data);
    } catch (error) {
      console.error('Weather API Error:', error.message);
      return this._mockForecast();
    }
  }

  _normalizeForecast(data) {
    if (!data || !data.list) return [];
    
    // Group by day to give a daily summary
    const daily = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) {
        daily[date] = {
          date,
          temp: item.main.temp,
          description: item.weather[0]?.description,
          icon: item.weather[0]?.icon,
          main: item.weather[0]?.main,
        };
      }
    });
    
    return Object.values(daily);
  }

  _mockForecast() {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        date: d.toISOString().split('T')[0],
        temp: 24.5 + Math.random() * 5,
        description: Math.random() > 0.5 ? 'clear sky' : 'light rain',
        main: Math.random() > 0.5 ? 'Clear' : 'Rain',
        icon: '01d',
      });
    }
    return dates;
  }
}

module.exports = new WeatherProvider();

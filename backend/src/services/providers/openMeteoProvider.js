const axios = require('axios');

class OpenMeteoProvider {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.open-meteo.com/v1',
    });
  }

  async getForecast(lat, lon) {
    if (!lat || !lon) return [];
    
    try {
      const response = await this.client.get('/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          daily: 'weathercode,temperature_2m_max,temperature_2m_min',
          timezone: 'auto'
        },
      });
      return this._normalizeForecast(response.data);
    } catch (error) {
      console.error('Open-Meteo API Error:', error.message);
      return [];
    }
  }

  _normalizeForecast(data) {
    if (!data || !data.daily || !data.daily.time) return [];
    
    const dates = [];
    for (let i = 0; i < Math.min(5, data.daily.time.length); i++) {
      const code = data.daily.weathercode[i];
      const maxT = data.daily.temperature_2m_max[i];
      const minT = data.daily.temperature_2m_min[i];
      
      dates.push({
        date: data.daily.time[i],
        temp: Math.round((maxT + minT) / 2),
        description: this._getWeatherDescription(code),
        main: this._getMainWeather(code),
        icon: '01d', 
      });
    }
    
    return dates;
  }

  _getWeatherDescription(code) {
    const w = this._weatherCodeMap(code);
    return w.description;
  }
  
  _getMainWeather(code) {
    const w = this._weatherCodeMap(code);
    return w.main;
  }

  _weatherCodeMap(code) {
    if (code === 0) return { main: 'Clear', description: 'clear sky' };
    if ([1,2,3].includes(code)) return { main: 'Clouds', description: 'partly cloudy' };
    if ([45,48].includes(code)) return { main: 'Fog', description: 'fog' };
    if ([51,53,55,56,57].includes(code)) return { main: 'Drizzle', description: 'drizzle' };
    if ([61,63,65,66,67].includes(code)) return { main: 'Rain', description: 'rain' };
    if ([71,73,75,77].includes(code)) return { main: 'Snow', description: 'snow' };
    if ([80,81,82].includes(code)) return { main: 'Rain', description: 'showers' };
    if ([85,86].includes(code)) return { main: 'Snow', description: 'snow showers' };
    if ([95,96,99].includes(code)) return { main: 'Thunderstorm', description: 'thunderstorm' };
    return { main: 'Clear', description: 'clear' };
  }
}

module.exports = new OpenMeteoProvider();

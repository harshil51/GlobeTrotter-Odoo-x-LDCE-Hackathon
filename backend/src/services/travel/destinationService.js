const googleProvider = require('../providers/googleProvider');
const weatherProvider = require('../providers/weatherProvider');
const amadeusProvider = require('../providers/amadeusProvider');
const ninjaProvider = require('../providers/ninjaProvider');
const countriesDevProvider = require('../providers/countriesDevProvider');

class DestinationService {
  async searchDestinations(query) {
    if (!query) return [];
    // Primary search via Google
    const places = await googleProvider.searchPlaces(query);
    
    // We can enrich the first result with weather if requested
    // but typically we do that when they view the destination details.
    return places;
  }

  async getDestinationDetails(placeId) {
    const details = await googleProvider.getPlaceDetails(placeId);
    if (!details) throw new Error('Destination details not found');

    let weather = [];
    if (details.latitude && details.longitude) {
      weather = await weatherProvider.getForecast(details.latitude, details.longitude);
    }

    return {
      ...details,
      weather,
    };
  }

  async getFlights(origin, destination, departureDate, adults) {
    return await amadeusProvider.searchFlights(origin, destination, departureDate, adults);
  }

  async getHotels(cityCode) {
    return await amadeusProvider.searchHotels(cityCode);
  }

  async getCityAndCountryInfo(name) {
    const [cityInfo, countryInfo] = await Promise.all([
      ninjaProvider.getCityInfo(name),
      ninjaProvider.getCountryInfo(name)
    ]);
    return {
      city: cityInfo && cityInfo.length > 0 ? cityInfo[0] : null,
      country: countryInfo && countryInfo.length > 0 ? countryInfo[0] : null
    };
  }

  // --- countries.dev methods ---
  async getCountries() {
    return await countriesDevProvider.getCountries();
  }

  async getCountryDetails(alphaCode) {
    return await countriesDevProvider.getCountryDetails(alphaCode);
  }

  async getCountryCities() {
    return await countriesDevProvider.getCities();
  }
}

module.exports = new DestinationService();

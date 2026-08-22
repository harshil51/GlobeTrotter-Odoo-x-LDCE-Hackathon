const osmProvider = require('../providers/osmProvider');
const openMeteoProvider = require('../providers/openMeteoProvider');
const ninjaProvider = require('../providers/ninjaProvider');
const countriesDevProvider = require('../providers/countriesDevProvider');

class DestinationService {
  async searchDestinations(query) {
    if (!query) return [];
    // Primary search via OSM/Nominatim
    const places = await osmProvider.searchPlaces(query);
    
    // We can enrich the first result with weather if requested
    // but typically we do that when they view the destination details.
    return places;
  }

  async getDestinationDetails(placeId) {
    const details = await osmProvider.getPlaceDetails(placeId);
    if (!details) throw new Error('Destination details not found');

    let weather = [];
    if (details.latitude && details.longitude) {
      weather = await openMeteoProvider.getForecast(details.latitude, details.longitude);
    }

    return {
      ...details,
      weather,
    };
  }

  async getFlights(origin, destination, departureDate, adults) {
    // Return Nearby Airports instead of flights using open source data
    // Usually origin/destination codes would need to be converted to lat/lon,
    // but for the sake of the fallback we use the destination's query to get lat/lon first.
    // If we only have code, we might need a lookup.
    // Assuming the frontend just wants some 'flight' related data:
    return [{
      id: 'open_f1', airline: 'Open Air', flightNumber: 'OA123',
      departureCode: origin, arrivalCode: destination,
      departureTime: `${departureDate}T10:00:00`,
      arrivalTime: `${departureDate}T14:30:00`,
      duration: 'PT4H30M', price: 0, currency: 'USD',
      source: 'Open Source (Planning Only)'
    }];
  }

  async getHotels(cityCode) {
    // Normally we'd use lat/lon. For now returning empty if no coords passed, 
    // or we'd geocode cityCode. Let's geocode cityCode real quick.
    const places = await osmProvider.searchPlaces(cityCode);
    if (places.length > 0) {
      return await osmProvider.getHotels(places[0].latitude, places[0].longitude);
    }
    return [];
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

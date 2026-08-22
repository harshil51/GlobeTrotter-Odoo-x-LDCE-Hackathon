const axios = require('axios');

class AmadeusProvider {
  constructor() {
    this.clientId = process.env.AMADEUS_CLIENT_ID;
    this.clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    this.token = null;
    this.tokenExpiresAt = null;
  }

  async _getAccessToken() {
    if (!this.clientId || !this.clientSecret) return null;
    if (this.token && this.tokenExpiresAt > Date.now()) return this.token;

    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      this.token = response.data.access_token;
      // expire 5 mins early to be safe
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 300) * 1000;
      return this.token;
    } catch (error) {
      console.error('Amadeus Auth Error:', error.message);
      return null;
    }
  }

  async searchFlights(origin, destination, departureDate, adults = 1) {
    const token = await this._getAccessToken();
    if (!token) return this._mockSearchFlights(origin, destination, departureDate);

    try {
      const response = await axios.get(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          params: {
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            adults: adults,
            max: 10,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return this._normalizeFlights(response.data.data);
    } catch (error) {
      console.error('Amadeus Flight Search Error:', error.message);
      return this._mockSearchFlights(origin, destination, departureDate); // fallback gracefully
    }
  }

  async searchHotels(cityCode) {
    const token = await this._getAccessToken();
    if (!token) return this._mockSearchHotels(cityCode);

    try {
      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
        {
          params: { cityCode },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return this._normalizeHotels(response.data.data);
    } catch (error) {
      console.error('Amadeus Hotel Search Error:', error.message);
      return this._mockSearchHotels(cityCode);
    }
  }

  _normalizeFlights(data) {
    if (!data) return [];
    return data.map((offer) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      return {
        id: offer.id,
        airline: segment.carrierCode, // usually needs a dictionary lookup for full name
        flightNumber: segment.carrierCode + segment.number,
        departureCode: segment.departure.iataCode,
        arrivalCode: segment.arrival.iataCode,
        departureTime: segment.departure.at,
        arrivalTime: segment.arrival.at,
        duration: itinerary.duration,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        source: 'Amadeus (Live)',
      };
    });
  }

  _normalizeHotels(data) {
    if (!data) return [];
    return data.slice(0, 10).map((hotel) => ({
      hotelId: hotel.hotelId,
      name: hotel.name,
      rating: hotel.rating || 4,
      latitude: hotel.geoCode?.latitude,
      longitude: hotel.geoCode?.longitude,
      source: 'Amadeus (Live)',
      // Note: Full pricing requires a second call to hotel-offers in Amadeus
      estimatedPrice: 150.00,
      currency: 'USD'
    }));
  }

  _mockSearchFlights(origin, dest, date) {
    return [
      {
        id: 'mock_f1',
        airline: 'Mock Airlines',
        flightNumber: 'MK123',
        departureCode: origin.substring(0, 3).toUpperCase(),
        arrivalCode: dest.substring(0, 3).toUpperCase(),
        departureTime: `${date}T10:00:00`,
        arrivalTime: `${date}T14:30:00`,
        duration: 'PT4H30M',
        price: 8500,
        currency: 'INR',
        source: 'Estimated (Mock)',
      },
    ];
  }

  _mockSearchHotels(city) {
    return [
      {
        hotelId: 'mock_h1',
        name: `Grand ${city} Hotel`,
        rating: 5,
        latitude: 48.85,
        longitude: 2.35,
        estimatedPrice: 12000,
        currency: 'INR',
        source: 'Estimated (Mock)',
      },
    ];
  }
}

module.exports = new AmadeusProvider();

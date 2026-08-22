const axios = require('axios');

class GoogleProvider {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.client = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/place',
    });
  }

  async searchPlaces(query) {
    if (!this.apiKey) return this._mockSearchPlaces(query);

    try {
      const response = await this.client.get('/textsearch/json', {
        params: {
          query,
          key: this.apiKey,
        },
      });
      return this._normalizePlaces(response.data.results);
    } catch (error) {
      console.error('Google Places API Error:', error.message);
      throw new Error('Live destination information is temporarily unavailable.');
    }
  }

  async getPlaceDetails(placeId) {
    if (!this.apiKey) return this._mockPlaceDetails(placeId);
    
    try {
      const response = await this.client.get('/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_phone_number,geometry,photos,url,website,opening_hours,price_level',
          key: this.apiKey,
        },
      });
      return this._normalizeDetails(response.data.result);
    } catch (error) {
      console.error('Google Places Details Error:', error.message);
      return null;
    }
  }

  // Normalizers
  _normalizePlaces(results) {
    return results.map((r) => ({
      placeId: r.place_id,
      name: r.name,
      rating: r.rating || 0,
      userRatingsTotal: r.user_ratings_total || 0,
      latitude: r.geometry?.location?.lat,
      longitude: r.geometry?.location?.lng,
      address: r.formatted_address,
      imageUrl: r.photos && r.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${r.photos[0].photo_reference}&key=${this.apiKey}`
        : null,
      source: 'Google Places',
    }));
  }

  _normalizeDetails(result) {
    return {
      name: result.name,
      rating: result.rating,
      latitude: result.geometry?.location?.lat,
      longitude: result.geometry?.location?.lng,
      url: result.url,
      website: result.website,
      phone: result.formatted_phone_number,
      priceLevel: result.price_level,
      openNow: result.opening_hours?.open_now,
      weekdayText: result.opening_hours?.weekday_text,
    };
  }

  // Fallback Logic for Hackathon
  _mockSearchPlaces(query) {
    console.log('[GoogleProvider] Mocking search for', query);
    return [
      {
        placeId: 'mock_' + Math.random().toString(36).substring(7),
        name: `${query} Central Area`,
        rating: 4.5,
        userRatingsTotal: 1200,
        latitude: 48.8566,
        longitude: 2.3522,
        address: `Central ${query}`,
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        source: 'Mock Provider (No API Key)',
      }
    ];
  }

  _mockPlaceDetails(placeId) {
    return {
      name: `Mock Place Details (${placeId})`,
      rating: 4.8,
      latitude: 48.8566,
      longitude: 2.3522,
      priceLevel: 2,
      openNow: true,
    };
  }
}

module.exports = new GoogleProvider();

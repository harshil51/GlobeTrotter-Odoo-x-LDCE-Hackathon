const axios = require('axios');

class OsmProvider {
  constructor() {
    this.nominatimClient = axios.create({
      baseURL: 'https://nominatim.openstreetmap.org',
      headers: { 'User-Agent': 'GlobeTrotterTravelApp/1.0' }
    });
    this.overpassClient = axios.create({
      baseURL: 'https://overpass-api.de/api',
    });
  }

  async searchPlaces(query) {
    if (query === 'popular destinations' || query === '') {
      return this._getCuratedPlaces();
    }
    
    try {
      const response = await this.nominatimClient.get('/search', {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          featuretype: 'city', // Try to get cities mostly
        }
      });
      return await this._normalizePlaces(response.data);
    } catch (error) {
      console.error('Nominatim API Error:', error.message);
      return [];
    }
  }

  async getPlaceDetails(placeId) {
    try {
      // Nominatim Place ID is an osm_id, but it's easier to just search by osm_id or osm_type + osm_id.
      // If we just have place_id from Nominatim search, we can use the /details endpoint.
      const response = await this.nominatimClient.get('/details', {
        params: {
          place_id: placeId,
          format: 'json',
        }
      });
      return this._normalizeDetails(response.data);
    } catch (error) {
      console.error('Nominatim Details Error:', error.message);
      return null;
    }
  }

  async getAirports(lat, lon) {
    try {
      const query = `[out:json][timeout:10];node["aeroway"="aerodrome"](around:50000,${lat},${lon});out 5;`;
      const response = await this.overpassClient.post('/interpreter', query, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return this._normalizeAirports(response.data.elements);
    } catch (error) {
      console.error('Overpass Airports Error:', error.message);
      return [];
    }
  }

  async getHotels(lat, lon) {
    try {
      const query = `[out:json][timeout:10];node["tourism"="hotel"](around:10000,${lat},${lon});out 10;`;
      const response = await this.overpassClient.post('/interpreter', query, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return this._normalizeHotels(response.data.elements);
    } catch (error) {
      console.error('Overpass Hotels Error:', error.message);
      return [];
    }
  }

  async _normalizePlaces(results) {
    const places = [];
    for (const r of results) {
      const name = r.name || r.display_name.split(',')[0];
      // Fetch a thumbnail from wikipedia since it's free
      let imageUrl = null;
      try {
        const wikiRes = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: { action: 'query', titles: name, prop: 'pageimages', format: 'json', pithumbsize: 800, origin: '*' }
        });
        const pages = wikiRes.data.query.pages;
        const page = Object.values(pages)[0];
        if (page && page.thumbnail) {
          imageUrl = page.thumbnail.source;
        }
      } catch(e) {}
      
      places.push({
        placeId: r.place_id,
        name: name,
        rating: 4.5,
        userRatingsTotal: 1000,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        address: r.display_name,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        source: 'OpenStreetMap',
      });
    }
    return places;
  }

  _normalizeDetails(result) {
    if (!result) return null;
    return {
      name: result.localname || result.names?.name,
      rating: 4.5,
      latitude: result.centroid?.coordinates[1],
      longitude: result.centroid?.coordinates[0],
      url: result.extratags?.website,
      website: result.extratags?.website,
      phone: result.extratags?.phone,
      priceLevel: 2,
      openNow: true,
      source: 'OpenStreetMap'
    };
  }

  _normalizeAirports(elements) {
    if (!elements) return [];
    return elements.map(el => ({
      id: el.id,
      name: el.tags?.name || 'Local Airport',
      iata: el.tags?.iata || '',
      latitude: el.lat,
      longitude: el.lon,
      type: 'Airport',
      source: 'OpenStreetMap / Overpass'
    }));
  }

  _normalizeHotels(elements) {
    if (!elements) return [];
    return elements.map(el => ({
      hotelId: el.id,
      name: el.tags?.name || 'Local Hotel',
      rating: 4.0,
      latitude: el.lat,
      longitude: el.lon,
      estimatedPrice: 150.00,
      currency: 'USD',
      source: 'OpenStreetMap / Overpass'
    }));
  }

  _getCuratedPlaces() {
    return [
      {
        placeId: 'mock_paris', name: 'Paris', address: 'France', rating: 4.8, userRatingsTotal: 45000,
        latitude: 48.8566, longitude: 2.3522, imageUrl: 'https://images.unsplash.com/photo-1502602881460-5ba5550a1bc6?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      },
      {
        placeId: 'mock_tokyo', name: 'Tokyo', address: 'Japan', rating: 4.9, userRatingsTotal: 62000,
        latitude: 35.6762, longitude: 139.6503, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      },
      {
        placeId: 'mock_nyc', name: 'New York City', address: 'United States', rating: 4.7, userRatingsTotal: 89000,
        latitude: 40.7128, longitude: -74.0060, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      },
      {
        placeId: 'mock_rome', name: 'Rome', address: 'Italy', rating: 4.8, userRatingsTotal: 34000,
        latitude: 41.9028, longitude: 12.4964, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      },
      {
        placeId: 'mock_dubai', name: 'Dubai', address: 'UAE', rating: 4.6, userRatingsTotal: 25000,
        latitude: 25.2048, longitude: 55.2708, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      },
      {
        placeId: 'mock_sydney', name: 'Sydney', address: 'Australia', rating: 4.8, userRatingsTotal: 18000,
        latitude: -33.8688, longitude: 151.2093, imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', source: 'Curated'
      }
    ];
  }
}

module.exports = new OsmProvider();

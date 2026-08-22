const express = require('express');
const destinationService = require('../services/travel/destinationService');
const itineraryService = require('../services/travel/itineraryService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 1. Destinations & Places
router.get('/destinations/search', async (req, res) => {
  try {
    const { q } = req.query;
    const places = await destinationService.searchDestinations(q);
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, sourceUnavailable: true, message: error.message });
  }
});

router.get('/places/:id', async (req, res) => {
  try {
    const details = await destinationService.getDestinationDetails(req.params.id);
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: error.message });
  }
});

router.get('/info', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const info = await destinationService.getCityAndCountryInfo(name);
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: 'Additional info temporarily unavailable.' });
  }
});

// --- Countries.dev API ---
router.get('/countries', async (req, res) => {
  try {
    const countries = await destinationService.getCountries();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: 'Countries data temporarily unavailable.' });
  }
});

router.get('/countries/:code', async (req, res) => {
  try {
    const country = await destinationService.getCountryDetails(req.params.code);
    res.json(country);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: 'Country details temporarily unavailable.' });
  }
});

// 2. Live Flights & Hotels
router.get('/flights', async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.query;
    const flights = await destinationService.getFlights(origin, destination, departureDate, adults || 1);
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: 'Flight data temporarily unavailable.' });
  }
});

router.get('/hotels', async (req, res) => {
  try {
    const { cityCode } = req.query;
    const hotels = await destinationService.getHotels(cityCode);
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(503).json({ success: false, message: 'Hotel data temporarily unavailable.' });
  }
});

// 3. Smart Trip Generation (Protected)
router.post('/generate-plan', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const requestData = req.body; 
    // Expects: { name, origin, destinations: [], startDate, endDate, budget, travelers, interests: [], travelStyle }

    const result = await itineraryService.generateTripPlan(userId, requestData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to generate itinerary. ' + error.message });
  }
});

// Get generated plan
router.get('/plan/:tripId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await itineraryService.getSavedPlan(req.params.tripId, userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
});

module.exports = router;

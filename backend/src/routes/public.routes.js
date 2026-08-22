const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');
const authMiddleware = require('../middleware/auth');

router.get('/trips', publicController.getCommunityTrips);
router.get('/trips/:shareToken', publicController.getPublicTrip);

router.post('/trips/:tripId/share', authMiddleware, publicController.shareTrip);
router.post('/trips/:tripId/unshare', authMiddleware, publicController.unshareTrip);
router.post('/trips/:shareToken/copy', authMiddleware, publicController.duplicateTrip);

module.exports = router;

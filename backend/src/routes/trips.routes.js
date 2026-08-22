const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { createTripSchema, updateTripSchema } = require('../validators/trip.schema');
const { getBudget } = require('../controllers/expenses.controller');

router.use(authMiddleware);

router.post('/', validate(createTripSchema), tripsController.createTrip);
router.get('/', tripsController.getTrips);
router.get('/:id', tripsController.getTripById);
router.get('/:tripId/budget', getBudget);
router.put('/:id', validate(updateTripSchema), tripsController.updateTrip);
router.delete('/:id', tripsController.deleteTrip);

module.exports = router;

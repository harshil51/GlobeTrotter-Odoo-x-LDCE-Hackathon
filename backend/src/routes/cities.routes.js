const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/cities.controller');

router.get('/', citiesController.searchCities);
router.get('/:id/activities', citiesController.getCityActivities);

module.exports = router;

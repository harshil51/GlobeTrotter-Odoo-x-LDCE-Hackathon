const express = require('express');
const router = express.Router();
const stopsController = require('../controllers/stops.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { addStopSchema, updateStopSchema, reorderStopsSchema } = require('../validators/stop.schema');

router.use(authMiddleware);

router.post('/', validate(addStopSchema), stopsController.addStop);
router.put('/reorder', validate(reorderStopsSchema), stopsController.reorderStops);
router.put('/:id', validate(updateStopSchema), stopsController.updateStop);
router.delete('/:id', stopsController.deleteStop);

module.exports = router;

const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { addActivitySchema, updateActivitySchema } = require('../validators/activity.schema');

router.use(authMiddleware);

router.post('/', validate(addActivitySchema), activitiesController.addActivity);
router.put('/:id', validate(updateActivitySchema), activitiesController.updateActivity);
router.delete('/:id', activitiesController.deleteActivity);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.get('/stats', adminController.getAdminStats);

module.exports = router;

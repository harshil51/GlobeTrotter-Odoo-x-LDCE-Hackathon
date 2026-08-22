const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }
  next();
};

router.use(authMiddleware);
router.use(adminMiddleware);
router.get('/stats', adminController.getAdminStats);

module.exports = router;

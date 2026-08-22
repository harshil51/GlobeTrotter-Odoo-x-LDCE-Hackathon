const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/auth.schema');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;

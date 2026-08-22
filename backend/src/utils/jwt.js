const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role || 'USER' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = { generateToken };

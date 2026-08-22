const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../utils/prismaClient');
const { generateToken } = require('../utils/jwt');
const asyncHandler = require('express-async-handler');

const sanitizeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  phone: user.phone,
  city: user.city,
  country: user.country,
  language: user.language,
  profilePhoto: user.profilePhoto,
  bio: user.bio,
  createdAt: user.createdAt,
});

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, city, country } = req.validatedData;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      phone,
      city,
      country,
      emailVerified: true, // Auto-verify for hackathon local dev convenience
      emailVerificationToken,
      emailVerificationExpires,
    },
  });

  const token = generateToken(user);
  res.status(201).json({
    message: 'Account created successfully.',
    user: sanitizeUser(user),
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Account lockout check
  if (user && user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const minutesLeft = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
    return res.status(429).json({
      error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesLeft} minute(s).`,
    });
  }

  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isPasswordValid) {
    if (user) {
      const attempts = user.loginAttempts + 1;
      const lock = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 min lock
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts >= 5 ? 0 : attempts,
          lockedUntil: lock,
        },
      });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  }

  const token = generateToken(user);
  res.status(200).json({
    user: sanitizeUser(user),
    token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(sanitizeUser(user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.validatedData,
  });
  res.json(sanitizeUser(user));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired email verification token.' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  res.json({ message: 'Email verified successfully.' });
});

module.exports = { register, login, getMe, updateProfile, verifyEmail };

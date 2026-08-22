const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');
const { generateToken } = require('../utils/jwt');
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, city, country } = req.validatedData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash, phone, city, country },
    select: { id: true, firstName: true, email: true },
  });

  const token = generateToken(user);
  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  const userResponse = { id: user.id, firstName: user.firstName, email: user.email };
  res.status(200).json({ user: userResponse, token });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      city: true, country: true, language: true, profilePhoto: true, createdAt: true,
    },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.validatedData,
    select: {
      id: true, firstName: true, lastName: true, email: true,
      city: true, country: true, language: true, profilePhoto: true, bio: true,
    },
  });
  res.json(user);
});

module.exports = { register, login, getMe, updateProfile };

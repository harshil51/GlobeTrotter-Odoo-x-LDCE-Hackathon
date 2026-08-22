const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');
const { createShareToken, copyTrip } = require('../services/share.service');

const getCommunityTrips = asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { firstName: true, lastName: true, city: true, country: true, profilePhoto: true } },
      stops: {
        include: { city: true },
        orderBy: { position: 'asc' }
      },
      _count: { select: { stops: true, expenses: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(trips);
});

const shareTrip = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.params.tripId);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  
  if (!trip || trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  
  let token = trip.shareToken;
  if (!token) {
    token = await createShareToken(tripId);
  } else {
    await prisma.trip.update({ where: { id: tripId }, data: { isPublic: true } });
  }

  res.json({ shareToken: token });
});

const unshareTrip = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.params.tripId);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  
  if (!trip || trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  
  await prisma.trip.update({
    where: { id: tripId },
    data: { isPublic: false, shareToken: null }
  });

  res.json({ message: 'Trip unshared' });
});

const getPublicTrip = asyncHandler(async (req, res) => {
  const { shareToken } = req.params;
  const trip = await prisma.trip.findUnique({
    where: { shareToken },
    include: {
      user: { select: { firstName: true, lastName: true, profilePhoto: true, city: true, country: true } },
      stops: {
        include: {
          city: true,
          tripActivities: {
            include: { activity: true },
            orderBy: [{ date: 'asc' }, { position: 'asc' }]
          }
        },
        orderBy: { position: 'asc' }
      },
      expenses: true
    }
  });

  if (!trip || !trip.isPublic) return res.status(404).json({ error: 'Public trip not found' });
  res.json(trip);
});

const duplicateTrip = asyncHandler(async (req, res) => {
  const { shareToken } = req.params;
  const newUserId = req.user.id; // user who is copying
  
  const newTrip = await copyTrip(shareToken, newUserId);
  res.status(201).json(newTrip);
});

module.exports = { getCommunityTrips, shareTrip, unshareTrip, getPublicTrip, duplicateTrip };

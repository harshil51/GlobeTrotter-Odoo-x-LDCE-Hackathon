const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const createTrip = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate, coverPhoto, totalBudget } = req.validatedData;
  const trip = await prisma.trip.create({
    data: {
      userId: req.user.id,
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      coverPhoto,
      totalBudget
    }
  });
  res.status(201).json(trip);
});

const getTrips = asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    include: {
      _count: { select: { stops: true } }
    },
    orderBy: { startDate: 'asc' }
  });

  const formattedTrips = trips.map(trip => ({
    ...trip,
    stopCount: trip._count.stops,
    _count: undefined,
    status: new Date(trip.endDate) < new Date() ? 'completed' 
          : new Date(trip.startDate) > new Date() ? 'upcoming' 
          : 'ongoing'
  }));
  res.json(formattedTrips);
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      stops: {
        include: {
          city: true,
          tripActivities: {
            include: { activity: true },
            orderBy: [{ date: 'asc' }, { position: 'asc' }]
          }
        },
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  res.json(trip);
});

const updateTrip = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { name, description, startDate, endDate, coverPhoto, totalBudget } = req.validatedData;
  
  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      name,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      coverPhoto,
      totalBudget
    }
  });
  res.json(updatedTrip);
});

const deleteTrip = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  await prisma.trip.delete({ where: { id: tripId } });
  res.json({ message: 'Trip deleted' });
});

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip };

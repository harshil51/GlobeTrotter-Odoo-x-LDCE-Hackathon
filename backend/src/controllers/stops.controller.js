const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const verifyTripOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return trip;
};

const addStop = asyncHandler(async (req, res) => {
  const { tripId, cityId, startDate, endDate, position, notes } = req.validatedData;
  await verifyTripOwnership(tripId, req.user.id);
  
  const stop = await prisma.stop.create({
    data: {
      tripId, cityId, 
      startDate: new Date(startDate), 
      endDate: new Date(endDate), 
      position: position || 0, 
      notes
    },
    include: { city: true }
  });
  res.status(201).json(stop);
});

const updateStop = asyncHandler(async (req, res) => {
  const stopId = parseInt(req.params.id);
  const stop = await prisma.stop.findUnique({ where: { id: stopId } });
  if (!stop) return res.status(404).json({ error: 'Stop not found' });
  await verifyTripOwnership(stop.tripId, req.user.id);

  const { startDate, endDate, notes } = req.validatedData;
  const updatedStop = await prisma.stop.update({
    where: { id: stopId },
    data: {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      notes
    },
    include: { city: true }
  });
  res.json(updatedStop);
});

const deleteStop = asyncHandler(async (req, res) => {
  const stopId = parseInt(req.params.id);
  const stop = await prisma.stop.findUnique({ where: { id: stopId } });
  if (!stop) return res.status(404).json({ error: 'Stop not found' });
  await verifyTripOwnership(stop.tripId, req.user.id);

  await prisma.stop.delete({ where: { id: stopId } });
  res.json({ message: 'Stop deleted' });
});

const reorderStops = asyncHandler(async (req, res) => {
  const { stops } = req.validatedData;
  
  // Verify all stops belong to a trip owned by user
  if (stops.length > 0) {
    const firstStop = await prisma.stop.findUnique({ where: { id: stops[0].id } });
    if (!firstStop) return res.status(404).json({ error: 'Stop not found' });
    await verifyTripOwnership(firstStop.tripId, req.user.id);
  }

  const updates = stops.map(({ id, position }) =>
    prisma.stop.update({ where: { id }, data: { position } })
  );
  await prisma.$transaction(updates);
  res.json({ message: 'Stops reordered' });
});

module.exports = { addStop, updateStop, deleteStop, reorderStops };

const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const verifyStopOwnership = async (stopId, userId) => {
  const stop = await prisma.stop.findUnique({ 
    where: { id: stopId },
    include: { trip: true }
  });
  if (!stop || stop.trip.userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return stop;
};

const verifyActivityOwnership = async (tripActivityId, userId) => {
  const tripActivity = await prisma.tripActivity.findUnique({
    where: { id: tripActivityId },
    include: { stop: { include: { trip: true } } }
  });
  if (!tripActivity || tripActivity.stop.trip.userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return tripActivity;
};

const addActivity = asyncHandler(async (req, res) => {
  const { stopId, activityId, date, position } = req.validatedData;
  await verifyStopOwnership(stopId, req.user.id);
  
  const tripActivity = await prisma.tripActivity.create({
    data: {
      stopId, activityId, 
      date: new Date(date), 
      position: position || 0
    },
    include: { activity: true }
  });
  res.status(201).json(tripActivity);
});

const updateActivity = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await verifyActivityOwnership(id, req.user.id);

  const { date, startTime, durationOverride, customCost, notes } = req.validatedData;
  const updated = await prisma.tripActivity.update({
    where: { id },
    data: {
      date: date ? new Date(date) : undefined,
      startTime: startTime ? new Date(`1970-01-01T${startTime}Z`) : undefined,
      durationOverride,
      customCost,
      notes
    },
    include: { activity: true }
  });
  res.json(updated);
});

const deleteActivity = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await verifyActivityOwnership(id, req.user.id);
  
  await prisma.tripActivity.delete({ where: { id } });
  res.json({ message: 'Activity removed' });
});

module.exports = { addActivity, updateActivity, deleteActivity };

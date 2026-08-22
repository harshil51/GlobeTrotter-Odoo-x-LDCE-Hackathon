const prisma = require('../utils/prismaClient');
const crypto = require('crypto');

const createShareToken = async (tripId) => {
  const token = crypto.randomUUID();
  await prisma.trip.update({
    where: { id: tripId },
    data: { shareToken: token, isPublic: true }
  });
  return token;
};

const copyTrip = async (shareToken, newUserId) => {
  const sourceTrip = await prisma.trip.findUnique({
    where: { shareToken },
    include: {
      stops: {
        include: { tripActivities: true }
      }
    }
  });

  if (!sourceTrip) throw new Error('Trip not found or not public');

  // Deep copy transaction
  return await prisma.$transaction(async (tx) => {
    const newTrip = await tx.trip.create({
      data: {
        userId: newUserId,
        name: `Copy of ${sourceTrip.name}`,
        description: sourceTrip.description,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        coverPhoto: sourceTrip.coverPhoto,
        totalBudget: sourceTrip.totalBudget, // Retain the same budget target
        isPublic: false,
        shareToken: null
      }
    });

    for (const stop of sourceTrip.stops) {
      const newStop = await tx.stop.create({
        data: {
          tripId: newTrip.id,
          cityId: stop.cityId,
          startDate: stop.startDate,
          endDate: stop.endDate,
          position: stop.position,
          notes: stop.notes
        }
      });

      for (const activity of stop.tripActivities) {
        await tx.tripActivity.create({
          data: {
            stopId: newStop.id,
            activityId: activity.activityId,
            date: activity.date,
            startTime: activity.startTime,
            durationOverride: activity.durationOverride,
            customCost: activity.customCost,
            position: activity.position,
            notes: activity.notes
          }
        });
      }
    }

    return newTrip;
  });
};

module.exports = { createShareToken, copyTrip };

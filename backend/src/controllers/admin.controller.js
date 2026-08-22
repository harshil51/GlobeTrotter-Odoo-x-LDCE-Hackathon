const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalTrips = await prisma.trip.count();
  const totalStops = await prisma.stop.count();
  const totalActivities = await prisma.tripActivity.count();
  const totalExpenses = await prisma.expense.count();

  const trips = await prisma.trip.findMany({
    select: { startDate: true, endDate: true, totalBudget: true }
  });

  const now = new Date();
  let upcoming = 0, ongoing = 0, completed = 0, totalBudgetSum = 0;
  trips.forEach(t => {
    totalBudgetSum += parseFloat(t.totalBudget || 0);
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    if (end < now) completed++;
    else if (start > now) upcoming++;
    else ongoing++;
  });

  const popularCities = await prisma.city.findMany({
    take: 6,
    orderBy: { popularity: 'desc' },
    include: { _count: { select: { stops: true, activities: true } } }
  });

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      city: true,
      country: true,
      createdAt: true,
      _count: { select: { trips: true } }
    }
  });

  res.json({
    totalUsers,
    totalTrips,
    totalStops,
    totalActivities,
    totalExpenses,
    tripStatus: { upcoming, ongoing, completed },
    averageBudget: totalTrips > 0 ? Math.round(totalBudgetSum / totalTrips) : 0,
    popularCities,
    recentUsers
  });
});

module.exports = { getAdminStats };

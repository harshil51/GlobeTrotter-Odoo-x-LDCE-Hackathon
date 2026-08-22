const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const searchCities = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.query;
  const cities = await prisma.city.findMany({
    where: query ? { name: { contains: query } } : undefined,
    take: parseInt(limit),
    orderBy: { popularity: 'desc' }
  });
  res.json(cities);
});

const getCityActivities = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.id);
  const { category } = req.query;

  const activities = await prisma.activity.findMany({
    where: {
      cityId,
      ...(category ? { category } : {})
    },
    orderBy: { name: 'asc' }
  });

  res.json(activities);
});

module.exports = { searchCities, getCityActivities };

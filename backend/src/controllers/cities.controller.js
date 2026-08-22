const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');

const searchCities = asyncHandler(async (req, res) => {
  const { query, country, limit = 50 } = req.query;
  
  const whereClause = {};
  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { country: { contains: query } },
      { region: { contains: query } }
    ];
  }
  if (country && country !== 'All') {
    whereClause.country = country;
  }

  const cities = await prisma.city.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    take: parseInt(limit) || 50,
    include: {
      _count: { select: { activities: true, stops: true } }
    },
    orderBy: { popularity: 'desc' }
  });
  res.json(cities);
});

const getCityById = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.id);
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: {
      activities: true,
      _count: { select: { stops: true } }
    }
  });
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json(city);
});

const getCityActivities = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.id);
  const { category } = req.query;

  const activities = await prisma.activity.findMany({
    where: {
      cityId,
      ...(category && category !== 'All' ? { category } : {})
    },
    include: { city: true },
    orderBy: { name: 'asc' }
  });

  res.json(activities);
});

const getAllActivities = asyncHandler(async (req, res) => {
  const { query, category, limit = 100 } = req.query;
  const whereClause = {};

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { locationName: { contains: query } },
      { city: { name: { contains: query } } }
    ];
  }
  if (category && category !== 'All') {
    whereClause.category = category;
  }

  const activities = await prisma.activity.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    take: parseInt(limit) || 100,
    include: { city: true },
    orderBy: { name: 'asc' }
  });

  res.json(activities);
});

module.exports = { searchCities, getCityById, getCityActivities, getAllActivities };

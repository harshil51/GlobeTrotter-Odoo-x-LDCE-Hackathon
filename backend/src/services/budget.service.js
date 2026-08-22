const prisma = require('../utils/prismaClient');

const calculateBudget = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      expenses: true,
      stops: {
        include: {
          tripActivities: {
            include: { activity: true }
          }
        }
      }
    }
  });

  if (!trip) throw new Error('Trip not found');

  const totalBudget = parseFloat(trip.totalBudget || 0);

  let totalEstimated = 0;
  const estimatedByCategory = {};

  trip.stops.forEach(stop => {
    stop.tripActivities.forEach(ta => {
      const cost = parseFloat(ta.customCost ?? ta.activity.estimatedCost);
      totalEstimated += cost;
      
      const cat = ta.activity.category;
      estimatedByCategory[cat] = (estimatedByCategory[cat] || 0) + cost;
    });
  });

  let totalActual = 0;
  const actualByCategory = {};

  trip.expenses.forEach(exp => {
    const amount = parseFloat(exp.amount);
    totalActual += amount;

    const cat = exp.category;
    actualByCategory[cat] = (actualByCategory[cat] || 0) + amount;
  });

  const remainingBudget = totalBudget - Math.max(totalEstimated, totalActual);
  const isOverBudget = remainingBudget < 0;
  const overBudgetBy = isOverBudget ? Math.abs(remainingBudget) : 0;

  return {
    totalBudget,
    totalEstimated,
    totalActual,
    remainingBudget,
    isOverBudget,
    overBudgetBy,
    byCategory: {
      estimated: estimatedByCategory,
      actual: actualByCategory
    }
  };
};

module.exports = { calculateBudget };

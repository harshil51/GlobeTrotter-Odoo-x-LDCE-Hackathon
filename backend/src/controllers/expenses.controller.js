const prisma = require('../utils/prismaClient');
const asyncHandler = require('express-async-handler');
const { calculateBudget } = require('../services/budget.service');

const verifyTripOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) throw new Error('Forbidden');
  return trip;
};

const getBudget = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.params.tripId);
  await verifyTripOwnership(tripId, req.user.id);
  
  const budget = await calculateBudget(tripId);
  res.json(budget);
});

const getExpenses = asyncHandler(async (req, res) => {
  const tripId = parseInt(req.query.tripId);
  if (!tripId) return res.status(400).json({ error: 'tripId is required' });
  
  await verifyTripOwnership(tripId, req.user.id);
  
  const expenses = await prisma.expense.findMany({
    where: { tripId },
    orderBy: { date: 'desc' }
  });
  res.json(expenses);
});

const addExpense = asyncHandler(async (req, res) => {
  const { tripId, stopId, category, amount, description, date } = req.validatedData;
  await verifyTripOwnership(tripId, req.user.id);
  
  const expense = await prisma.expense.create({
    data: {
      tripId, stopId, category, amount, description, 
      date: new Date(date)
    }
  });
  res.status(201).json(expense);
});

const updateExpense = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  await verifyTripOwnership(expense.tripId, req.user.id);
  
  const updated = await prisma.expense.update({
    where: { id },
    data: req.validatedData
  });
  res.json(updated);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  await verifyTripOwnership(expense.tripId, req.user.id);
  
  await prisma.expense.delete({ where: { id } });
  res.json({ message: 'Expense deleted' });
});

module.exports = { getBudget, getExpenses, addExpense, updateExpense, deleteExpense };

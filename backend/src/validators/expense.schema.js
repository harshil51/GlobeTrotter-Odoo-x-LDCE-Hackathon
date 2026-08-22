const { z } = require('zod');

const expenseSchema = z.object({
  tripId: z.number().int().positive(),
  stopId: z.number().int().positive().nullable().optional(),
  category: z.enum(['TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'OTHER']),
  amount: z.number().min(0),
  description: z.string().max(255).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

module.exports = { expenseSchema };

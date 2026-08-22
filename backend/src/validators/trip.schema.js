const { z } = require('zod');

const createTripSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  coverPhoto: z.string().url().optional(),
  totalBudget: z.number().min(0).optional().default(0)
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be on or after start date',
  path: ['endDate']
});

const updateTripSchema = createTripSchema.partial();

module.exports = { createTripSchema, updateTripSchema };

const { z } = require('zod');

const addStopSchema = z.object({
  tripId: z.number().int().positive(),
  cityId: z.number().int().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  position: z.number().int().min(0).optional(),
  notes: z.string().optional()
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be on or after start date',
  path: ['endDate']
});

const updateStopSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().optional()
});

const reorderStopsSchema = z.object({
  stops: z.array(z.object({
    id: z.number().int().positive(),
    position: z.number().int().min(0)
  }))
});

module.exports = { addStopSchema, updateStopSchema, reorderStopsSchema };

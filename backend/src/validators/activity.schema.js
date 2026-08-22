const { z } = require('zod');

const addActivitySchema = z.object({
  stopId: z.number().int().positive(),
  activityId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  position: z.number().int().min(0).optional()
});

const updateActivitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().optional(),
  durationOverride: z.number().int().positive().optional(),
  customCost: z.number().min(0).optional(),
  notes: z.string().optional()
});

module.exports = { addActivitySchema, updateActivitySchema };

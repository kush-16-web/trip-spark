import { z } from 'zod';

export const tripPlanRequestSchema = z.object({
  Destination: z
    .string()
    .trim()
    .min(1, 'Destination is required')
    .max(120, 'Destination is too long'),

  days: z
    .coerce
    .number({
      error: 'days must be a number',
    })
    .int('days must be an integer')
    .min(1, 'days must be at least 1')
    .max(30, 'days must be at most 30'),

  travelers: z
    .coerce
    .number({
      error: 'travelers must be a number',
    })
    .int('travelers must be an integer')
    .min(1, 'travelers must be at least 1')
    .max(20, 'travelers must be at most 20'),

  budgetRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  type: z.string().trim().min(1, 'type is required'),
  placeStyle: z
    .enum(['hidden_gems', 'balanced', 'must_see'], {
      error: 'placeStyle must be hidden_gems, balanced, or must_see',
    })
    .optional(),
  startDate: z.string().trim().min(1, 'startDate is required'),
  endDate: z.string().trim().min(1, 'endDate is required'),
  vibe: z.string().trim().max(120, 'vibe is too long').optional(),
});

export type TripPlanRequest = z.infer<typeof tripPlanRequestSchema>;
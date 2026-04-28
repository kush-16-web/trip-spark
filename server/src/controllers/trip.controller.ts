import type { Request, Response } from 'express';
import type { TripPlanRequest } from '../types/trip.types';
import { tripPlanRequestSchema } from '../validators/trip.validator';
import { generateTripPlan } from '../services/ai.service';
import { getWeatherForecast } from '../services/weather.service';

export const planTrip = async (
  req: Request<unknown, unknown, TripPlanRequest>,
  res: Response,
)=> {
  try {
    const { Destination, days, budget, travelers, type, vibe, startDate, endDate } = req.body;
    const validatedInput = tripPlanRequestSchema.parse({
      Destination,
      days,
      budget,
      travelers,
      type,
      vibe,
      startDate,
      endDate,
    });

    console.info('[trip.controller] Planning trip', {
      destination: validatedInput.Destination,
      days: validatedInput.days,
      travelers: validatedInput.travelers,
      budget: validatedInput.budget,
      type: validatedInput.type,
    });

    const plan = await generateTripPlan(validatedInput);
  
    const weather = await getWeatherForecast(validatedInput.Destination, validatedInput.startDate, validatedInput.endDate);

    return res.status(200).json({
      ok: true,
      message: 'Plan created successfully',
      plan,
      weather,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to plan trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to generate trip plan right now. Please try again.',
    });
  }
};
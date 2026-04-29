import type { Request, Response } from 'express';
import type { TripPlanRequest } from '../types/trip.types';
import { Prisma } from '../generated/prisma/client';
import { tripPlanRequestSchema } from '../validators/trip.validator';
import { generateTripPlan } from '../services/ai.service';
import { getWeatherForecast } from '../services/weather.service';
import { prisma } from '../lib/prisma';

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

    const savedTrip = await prisma.tripPlan.create({
      data: {
        destination: validatedInput.Destination,
        startDate: validatedInput.startDate,
        endDate: validatedInput.endDate,
        plan: plan as unknown as Prisma.InputJsonValue,
        weather:
          weather === null
            ? Prisma.JsonNull
            : (weather as unknown as Prisma.InputJsonValue),
        isPublic: true,
      },
    });


    return res.status(200).json({
      ok: true,
      message: 'Plan created successfully',
      plan,
      weather,
      tripId: savedTrip.id,
      shareId: savedTrip.shareId,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to plan trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to generate trip plan right now. Please try again.',
    });
  }
};

export const getMyTrips = async (_req: Request, res: Response) => {
  try{
    const trips = await prisma.tripPlan.findMany({
      orderBy: {createdAt: 'desc'},
      select: {
        id: true,
        shareId: true,
        destination: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      }
    })

    return res.status(200).json({
      ok: true,
      message: 'Trips fetched successfully',
      trips,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to get trips:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to get trips right now. Please try again.',
    });
  }
}

export const getTripById = async (req: Request<{ id: string }>, res: Response) => {
  try{
    const { id } = req.params;

    const trip = await prisma.tripPlan.findUnique({
      where: { id },

      select: {
        id: true,
        shareId: true,
        destination: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        isPublic: true,
        plan: true,
        weather: true,
      },
    })

    if(!trip) {
      return res.status(404).json({
        ok: false,
        message: 'Trip not found',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Trip fetched successfully',
      trip,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to get trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to get trip right now. Please try again.',
    });
  }
}
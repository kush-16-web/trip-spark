import type { Response, Request } from 'express';
import type { TripPlanRequest } from '../types/trip.types';
import { Prisma } from '../generated/prisma/client';
import { tripPlanRequestSchema } from '../validators/trip.validator';
import { generateTripPlan, refineTripWithAI } from '../services/ai.service';
import { getWeatherForecast } from '../services/weather.service';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ok } from 'node:assert';

export const planTrip = async (
  req: AuthRequest,
  res: Response,
)=> {
  try {
    const { Destination, days, budgetRange, travelers, type, placeStyle, vibe, startDate, endDate } = req.body;
    const validatedInput = tripPlanRequestSchema.parse({
      Destination,
      days,
      budgetRange,
      travelers,
      type,
      placeStyle,
      vibe,
      startDate,
      endDate,
    });

    console.info('[trip.controller] Planning trip', {
      destination: validatedInput.Destination,
      days: validatedInput.days,
      travelers: validatedInput.travelers,
      budgetRange: validatedInput.budgetRange,
      type: validatedInput.type,
    });

    const plan = await generateTripPlan(validatedInput);
  
    const weather = await getWeatherForecast(validatedInput.Destination, validatedInput.startDate, validatedInput.endDate);

    const savedTrip = await prisma.tripPlan.create({
      data: {
        destination: validatedInput.Destination,
        days: validatedInput.days,
        travelers: validatedInput.travelers,
        type: validatedInput.type,
        startDate: validatedInput.startDate,
        endDate: validatedInput.endDate,
        plan: plan as unknown as Prisma.InputJsonValue,
        weather: weather ? (weather as unknown as Prisma.InputJsonValue) : undefined,
        isPublic: true,
        ownerId: req.userId || null,
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

export const getMyTrips = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.userId;
    const trips = await prisma.tripPlan.findMany({
      where: { ownerId: userId },
      orderBy: {createdAt: 'desc'},
      select: {
        id: true,
        shareId: true,
        type: true,
        destination: true,
        days: true,
        travelers: true,
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
        days: true,
        travelers: true,
        type: true,
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

export const getTripByShareId = async (req: Request<{ shareId: string }>, res: Response) =>{
try {
  const {shareId} = req.params;
  const trip = await prisma.tripPlan.findUnique({
    where: { shareId },
    select: {
      id: true,
      shareId: true,
      destination: true,
      days: true,
      travelers: true,
      type: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true,
      plan: true,
      weather: true,
    },
  })
  if(!trip){
    return res.status(404).json({
      ok: false, message: 'Trip not found',
    })
  }

  if(!trip.isPublic){
    return res.status(403).json({
      ok: false, message: 'Trip is not public',
    })
  }

  return res.status(200).json({
    ok: true,
    message: 'Trip fetched successfully',
    trip,
  })
} catch (error) {
  console.error('[trip.controller] Failed to get trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to get trip right now. Please try again.',
    });
}
}

export const deletetrip = async (req: AuthRequest<{id: string}>, res:Response)=>{
  try{
    const {id} = req.params;
    const userId = req.userId;

    const trip = await prisma.tripPlan.findUnique({
      where: {id},
      select:{
        ownerId: true,
      }
    });

    if(!trip || trip.ownerId != userId){
      return res.status(403).json({
        ok: false, message: 'Unauthorized or trip not found',
      })
    }
    await prisma.tripPlan.delete({
      where: {id}
    });
    return res.status(200).json({
      ok: true, message: 'Trip deleted successfully',
    })
  }
  catch (error) {
      console.error('[trip.controller] Failed to delete trip:', error);
      return res.status(500).json({
        ok: false,
        message: 'Unable to delete trip right now. Please try again.',
      });
    }
}

export const updatetrip = async (req: AuthRequest<{id: string}>, res:Response) => {
  try{
    const {id} = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const trip = await prisma.tripPlan.findUnique({
      where: {id},
      select: { ownerId: true }
    });

    if(!trip || trip.ownerId != userId){
      return res.status(403).json({
        ok: false, message: 'Unauthorized',
      });
    }

    const updated = await prisma.tripPlan.update({
      where: {id},
      data: {...updateData}
    });
    
    return res.status(200).json({
      ok: true, 
      message: 'Trip updated successfully',
      trip: updated,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to update trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to update trip right now. Please try again.',
    });
  }
}

export const refineTrip = async (req: AuthRequest, res: Response) => {
  try{
    const {id, instruction } = req.body;

    const currentTrip = await prisma.tripPlan.findUnique({where: {id}});
    if(!currentTrip) return res.status(404).json({ok: false, message:"Trip not found"})

    const updatedPlan = await refineTripWithAI(currentTrip.plan, instruction);

    const saved = await prisma.tripPlan.update({
      where: {id},
      data: {plan: updatedPlan as any}
    });
    return res.status(200).json({
      ok:true,
      plan: updatedPlan
    })
  }catch (error){
    console.error('[trip.controller] Failed to refine trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'AI Refinement failed',
    });
  }
}
  
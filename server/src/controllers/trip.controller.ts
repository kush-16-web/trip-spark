import type { Response, Request } from 'express';
import type { TripPlanRequest } from '../types/trip.types';
import { Prisma } from '../generated/prisma/client';
import { tripPlanRequestSchema } from '../validators/trip.validator';
import { generateTripPlan, refineTripWithAI, generateContentFromAI } from '../services/ai.service';
import { getWeatherForecast } from '../services/weather.service';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ok } from 'node:assert';
import { exchangeRates } from '../services/currency.service';

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

    // Corrected name: localCurrency (not localCurrencyCode)
    const localCode = plan.totalEstimate.localCurrency?.code || 'INR';

    // Convert INR to Local (e.g. INR to JPY)
    const rate = await exchangeRates('INR', localCode);
    
    const weather = await getWeatherForecast(validatedInput.Destination, validatedInput.startDate, validatedInput.endDate);


    return res.status(200).json({
      ok: true,
      message: 'Plan created successfully',
      plan,
      weather,
      exchangeRates: rate,
    });
  } catch (error) {
    console.error('[trip.controller] Failed to plan trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to generate trip plan right now. Please try again.',
    });
  }
};

export const saveTrip = async (req: AuthRequest, res: Response) => {
  try{
    const {destination,days,travelers,type,startDate,endDate,plan,weather} = req.body;
    const savedTrip = await prisma.tripPlan.create({
       data: {
        destination,
        days: Number(days),
        travelers: Number(travelers),
        type,
        startDate,
        endDate,
        plan: plan as any,
        weather: weather as any,
        ownerId: req.userId, // Must be logged in to save
        isPublic: true,
      },
    })
    return res.status(200).json({
      ok: true,
      message: 'Trip saved successfully',
      tripId: savedTrip.id,
      shareId: savedTrip.shareId,
    })
  }catch(error){
    return res.status(500).json({
      ok: false,
      message: 'Unable to save trip right now. Please try again.',
    });
  }
}

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

    const trip = await prisma.tripPlan.findUnique({
      where: {id},
      select: { ownerId: true }
    });

    if(!trip || trip.ownerId != userId){
      return res.status(403).json({
        ok: false, message: 'Unauthorized',
      });
    }

    const {
      Destination,
      destination,
      days,
      travelers,
      type,
      startDate,
      endDate,
      plan,
      weather
    } = req.body;
    
    // We explicitly map the properties to avoid crashing Prisma with unknown frontend fields
    const updated = await prisma.tripPlan.update({
      where: { id },
      data: {
        destination: Destination || destination || undefined,
        days: days ? Number(days) : undefined,
        travelers: travelers ? Number(travelers) : undefined,
        type: type || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        plan: plan ? plan : undefined,
        weather: weather ? weather : undefined,
      }
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

    const localCode = updatedPlan.totalEstimate?.localCurrency?.code || 'INR';
    const rate = await exchangeRates('INR', localCode);

    const saved = await prisma.tripPlan.update({
      where: {id},
      data: {plan: updatedPlan as any}
    });
    return res.status(200).json({
      ok:true,
      plan: updatedPlan,
      exchangeRates: rate,
    })
  }catch (error){
    console.error('[trip.controller] Failed to refine trip:', error);
    return res.status(500).json({
      ok: false,
      message: 'AI Refinement failed',
    });
  }
}

export const generateSingleDay = async (req: Request, res: Response) => {
  try{
    const {
      destination,
      type,
      daynumber,
      customPrompt,
      existingActivities,
      currentDaySchedule
    } = req.body;

        const aiPrompt = `
      You are an elite travel planner. I need you to generate activities for Day ${daynumber} of a trip to ${destination}.
      
      CONTEXT:
      - The travel group type is: ${type}.
      - IMPORTANT: THE USER ALREADY HAS THIS SCHEDULE FOR THIS DAY: ${JSON.stringify(currentDaySchedule || [])}
      
      CRITICAL RULES:
      1. DO NOT repeat any activities already on the schedule for Day ${daynumber}.
      2. Here is a list of places the user is doing on OTHER days: ${existingActivities}. 
         DO NOT suggest any of these places again.
      3. Suggest 2-3 NEW activities that fit into the gaps of the current schedule (e.g., if they have a dinner, suggest a morning or afternoon activity).
      4. Ensure the timing doesn't overlap with the current schedule for Day ${daynumber}.
      5. The user's specific request: "${customPrompt || 'Suggest an amazing, well-paced day.'}"
      6. CRITICAL: For every activity, provide real-world geographic coordinates (Latitude and Longitude) in the 'coordinates' object.

      
      OUTPUT FORMAT:
      Return ONLY a JSON array of the NEW activities:
      [
        {
          "time": "String (e.g., '09:00 AM')",
          "title": "String (Short, catchy title)",
          "desc": "String (2-3 sentences explaining why it fits the gaps)",
          "coordinates": {
            "lat": "Float (Real world latitude)",
            "lng": "Float (Real world longitude)"
          }
        }
      ]
    `;

    const aiResponseText = await generateContentFromAI(aiPrompt);

    const cleanedText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const activities = JSON.parse(cleanedText);
    
    return res.status(200).json({
      ok: true,
      day: daynumber,
      activities
    })
  }catch(error){
    console.error('[trip.controller] Error generating single day:', error);
    return res.status(500).json({
      ok: false,
      message: "Failed to generate AI day plan", 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      error,
    });
  }
}

export const getTripWeather = async (req: Request<{destination: string, startDate: string, endDate: string}>,res: Response) => {
  try{
    const {destination, startDate, endDate} = req.params;

    const weather = await getWeatherForecast(destination, startDate, endDate);

    return res.status(200).json({ok: true,weather})
  }catch(error){
    return res.status(500).json({
      ok: false,
      message: 'Failed to get trip weather',
    });
  }
}
  
export const generateBudgetOnly = async (req: Request, res: Response) => {
  try{
    const {destination, days, type, travelers, currentTotalEstimate, currentBudgetEstimate  } = req.body;

      const prompt = `
      You are an expert travel financial planner. The user has updated their trip settings.
      
      DESTINATION: ${destination}
      TRIP TYPE: ${type}
      TRAVELERS: ${travelers}
      NEW DAY COUNT: ${days} days
      USER'S TARGET BUDGET MINIMUM: ${currentTotalEstimate?.min || 'Flexible'} ${currentTotalEstimate?.currency || 'USD'}
      
      PREVIOUS BUDGET BREAKDOWN (for reference on travel style):
      ${JSON.stringify(currentBudgetEstimate)}

      CRITICAL INSTRUCTIONS:
      1. You MUST use the currency "${currentTotalEstimate?.currency || 'USD'}" for all calculations and the "currency" field in your response.
      2. If the previous budget was in a different currency, CONVERT it to "${currentTotalEstimate?.currency || 'USD'}" using current approximate exchange rates.
      3. All strings in the "budgetEstimate" array (specifically the "amount" field) MUST use the "${currentTotalEstimate?.currency || 'USD'}" symbol.

      Task: Recalculate the entire travel budget to perfectly match the NEW DAY COUNT (${days} days) and the USER'S TARGET BUDGET. 
      Keep the formatting identical to the previous breakdown.
      Return ONLY a JSON object with this exact structure:
      {
        "totalEstimate": {
          "min": number,
          "max": number,
          "currency": "string",
          "note": "string"
        },
        "budgetEstimate": [
          { "label": "string", "amount": "string", "note": "string" }
        ]
      }
    `;

    const aiResponse = await generateContentFromAI(prompt);

    const jsonString = aiResponse.replace(/```json/g, '').replace(/```/g, '');
    const newBudget = JSON.parse(jsonString);
    
    return res.status(200).json({
      ok: true,
      budget: newBudget,
    });
  }catch(error){
    console.error('[trip.controller] Error generating budget:', error);
    return res.status(500).json({
      ok: false,
      message: "Failed to generate AI budget plan", 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    });
  }
}

export const generateSummaryOnly = async (req: Request, res: Response) => {
  try{
    const {destination, days, type, travelers } = req.body;

     const prompt = `
      You are an expert travel storyteller. The user is planning a trip and needs a compelling summary.
      
      DESTINATION: ${destination}
      TRIP TYPE: ${type}
      TRAVELERS: ${travelers}
      DURATION: ${days} days
      
      Task: Write a beautiful, premium "Overview" for this trip.
      1. A "summary" (2-3 sentences) that captures the vibe and excitement.
      2. A "summaryBullets" list (exactly 4 points) highlighting key experiences.
      
      Return ONLY a JSON object:
      {
        "summary": "string",
        "summaryBullets": ["string", "string", "string", "string"]
      }
    `; 
    
    const aiResponse = await generateContentFromAI(prompt);
    const jsonString = aiResponse.replace(/```json/g, '').replace(/```/g, '');
    const newSummary = JSON.parse(jsonString);
    
    return res.status(200).json({
      ok: true,
      summary: newSummary,
    });
  }catch(error){
    console.error('[trip.controller] Error generating summary:', error);
    return res.status(500).json({
      ok: false,
      message: "Failed to generate AI summary plan", 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    });
  }
}

export const getExchangeRate = async (req: Request, res: Response) => {
  try {
    const { base, target } = req.params;
    const rate = await exchangeRates(base as string, target as string);
    return res.status(200).json({ ok: true, rate });
  } catch (error) {
    console.error('[trip.controller] Failed to get exchange rate:', error);
    return res.status(500).json({ ok: false, message: 'Failed to fetch exchange rate' });
  }
}

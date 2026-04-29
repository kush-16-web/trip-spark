import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import type { TripPlanRequest, TripPlanResponse } from '../types/trip.types';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
function buildPrompt(input: TripPlanRequest): string {
  return `
Create a travel plan in strict JSON format for:
Destination: ${input.Destination}
Days: ${input.days}
Travelers: ${input.travelers}
Budget: ${input.budget}
Trip Type: ${input.type}
Place Preference: ${input.placeStyle ?? 'balanced'}
Start Date: ${input.startDate}
End Date: ${input.endDate}
Vibe: ${input.vibe ?? 'Not specified'}
Rules:
- Return ONLY valid JSON (no markdown, no explanation text).
- Budget must align with selected tier (${input.budget}).
- Include realistic total trip cost range.
- Day plan length must match exactly ${input.days} days.
Return this exact JSON shape:
{
  "summary": "string",
  "summaryBullets": ["string", "string", "string"],
  "totalEstimate": {
    "min": number,
    "max": number,
    "currency": "string",
    "note": "string"
  },
  "dayPlan": [
    {
      "day": number,
      "activities": [
        { "time": "string", "title": "string", "desc": "string" }
      ]
    }
  ],
  "budgetEstimate": [
    { "label": "string", "amount": "string", "note": "string" }
  ],
  "suggestedStays": [
    { "name": "string", "tag": "string", "blurb": "string" }
  ],
  "suggestedPlaces": [
    { "name": "string", "tag": "string", "time": "string" }
  ]
}
  Additional Guidelines:
  - summaryBullets must have exactly 3 concise bullet points.
  - Avoid repetitive tourist phrases.
  - Make activities feel realistic and location-specific.
  - Include a mix of food, sightseeing, and relaxation.
  - Avoid repeating the same activity across days.
  - Recommendations should feel natural, not overly promotional.
  - Respect Place Preference strictly:
    - hidden_gems: prioritize less-crowded local spots and unique experiences.
    - balanced: mix iconic highlights with quieter local discoveries.
    - must_see: prioritize famous, top-rated landmark attractions.
  - For places such as temples, zoos, museums, or timed attractions, include opening-hours context in the place tag or activity description.
  - If exact opening hours are uncertain, explicitly say "Check official website for latest timings".
`;
}

function extractJson(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith('```')) return trimmed;

  return trimmed
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/, '')
  .trim();
}


function assertTripPlanShape(data: unknown): TripPlanResponse {
  if (!data || typeof data !== 'object') throw new Error('AI response is not an object');
  const plan = data as Partial<TripPlanResponse>;
  const summaryBulletsValid =
    Array.isArray(plan.summaryBullets) &&
    plan.summaryBullets.length === 3 &&
    plan.summaryBullets.every((item) => typeof item === 'string' && item.trim().length > 0);
  if (
    typeof plan.summary !== 'string' ||
    plan.summary.trim().length === 0 ||
    !summaryBulletsValid ||
    typeof plan.totalEstimate !== 'object' ||
    plan.totalEstimate == null ||
    typeof plan.totalEstimate.min !== 'number' ||
    typeof plan.totalEstimate.max !== 'number' ||
    typeof plan.totalEstimate.currency !== 'string' ||
    typeof plan.totalEstimate.note !== 'string' ||
    !Array.isArray(plan.dayPlan) ||
    !Array.isArray(plan.budgetEstimate) ||
    !Array.isArray(plan.suggestedStays) ||
    !Array.isArray(plan.suggestedPlaces) ||
    plan.dayPlan.length === 0 ||
    plan.budgetEstimate.length === 0 ||
    plan.suggestedStays.length === 0 ||
    plan.suggestedPlaces.length === 0
  ) {
    throw new Error('AI response has invalid top-level shape');
  }
  return plan as TripPlanResponse;
}
export async function generateTripPlan(input: TripPlanRequest): Promise<TripPlanResponse> {
  try {
    if (!env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing in server environment');
    }

    const prompt = buildPrompt(input);
    console.info('[ai.service] Requesting AI trip plan', {
      destination: input.Destination,
      days: input.days,
      model: env.GEMINI_MODEL,
    });

    const response = await model.generateContent(prompt);

    const rawText = response.response.text() ?? '';
    if (!rawText.trim()) throw new Error('AI returned empty response');

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText) as unknown;
    const plan = assertTripPlanShape(parsed);

    console.info('[ai.service] AI trip plan generated', {
      dayCount: plan.dayPlan.length,
      budgetRows: plan.budgetEstimate.length,
      stays: plan.suggestedStays.length,
      places: plan.suggestedPlaces.length,
    });

    return plan;
  } catch (error) {
    console.error('[ai.service] Error generating trip plan:', error);
    throw error;
  }
}
export interface TripFormPayload {
  Destination: string;
  days: number;
  travelers: number;
  budget: string;
  type: string;
  startDate: string;
  endDate: string;
  vibe?: string;
  placeStyle?: string;
}

export interface DayActivity {
  time: string;
  title: string;
  desc: string;
}

export interface DayPlan {
  day: number;
  activities: DayActivity[];
}

export interface Weather {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface BudgetEstimateRow {
  label: string;
  amount: string;
  note: string;
}

export interface StaySuggestion {
  name: string;
  tag: string;
  blurb: string;
}

export interface PlaceSuggestion {
  name: string;
  tag: string;
  time: string;
}

export interface TotalEstimate {
  min: number;
  max: number;
  currency: string;
  note: string;
}

export interface TripPlanModel {
  summary: string;
  summaryBullets: string[];
  totalEstimate: TotalEstimate;
  dayPlan: DayPlan[];
  budgetEstimate: BudgetEstimateRow[];
  suggestedStays: StaySuggestion[];
  suggestedPlaces: PlaceSuggestion[];
}

export interface PlanTripApiResponse {
  ok: boolean;
  message: string;
  plan: TripPlanModel;
  /** Present when Open-Meteo succeeds; null if geocode/forecast failed (plan still valid). */
  weather: Weather[] | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function planTrip(payload: TripFormPayload): Promise<PlanTripApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/trip/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as PlanTripApiResponse | { message?: string };

  if (!response.ok) {
    console.log(data);
    throw new Error((data as { message?: string }).message ?? 'Failed to plan trip');
  }

  return data as PlanTripApiResponse;
}
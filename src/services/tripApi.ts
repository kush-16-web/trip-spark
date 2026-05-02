export interface TripFormPayload {
  Destination: string;
  days: number;
  travelers: number;
  budgetRange: { min: number; max: number };
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
  shareId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface MyTripListItem {
  id: string;
  shareId: string;
  destination: string;
  type?: string;
  days?: number;
  travelers?: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface MyTripsApiResponse {
  ok: boolean;
  message: string;
  trips: MyTripListItem[];
}

export interface TripByIdApiResponse {
  ok: boolean;
  message: string;
  trip: {
    id: string;
    shareId: string;
    destination: string;
    type?: string;
    days?: number;
    travelers?: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    plan: TripPlanModel;
    weather: Weather[] | null;
  };
}

export async function planTrip(payload: TripFormPayload): Promise<PlanTripApiResponse> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/trip/plan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as PlanTripApiResponse | { message?: string };

  if (!response.ok) {
    console.log(data);
    throw new Error((data as { message?: string }).message ?? 'Failed to plan trip');
  }

  return data as PlanTripApiResponse;
}

export async function getMyTrips(): Promise<MyTripsApiResponse> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/trip/my-trips`, {
    headers
  });
  const data = (await response.json()) as MyTripsApiResponse | { message?: string };

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Failed to load trips');
  }

  return data as MyTripsApiResponse;
}

export async function getTripById(id: string): Promise<TripByIdApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/trip/${id}`);
  const data = (await response.json()) as TripByIdApiResponse | { message?: string };

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Failed to load trip');
  }

  return data as TripByIdApiResponse;
}

export async function getSharedTrip(shareId: string):Promise<TripByIdApiResponse>{
  const response = await fetch(`${API_BASE_URL}/api/trip/share/${shareId}`);
  const data = (await response.json() as TripByIdApiResponse | {message?: string});
  if(!response.ok){
    throw new Error((data as {message?: string}).message ?? 'Failed to get shared trip');
  }
  return data as TripByIdApiResponse;
}

export async function deletetrip(id: string){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/trip/delete/${id}`,{
    method : 'DELETE',
    headers : {
      'Authorization' : `Bearer ${token}`,
    }
  });
  if(!response.ok) throw new Error('Failed to delete trip');
  return response.json();
}

export async function updatetrip(id: string, update: any){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/trip/update/${id}`,{
    method : 'PUT',
    headers : {
      'Authorization' : `Bearer ${token}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(update)
  });
  if(!response.ok) throw new Error('failed to update trip');
  return response.json();
}

export async function refineTrip(id: string, instruction: string){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/trip/refine`, {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id, instruction })
  })
  const data = (await response.json()) as { ok: boolean; message: string; plan: TripPlanModel };
  if(!response.ok) throw new Error(data.message);
  return data;
}

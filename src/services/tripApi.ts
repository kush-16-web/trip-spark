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
  localCurrency?: {
    code: string;
    symbol: string;
    name: string;
  };
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

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/** Thrown when the server returns 401 – the user's session/token has expired. */
export class AuthExpiredError extends Error {
  constructor(message = 'Your session has expired. Please log in again.') {
    super(message);
    this.name = 'AuthExpiredError';
  }
}

/** Clears stale auth data and throws AuthExpiredError on 401 responses. */
function handleUnauthorized(response: Response): void {
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    throw new AuthExpiredError();
  }
}

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
    shareMessage?: string;
  };
}

export async function planTrip(payload: TripFormPayload): Promise<PlanTripApiResponse> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/trip/plan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  handleUnauthorized(response);
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

  const response = await fetch(`${API_BASE_URL}/trip/my-trips`, {
    headers
  });
  handleUnauthorized(response);
  const data = (await response.json()) as MyTripsApiResponse | { message?: string };

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Failed to load trips');
  }

  return data as MyTripsApiResponse;
}

export async function getTripById(id: string): Promise<TripByIdApiResponse> {
  const response = await fetch(`${API_BASE_URL}/trip/${id}`);
  const data = (await response.json()) as TripByIdApiResponse | { message?: string };

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Failed to load trip');
  }

  return data as TripByIdApiResponse;
}

export async function getSharedTrip(shareId: string):Promise<TripByIdApiResponse>{
  const response = await fetch(`${API_BASE_URL}/trip/share/${shareId}`);
  const data = (await response.json() as TripByIdApiResponse | {message?: string});
  if(!response.ok){
    throw new Error((data as {message?: string}).message ?? 'Failed to get shared trip');
  }
  return data as TripByIdApiResponse;
}

export async function deletetrip(id: string){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/trip/delete/${id}`,{
    method : 'DELETE',
    headers : {
      'Authorization' : `Bearer ${token}`,
    }
  });
  handleUnauthorized(response);
  if(!response.ok) throw new Error('Failed to delete trip');
  return response.json();
}

export async function updatetrip(id: string, update: any){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/trip/update/${id}`,{
    method : 'PUT',
    headers : {
      'Authorization' : `Bearer ${token}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(update)
  });
  handleUnauthorized(response);
  if(!response.ok) throw new Error('failed to update trip');
  return response.json();
}

export async function refineTrip(id: string, instruction: string){
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/trip/refine`, {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id, instruction })
  })
  handleUnauthorized(response);
  const data = (await response.json()) as { ok: boolean; message: string; plan: TripPlanModel };
  if(!response.ok) throw new Error(data.message);
  return data;
}


export async function savedTrip(tripData:any) {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/trip/save`,{
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${token}`,
    },
    body: JSON.stringify(tripData)
  })
  handleUnauthorized(response);
  const data = (await response.json()) as { ok: boolean; message: string; tripId: string; shareId: string };
  if(!response.ok) throw new Error(data.message);
  return data;
}
export interface DayActivity {
  time: string;
  title: string;
  desc: string;
}

export interface DayPlan {
  day: number;
  activities: DayActivity[];
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

export interface TripPlanRequest {
  Destination: string;
  days: number;
  travelers: number;
  budgetRange: { min: number; max: number };
  type: 'Solo' | 'Couple' | 'Family' | 'Friends' | string;
  placeStyle?: 'hidden_gems' | 'balanced' | 'must_see' | string;
  vibe?: string;
  startDate: string;
  endDate: string;
}

export interface TotalEstimate {
  min: number;
  max: number;
  currency: string;
  note: string;
  localCurrency?: {
    code: string;
    symbol: string;
  }
}

export interface TripPlanResponse {
  summary: string;
  summaryBullets: string[];
  totalEstimate: TotalEstimate;
  dayPlan: DayPlan[];
  budgetEstimate: BudgetEstimateRow[];
  suggestedStays: StaySuggestion[];
  suggestedPlaces: PlaceSuggestion[];
}

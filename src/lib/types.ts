export interface Car {
  id: number;
  make: string;
  model: string;
  variant: string;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  safetyRating: number;
  bodyType: string;
  seatingCapacity: number;
  engine: string;
  imageUrl: string;
  pros: string[];
  cons: string[];
}

export interface UserPreferences {
  budget?: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  familySize?: number;
  usageType?: string;
  priority?: string;
  minMileage?: number;
  minSafetyRating?: number;
}

export interface CarRecommendation {
  car: Car;
  score: number;
  scoreBreakdown: {
    budgetScore: number;
    safetyScore: number;
    mileageScore: number;
    preferenceScore: number;
    reviewScore: number;
  };
  reasons: string[];
}

export interface RecommendationResponse {
  preferences: UserPreferences;
  recommendations: CarRecommendation[];
  explanation: string;
}

export interface SearchHistoryItem {
  id: number;
  query: string;
  preferences: UserPreferences;
  recommendations: CarRecommendation[];
  explanation: string;
  createdAt: string;
}

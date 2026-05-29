import { Car, UserPreferences, CarRecommendation } from "@/lib/types";

interface ScoreWeights {
  budget: number;
  safety: number;
  mileage: number;
  preference: number;
  review: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  budget: 0.30,
  safety: 0.25,
  mileage: 0.15,
  preference: 0.20,
  review: 0.10,
};

function getWeightsForPriority(priority?: string): ScoreWeights {
  if (!priority) return DEFAULT_WEIGHTS;
  const p = priority.toLowerCase();
  if (p.includes("safety")) {
    return { budget: 0.20, safety: 0.40, mileage: 0.10, preference: 0.20, review: 0.10 };
  }
  if (p.includes("mileage") || p.includes("fuel")) {
    return { budget: 0.20, safety: 0.15, mileage: 0.40, preference: 0.15, review: 0.10 };
  }
  if (p.includes("budget") || p.includes("price") || p.includes("affordable")) {
    return { budget: 0.50, safety: 0.15, mileage: 0.15, preference: 0.15, review: 0.05 };
  }
  if (p.includes("feature") || p.includes("comfort")) {
    return { budget: 0.20, safety: 0.15, mileage: 0.10, preference: 0.45, review: 0.10 };
  }
  return DEFAULT_WEIGHTS;
}

function scoreBudget(carPrice: number, budget?: number): number {
  if (!budget) return 70;
  if (carPrice <= budget) {
    // Within budget - score based on how well it fits (not too cheap, not too expensive)
    const ratio = carPrice / budget;
    if (ratio >= 0.7 && ratio <= 1.0) return 100;
    if (ratio >= 0.5) return 85;
    return 70;
  }
  // Over budget - penalize
  const overBy = (carPrice - budget) / budget;
  if (overBy <= 0.05) return 60; // 5% over
  if (overBy <= 0.10) return 40; // 10% over
  if (overBy <= 0.20) return 20; // 20% over
  return 0;
}

function scoreSafety(safetyRating: number): number {
  return (safetyRating / 5) * 100;
}

function scoreMileage(mileage: number, fuelType: string): number {
  if (fuelType === "Electric") return 90; // EVs get high mileage score
  if (mileage >= 25) return 100;
  if (mileage >= 20) return 85;
  if (mileage >= 17) return 70;
  if (mileage >= 14) return 55;
  if (mileage >= 10) return 40;
  return 25;
}

function scorePreferences(car: Car, prefs: UserPreferences): number {
  let score = 50; // base score
  let matches = 0;
  let total = 0;

  // Body type match
  if (prefs.bodyType) {
    total++;
    const prefBody = prefs.bodyType.toLowerCase();
    const carBody = car.bodyType.toLowerCase();
    if (carBody.includes(prefBody) || prefBody.includes(carBody)) {
      matches++;
    } else if (prefBody === "suv" && (carBody.includes("suv") || carBody.includes("off-road"))) {
      matches++;
    }
  }

  // Fuel type match
  if (prefs.fuelType) {
    total++;
    const prefFuel = prefs.fuelType.toLowerCase();
    const carFuel = car.fuelType.toLowerCase();
    if (carFuel.includes(prefFuel) || prefFuel.includes(carFuel)) {
      matches++;
    }
  }

  // Transmission match
  if (prefs.transmission) {
    total++;
    const prefTrans = prefs.transmission.toLowerCase();
    const carTrans = car.transmission.toLowerCase();
    if (carTrans.includes(prefTrans) || prefTrans.includes(carTrans)) {
      matches++;
    }
  }

  // Family size / seating
  if (prefs.familySize) {
    total++;
    if (car.seatingCapacity >= prefs.familySize) {
      matches++;
    }
  }

  // Usage type
  if (prefs.usageType) {
    total++;
    const usage = prefs.usageType.toLowerCase();
    if (usage.includes("city") || usage.includes("urban")) {
      // City cars: smaller, better mileage
      if (car.mileage >= 18 || car.bodyType.toLowerCase().includes("hatchback") || 
          car.bodyType.toLowerCase().includes("sedan")) {
        matches++;
      }
    } else if (usage.includes("highway") || usage.includes("long")) {
      // Highway: comfort, diesel preferred
      if (car.fuelType.toLowerCase().includes("diesel") || car.mileage >= 15) {
        matches++;
      }
    } else if (usage.includes("off") || usage.includes("adventure")) {
      if (car.bodyType.toLowerCase().includes("off-road") || 
          car.bodyType.toLowerCase().includes("suv")) {
        matches++;
      }
    } else {
      matches++; // general usage - all cars qualify
    }
  }

  if (total > 0) {
    score = (matches / total) * 100;
  }

  return score;
}

function scoreReview(safetyRating: number, mileage: number): number {
  // Composite review score based on safety + mileage as proxy for overall quality
  const safetyComponent = (safetyRating / 5) * 60;
  const mileageComponent = Math.min(mileage / 25, 1) * 40;
  return safetyComponent + mileageComponent;
}

function parsePros(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  return [];
}

function generateReasons(car: Car, prefs: UserPreferences, scores: CarRecommendation["scoreBreakdown"]): string[] {
  const reasons: string[] = [];

  if (scores.budgetScore >= 80) {
    reasons.push(`Fits within your budget at ₹${(car.price / 100000).toFixed(1)}L`);
  } else if (scores.budgetScore >= 60) {
    reasons.push(`Slightly above budget but offers great value`);
  }

  if (scores.safetyScore >= 80) {
    reasons.push(`Excellent ${car.safetyRating}-star Global NCAP safety rating`);
  } else if (scores.safetyScore >= 60) {
    reasons.push(`Good ${car.safetyRating}-star safety rating`);
  }

  if (car.fuelType === "Electric") {
    reasons.push(`Zero emissions electric vehicle with low running costs`);
  } else if (scores.mileageScore >= 80) {
    reasons.push(`Outstanding fuel efficiency at ${car.mileage} km/l`);
  } else if (scores.mileageScore >= 60) {
    reasons.push(`Good fuel efficiency at ${car.mileage} km/l`);
  }

  if (prefs.bodyType && car.bodyType.toLowerCase().includes(prefs.bodyType.toLowerCase())) {
    reasons.push(`Matches your preferred ${car.bodyType} body type`);
  }

  if (prefs.transmission && car.transmission.toLowerCase().includes(prefs.transmission.toLowerCase())) {
    reasons.push(`${car.transmission} transmission as preferred`);
  }

  if (prefs.familySize && car.seatingCapacity >= prefs.familySize) {
    reasons.push(`${car.seatingCapacity} seats accommodate your family of ${prefs.familySize}`);
  }

  // Add a pro from the car's pros list
  const pros = parsePros(car.pros);
  if (pros.length > 0) {
    reasons.push(pros[0]);
  }

  return reasons.slice(0, 4);
}

export function rankCars(cars: Car[], prefs: UserPreferences): CarRecommendation[] {
  const weights = getWeightsForPriority(prefs.priority);

  const recommendations: CarRecommendation[] = cars.map((car) => {
    const budgetScore = scoreBudget(car.price, prefs.budget);
    const safetyScore = scoreSafety(car.safetyRating);
    const mileageScore = scoreMileage(car.mileage, car.fuelType);
    const preferenceScore = scorePreferences(car, prefs);
    const reviewScore = scoreReview(car.safetyRating, car.mileage);

    const totalScore = Math.round(
      budgetScore * weights.budget +
      safetyScore * weights.safety +
      mileageScore * weights.mileage +
      preferenceScore * weights.preference +
      reviewScore * weights.review
    );

    const scoreBreakdown = {
      budgetScore: Math.round(budgetScore),
      safetyScore: Math.round(safetyScore),
      mileageScore: Math.round(mileageScore),
      preferenceScore: Math.round(preferenceScore),
      reviewScore: Math.round(reviewScore),
    };

    return {
      car,
      score: Math.min(totalScore, 100),
      scoreBreakdown,
      reasons: generateReasons(car, prefs, scoreBreakdown),
    };
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

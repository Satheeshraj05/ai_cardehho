import { Mistral } from "@mistralai/mistralai";
import { UserPreferences, CarRecommendation } from "@/lib/types";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function extractPreferences(query: string): Promise<UserPreferences> {
  const prompt = `You are an AI car advisor for the Indian market. Extract car preferences from the user's query.

User query: "${query}"

Extract and return a JSON object with these fields (only include fields that are mentioned or strongly implied):
- budget: number (in INR, e.g., 15 lakh = 1500000)
- bodyType: string (one of: "SUV", "Hatchback", "Sedan", "MPV", "Off-road SUV", "Micro SUV", "Coupe SUV", "Electric SUV")
- fuelType: string (one of: "Petrol", "Diesel", "Electric", "Petrol Hybrid")
- transmission: string (one of: "Automatic", "Manual")
- familySize: number (number of people)
- usageType: string (one of: "city", "highway", "off-road", "mixed")
- priority: string (one of: "safety", "mileage", "budget", "features", "performance")
- minMileage: number (minimum km/l)
- minSafetyRating: number (1-5)

Return ONLY valid JSON, no explanation. Example:
{"budget": 1500000, "bodyType": "SUV", "priority": "safety", "familySize": 4}`;

  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      maxTokens: 300,
    });

    const content =
      (response.choices?.[0]?.message?.content as string)?.trim() ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as UserPreferences;
    }
    return {};
  } catch (error) {
    console.error("Mistral preference extraction error:", error);
    return extractPreferencesFallback(query);
  }
}

export async function generateExplanation(
  query: string,
  preferences: UserPreferences,
  recommendations: CarRecommendation[]
): Promise<string> {
  if (recommendations.length === 0) {
    return "No cars found matching your criteria. Try adjusting your preferences.";
  }

  const topCar = recommendations[0];
  const carList = recommendations
    .map((r, i) => `${i + 1}. ${r.car.make} ${r.car.model} (${r.score}% match)`)
    .join(", ");

  const prompt = `You are an expert AI car advisor for the Indian market. Generate a concise, helpful explanation for these car recommendations.

User's query: "${query}"
Extracted preferences: ${JSON.stringify(preferences)}
Top recommendation: ${topCar.car.make} ${topCar.car.model} ${topCar.car.variant} (${topCar.score}% match)
All recommendations: ${carList}

Write a 2-3 sentence explanation that:
1. Acknowledges the user's main requirement
2. Explains why the top car was recommended
3. Briefly mentions what makes the shortlist good

Be conversational, specific, and mention actual car features. Keep it under 100 words.`;

  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 200,
    });

    const content = (response.choices?.[0]?.message?.content as string)?.trim();
    return content ?? generateFallbackExplanation(preferences, recommendations);
  } catch (error) {
    console.error("Mistral explanation error:", error);
    return generateFallbackExplanation(preferences, recommendations);
  }
}

function extractPreferencesFallback(query: string): UserPreferences {
  const prefs: UserPreferences = {};
  const q = query.toLowerCase();

  const budgetMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/);
  if (budgetMatch) prefs.budget = parseFloat(budgetMatch[1]) * 100000;

  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr\b)/);
  if (croreMatch) prefs.budget = parseFloat(croreMatch[1]) * 10000000;

  if (q.includes("suv")) prefs.bodyType = "SUV";
  else if (q.includes("hatchback") || q.includes("hatch")) prefs.bodyType = "Hatchback";
  else if (q.includes("sedan")) prefs.bodyType = "Sedan";
  else if (q.includes("mpv") || q.includes("minivan")) prefs.bodyType = "MPV";

  if (q.includes("electric") || q.includes(" ev")) prefs.fuelType = "Electric";
  else if (q.includes("diesel")) prefs.fuelType = "Diesel";
  else if (q.includes("petrol")) prefs.fuelType = "Petrol";
  else if (q.includes("hybrid")) prefs.fuelType = "Petrol Hybrid";

  if (q.includes("automatic") || q.includes(" auto")) prefs.transmission = "Automatic";
  else if (q.includes("manual")) prefs.transmission = "Manual";

  const familyMatch = q.match(/family\s+of\s+(\d+)/);
  if (familyMatch) prefs.familySize = parseInt(familyMatch[1]);
  if (q.includes("7 seat") || q.includes("7-seat")) prefs.familySize = 7;

  if (q.includes("safe") || q.includes("safety") || q.includes("ncap")) prefs.priority = "safety";
  else if (q.includes("mileage") || q.includes("fuel efficient")) prefs.priority = "mileage";
  else if (q.includes("budget") || q.includes("affordable") || q.includes("cheap")) prefs.priority = "budget";

  if (q.includes("city") || q.includes("urban")) prefs.usageType = "city";
  else if (q.includes("highway") || q.includes("long drive")) prefs.usageType = "highway";
  else if (q.includes("off-road") || q.includes("adventure")) prefs.usageType = "off-road";

  return prefs;
}

function generateFallbackExplanation(
  preferences: UserPreferences,
  recommendations: CarRecommendation[]
): string {
  const topCar = recommendations[0];
  const parts: string[] = [];

  if (preferences.budget) parts.push(`budget of ₹${(preferences.budget / 100000).toFixed(0)}L`);
  if (preferences.priority) parts.push(`${preferences.priority} as priority`);
  if (preferences.bodyType) parts.push(`${preferences.bodyType} preference`);

  const prefStr = parts.length > 0 ? `Based on your ${parts.join(", ")}, ` : "";
  return `${prefStr}we recommend the ${topCar.car.make} ${topCar.car.model} as your top choice with a ${topCar.score}% match score. It offers ${topCar.reasons[0]?.toLowerCase() ?? "excellent value"} and ${topCar.reasons[1]?.toLowerCase() ?? "great features"}. All ${recommendations.length} shortlisted cars have been carefully ranked to match your specific needs.`;
}

import { NextRequest, NextResponse } from "next/server";
import { extractPreferences, generateExplanation } from "@/services/openaiService";
import { rankCars } from "@/services/recommendationEngine";
import { Car } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseProsConsField(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  return [];
}

export async function POST(request: NextRequest) {
  // Import prisma inside handler so it's created at request time, not build time
  const { prisma } = await import("@/lib/prisma");

  try {
    const body = await request.json() as { query: string };
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const trimmedQuery = query.trim();

    const [preferences, dbCars] = await Promise.all([
      extractPreferences(trimmedQuery),
      prisma.car.findMany(),
    ]);

    const cars: Car[] = dbCars.map((car) => ({
      ...car,
      pros: parseProsConsField(car.pros),
      cons: parseProsConsField(car.cons),
    }));

    const recommendations = rankCars(cars, preferences);
    const explanation = await generateExplanation(trimmedQuery, preferences, recommendations);

    prisma.searchHistory.create({
      data: {
        query: trimmedQuery,
        preferences: JSON.stringify(preferences),
        recommendations: JSON.stringify(recommendations),
        explanation,
      },
    }).catch((e: unknown) => console.error("History save failed:", e));

    return NextResponse.json({ preferences, recommendations, explanation });

  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const history = await prisma.searchHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const parsed = history.map((item) => ({
      ...item,
      preferences: JSON.parse(item.preferences as string),
      recommendations: JSON.parse(item.recommendations as string),
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      query: string;
      preferences: Record<string, unknown>;
      recommendations: unknown[];
      explanation: string;
    };
    const { query, preferences, recommendations, explanation } = body;

    const item = await prisma.searchHistory.create({
      data: {
        query,
        preferences: JSON.stringify(preferences),
        recommendations: JSON.stringify(recommendations),
        explanation,
      },
    });

    return NextResponse.json({
      ...item,
      preferences,
      recommendations,
      createdAt: item.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("History save error:", error);
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}

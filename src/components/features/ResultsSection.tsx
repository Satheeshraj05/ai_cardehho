"use client";

import { useState } from "react";
import { useCarStore } from "@/store/useCarStore";
import RecommendationCard from "./RecommendationCard";
import ComparisonTable from "./ComparisonTable";
import AIExplanation from "./AIExplanation";
import { LayoutGrid, Table2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultsSection() {
  const { currentResult, currentQuery, error, clearResult } = useCarStore();
  const [view, setView] = useState<"cards" | "table">("cards");

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-red-800">Something went wrong</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          {error.includes("API key") && (
            <p className="text-xs text-red-500 mt-2">
              Make sure your OPENAI_API_KEY is set in the .env file
            </p>
          )}
        </div>
        <button onClick={clearResult} className="text-red-400 hover:text-red-600" aria-label="Dismiss error">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!currentResult) return null;

  const { recommendations, preferences, explanation } = currentResult;

  return (
    <div className="space-y-6">
      {/* AI Explanation */}
      <AIExplanation
        explanation={explanation}
        preferences={preferences}
        query={currentQuery}
      />

      {/* View toggle + results header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Top {recommendations.length} Recommendations
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Ranked by match score based on your requirements
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "cards"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Card view"
            aria-pressed={view === "cards"}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "table"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Table view"
            aria-pressed={view === "table"}
          >
            <Table2 className="w-4 h-4" />
            Compare
          </button>
        </div>
      </div>

      {/* Results */}
      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.car.id} recommendation={rec} rank={i + 1} />
          ))}
        </div>
      ) : (
        <ComparisonTable recommendations={recommendations} />
      )}

      {/* New search button */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          onClick={clearResult}
          className="text-sm"
        >
          Start a new search
        </Button>
      </div>
    </div>
  );
}

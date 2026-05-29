"use client";

import { CarRecommendation } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Fuel, Zap, Users, Shield, TrendingUp } from "lucide-react";

interface RecommendationCardProps {
  recommendation: CarRecommendation;
  rank: number;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8 text-right">{score}%</span>
    </div>
  );
}

export default function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const { car, score, scoreBreakdown, reasons } = recommendation;
  const pros = Array.isArray(car.pros)
    ? car.pros
    : (() => { try { return JSON.parse(car.pros as unknown as string) as string[]; } catch { return []; } })();

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 bg-green-50";
    if (s >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRankBadge = () => {
    if (rank === 1) return { label: "Best Match", color: "bg-blue-600 text-white" };
    if (rank === 2) return { label: "Runner Up", color: "bg-gray-700 text-white" };
    return { label: `#${rank} Pick`, color: "bg-gray-100 text-gray-700" };
  };

  const rankBadge = getRankBadge();

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md overflow-hidden ${rank === 1 ? "border-blue-200 shadow-blue-50 shadow-md" : "border-gray-100 shadow-sm"}`}>
      {/* Header */}
      <div className={`p-5 ${rank === 1 ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gray-50"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rankBadge.color}`}>
                {rankBadge.label}
              </span>
              {car.safetyRating >= 5 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  5-Star Safety
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500 truncate">{car.variant}</p>
          </div>

          {/* Score circle */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${score >= 80 ? "border-green-400 bg-green-50" : score >= 60 ? "border-yellow-400 bg-yellow-50" : "border-gray-300 bg-gray-50"}`}>
            <span className={`text-xl font-bold leading-none ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-gray-600"}`}>
              {score}
            </span>
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>

        {/* Key specs */}
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{formatPrice(car.price)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuelType === "Electric" ? (
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                Electric
              </span>
            ) : (
              <span>{car.mileage} km/l</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-3.5 h-3.5" />
            {car.seatingCapacity} seats
          </div>
          <Badge variant="secondary" className="text-xs">
            {car.transmission}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {car.bodyType}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Why this car */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Why this car</h4>
          <ul className="space-y-1.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Score breakdown */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Score Breakdown
          </h4>
          <div className="space-y-1.5">
            <ScoreBar label="Budget" score={scoreBreakdown.budgetScore} color="bg-blue-500" />
            <ScoreBar label="Safety" score={scoreBreakdown.safetyScore} color="bg-green-500" />
            <ScoreBar label="Mileage" score={scoreBreakdown.mileageScore} color="bg-yellow-500" />
            <ScoreBar label="Preference" score={scoreBreakdown.preferenceScore} color="bg-purple-500" />
          </div>
        </div>

        {/* Pros */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Highlights</h4>
          <div className="flex flex-wrap gap-1.5">
            {pros.slice(0, 3).map((pro, i) => (
              <span key={i} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 rounded-full px-2.5 py-1">
                {pro}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with score color indicator */}
      <div className={`px-5 py-2 border-t border-gray-50 flex items-center justify-between`}>
        <span className="text-xs text-gray-400">{car.engine} · {car.fuelType}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(score)}`}>
          {score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : "Partial Match"}
        </span>
      </div>
    </div>
  );
}

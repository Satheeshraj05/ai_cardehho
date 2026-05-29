"use client";

import { CarRecommendation } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Shield, Fuel, Users, Zap } from "lucide-react";

interface ComparisonTableProps {
  recommendations: CarRecommendation[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
    </div>
  );
}

export default function ComparisonTable({ recommendations }: ComparisonTableProps) {
  if (recommendations.length === 0) return null;

  const rows = [
    {
      label: "Price",
      icon: <span className="text-gray-400">₹</span>,
      getValue: (r: CarRecommendation) => formatPrice(r.car.price),
      highlight: (r: CarRecommendation) => r.car.price === Math.min(...recommendations.map(x => x.car.price)),
    },
    {
      label: "Mileage",
      icon: <Fuel className="w-3.5 h-3.5 text-gray-400" />,
      getValue: (r: CarRecommendation) =>
        r.car.fuelType === "Electric" ? "Electric" : `${r.car.mileage} km/l`,
      highlight: (r: CarRecommendation) =>
        r.car.fuelType === "Electric" || r.car.mileage === Math.max(...recommendations.map(x => x.car.mileage)),
    },
    {
      label: "Safety",
      icon: <Shield className="w-3.5 h-3.5 text-gray-400" />,
      getValue: (r: CarRecommendation) => <StarRating rating={r.car.safetyRating} />,
      highlight: (r: CarRecommendation) =>
        r.car.safetyRating === Math.max(...recommendations.map(x => x.car.safetyRating)),
    },
    {
      label: "Engine",
      icon: <Zap className="w-3.5 h-3.5 text-gray-400" />,
      getValue: (r: CarRecommendation) => r.car.engine,
      highlight: () => false,
    },
    {
      label: "Fuel Type",
      icon: <Fuel className="w-3.5 h-3.5 text-gray-400" />,
      getValue: (r: CarRecommendation) => r.car.fuelType,
      highlight: () => false,
    },
    {
      label: "Transmission",
      icon: null,
      getValue: (r: CarRecommendation) => r.car.transmission,
      highlight: () => false,
    },
    {
      label: "Seating",
      icon: <Users className="w-3.5 h-3.5 text-gray-400" />,
      getValue: (r: CarRecommendation) => `${r.car.seatingCapacity} seats`,
      highlight: (r: CarRecommendation) =>
        r.car.seatingCapacity === Math.max(...recommendations.map(x => x.car.seatingCapacity)),
    },
    {
      label: "Body Type",
      icon: null,
      getValue: (r: CarRecommendation) => r.car.bodyType,
      highlight: () => false,
    },
    {
      label: "Match Score",
      icon: null,
      getValue: (r: CarRecommendation) => (
        <span className={`font-bold ${r.score >= 80 ? "text-green-600" : r.score >= 60 ? "text-yellow-600" : "text-gray-600"}`}>
          {r.score}%
        </span>
      ),
      highlight: (r: CarRecommendation) => r.score === Math.max(...recommendations.map(x => x.score)),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full min-w-[600px]" role="table" aria-label="Car comparison table">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left p-4 text-sm font-semibold text-gray-500 w-32" scope="col">
              Feature
            </th>
            {recommendations.map((rec, i) => (
              <th key={rec.car.id} className="p-4 text-center" scope="col">
                <div className="flex flex-col items-center gap-1">
                  {i === 0 && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                      Best Match
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {rec.car.make} {rec.car.model}
                  </span>
                  <span className="text-xs text-gray-400 truncate max-w-[120px]">
                    {rec.car.variant}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-gray-50 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <td className="p-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                  {row.icon}
                  {row.label}
                </div>
              </td>
              {recommendations.map((rec) => {
                const isHighlighted = row.highlight(rec);
                return (
                  <td
                    key={rec.car.id}
                    className={`p-4 text-center text-sm ${isHighlighted ? "font-semibold text-green-700 bg-green-50/50" : "text-gray-700"}`}
                  >
                    {row.getValue(rec)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

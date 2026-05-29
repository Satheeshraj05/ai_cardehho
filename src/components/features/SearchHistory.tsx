"use client";

import { useEffect } from "react";
import { Clock, ChevronRight, Search } from "lucide-react";
import { useCarStore } from "@/store/useCarStore";
import { formatDate, formatPrice } from "@/lib/utils";
import { SearchHistoryItem } from "@/lib/types";
import axios from "axios";

interface SearchHistoryProps {
  onSelectHistory?: (item: SearchHistoryItem) => void;
}

export default function SearchHistory({ onSelectHistory }: SearchHistoryProps) {
  const { searchHistory, setSearchHistory, historyLoading, setHistoryLoading } = useCarStore();

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await axios.get<SearchHistoryItem[]>("/api/history");
        setSearchHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    void fetchHistory();
  }, [setSearchHistory, setHistoryLoading]);

  if (historyLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (searchHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No searches yet</p>
        <p className="text-gray-400 text-xs mt-1">Your search history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {searchHistory.map((item) => {
        const prefs = item.preferences;
        const topCar = item.recommendations[0];

        return (
          <button
            key={item.id}
            onClick={() => onSelectHistory?.(item)}
            className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
            aria-label={`View results for: ${item.query}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate mb-2">
                  {item.query}
                </p>

                {/* Preference tags */}
                <div className="flex flex-wrap gap-1.5">
                  {prefs.budget && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {formatPrice(prefs.budget)}
                    </span>
                  )}
                  {prefs.bodyType && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {prefs.bodyType}
                    </span>
                  )}
                  {prefs.fuelType && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {prefs.fuelType}
                    </span>
                  )}
                  {prefs.priority && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                      Priority: {prefs.priority}
                    </span>
                  )}
                </div>

                {/* Top result */}
                {topCar && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Top pick:</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {topCar.car.make} {topCar.car.model}
                    </span>
                    <span className={`text-xs font-bold ${topCar.score >= 80 ? "text-green-600" : "text-yellow-600"}`}>
                      {topCar.score}%
                    </span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

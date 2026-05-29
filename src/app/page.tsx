"use client";

import { useCarStore } from "@/store/useCarStore";
import SearchBox from "@/components/features/SearchBox";
import ResultsSection from "@/components/features/ResultsSection";
import { Sparkles, Shield, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Describe in plain English, get smart recommendations",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "NCAP ratings and safety scores for every car",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: TrendingUp,
    title: "Smart Ranking",
    description: "Weighted scoring based on your priorities",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Top 5 cars with detailed comparison in seconds",
    color: "text-yellow-600 bg-yellow-50",
  },
];

export default function HomePage() {
  const { currentResult, isLoading } = useCarStore();
  const showResults = currentResult !== null || isLoading;

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {!showResults ? (
        /* Hero / Landing state */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-blue-100">
              <Sparkles className="w-4 h-4" />
              AI-Powered Car Recommendations
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Find your perfect car
              <br />
              <span className="text-blue-600">in plain English</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Stop comparing hundreds of cars manually. Just describe what you need and our AI will shortlist the best options for you.
            </p>

            {/* Search box */}
            <SearchBox />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-3`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-500 mt-1">Indian Cars</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">10+</div>
                <div className="text-sm text-gray-500 mt-1">Top Brands</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">AI</div>
                <div className="text-sm text-gray-500 mt-1">Powered</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results state */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Compact search box at top */}
          <div className="mb-8">
            <SearchBox />
          </div>

          {/* Loading state */}
          {isLoading && !currentResult && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-blue-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-blue-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-blue-200 rounded w-1/2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                      <div className="h-3 bg-gray-200 rounded w-3/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <ResultsSection />
        </div>
      )}
    </div>
  );
}

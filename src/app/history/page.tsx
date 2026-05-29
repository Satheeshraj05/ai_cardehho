"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchHistory from "@/components/features/SearchHistory";
import { useCarStore } from "@/store/useCarStore";
import { SearchHistoryItem } from "@/lib/types";
import { History, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HistoryPage() {
  const router = useRouter();
  const { setResult, setQuery } = useCarStore();
  const [selectedItem, setSelectedItem] = useState<SearchHistoryItem | null>(null);

  const handleSelectHistory = (item: SearchHistoryItem) => {
    setSelectedItem(item);
    setResult({
      preferences: item.preferences,
      recommendations: item.recommendations,
      explanation: item.explanation,
    });
    setQuery(item.query);
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Go back to home">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <History className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Search History</h1>
            <p className="text-sm text-gray-500">Your previous car searches</p>
          </div>
        </div>
      </div>

      {/* History list */}
      <SearchHistory onSelectHistory={handleSelectHistory} />

      {selectedItem && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Click any search to view its recommendations
        </p>
      )}
    </div>
  );
}

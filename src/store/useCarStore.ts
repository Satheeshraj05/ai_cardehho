import { create } from "zustand";
import { RecommendationResponse, SearchHistoryItem } from "@/lib/types";

interface CarStore {
  // Current recommendation state
  currentQuery: string;
  currentResult: RecommendationResponse | null;
  isLoading: boolean;
  error: string | null;

  // Search history
  searchHistory: SearchHistoryItem[];
  historyLoading: boolean;

  // Actions
  setQuery: (query: string) => void;
  setResult: (result: RecommendationResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchHistory: (history: SearchHistoryItem[]) => void;
  setHistoryLoading: (loading: boolean) => void;
  addToHistory: (item: SearchHistoryItem) => void;
  clearResult: () => void;
}

export const useCarStore = create<CarStore>((set) => ({
  currentQuery: "",
  currentResult: null,
  isLoading: false,
  error: null,
  searchHistory: [],
  historyLoading: false,

  setQuery: (query) => set({ currentQuery: query }),
  setResult: (result) => set({ currentResult: result }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSearchHistory: (history) => set({ searchHistory: history }),
  setHistoryLoading: (loading) => set({ historyLoading: loading }),
  addToHistory: (item) =>
    set((state) => ({ searchHistory: [item, ...state.searchHistory] })),
  clearResult: () =>
    set({ currentResult: null, error: null }),
}));

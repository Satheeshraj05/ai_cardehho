"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useCarStore } from "@/store/useCarStore";
import axios from "axios";
import { RecommendationResponse } from "@/lib/types";

const EXAMPLES = [
  "Safe SUV for family of 4 under 15 lakh",
  "Best mileage car under 10 lakh for city driving",
  "Automatic diesel SUV under 20 lakh with 7 seats",
];

export default function SearchBox() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setResult, setError, addToHistory } = useCarStore();

  // auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  async function submit(overrideText?: string) {
    const q = (overrideText ?? text).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<RecommendationResponse>("/api/recommend", { query: q });
      setResult(res.data);
      addToHistory({
        id: Date.now(),
        query: q,
        preferences: res.data.preferences,
        recommendations: res.data.recommendations,
        explanation: res.data.explanation,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data as { error?: string })?.error ?? "Request failed"
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  const hasText = text.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md focus-within:border-blue-500 transition-colors duration-200">
        <div className="flex items-end gap-3 p-4">
          {/* Icon */}
          <div className="mb-1 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>

          {/* Input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="e.g. Safe SUV for family of 4 under 15 lakh…"
            rows={1}
            disabled={loading}
            suppressHydrationWarning
            className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-400 text-base leading-relaxed focus:outline-none min-h-[36px] max-h-[160px] disabled:opacity-60"
          />

          {/* Send button */}
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!hasText || loading}
            className="mb-0.5 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150
              disabled:bg-gray-100 disabled:cursor-not-allowed
              enabled:bg-blue-600 enabled:hover:bg-blue-700 enabled:active:scale-95 enabled:shadow-sm"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <ArrowRight className={`w-4 h-4 ${hasText ? "text-white" : "text-gray-400"}`} />
            }
          </button>
        </div>

        {loading && (
          <div className="px-5 pb-4 flex items-center gap-2 text-sm text-blue-600">
            {["0ms", "150ms", "300ms"].map((d) => (
              <span key={d} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: d }} />
            ))}
            <span>Analyzing your requirements…</span>
          </div>
        )}
      </div>

      {/* Example chips */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center" suppressHydrationWarning>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            disabled={loading}
            suppressHydrationWarning
            onClick={() => { setText(ex); void submit(ex); }}
            className="text-xs text-gray-500 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded-full px-3 py-1.5 transition-colors flex items-center gap-1 disabled:opacity-40"
          >
            <Search className="w-3 h-3" />
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

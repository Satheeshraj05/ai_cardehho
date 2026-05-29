"use client";

import ReactMarkdown from "react-markdown";
import { Sparkles, Target, Fuel, Shield, Users, Zap, Tag, MapPin } from "lucide-react";
import { UserPreferences } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface AIExplanationProps {
  explanation: string;
  preferences: UserPreferences;
  query: string;
}

interface PrefTag {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function AIExplanation({ explanation, preferences, query }: AIExplanationProps) {
  const prefTags: PrefTag[] = [];

  if (preferences.budget) {
    prefTags.push({
      label: "Budget",
      value: formatPrice(preferences.budget),
      icon: <Tag className="w-3 h-3" />,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    });
  }
  if (preferences.bodyType) {
    prefTags.push({
      label: "Body",
      value: preferences.bodyType,
      icon: <Target className="w-3 h-3" />,
      color: "bg-violet-50 text-violet-700 border-violet-100",
    });
  }
  if (preferences.fuelType) {
    prefTags.push({
      label: "Fuel",
      value: preferences.fuelType,
      icon: <Fuel className="w-3 h-3" />,
      color: "bg-orange-50 text-orange-700 border-orange-100",
    });
  }
  if (preferences.transmission) {
    prefTags.push({
      label: "Transmission",
      value: preferences.transmission,
      icon: <Zap className="w-3 h-3" />,
      color: "bg-yellow-50 text-yellow-700 border-yellow-100",
    });
  }
  if (preferences.familySize) {
    prefTags.push({
      label: "Family",
      value: `${preferences.familySize} people`,
      icon: <Users className="w-3 h-3" />,
      color: "bg-pink-50 text-pink-700 border-pink-100",
    });
  }
  if (preferences.usageType) {
    prefTags.push({
      label: "Usage",
      value: preferences.usageType,
      icon: <MapPin className="w-3 h-3" />,
      color: "bg-teal-50 text-teal-700 border-teal-100",
    });
  }
  if (preferences.priority) {
    prefTags.push({
      label: "Priority",
      value: preferences.priority,
      icon: <Shield className="w-3 h-3" />,
      color: "bg-green-50 text-green-700 border-green-100",
    });
  }

  return (
    <div className="rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">AI Analysis</span>
        <span className="ml-auto text-white/60 text-xs">Powered by Mistral</span>
      </div>

      <div className="bg-white p-5 space-y-4">
        {/* Original query */}
        <div className="flex items-start gap-2">
          <div className="w-1 self-stretch rounded-full bg-blue-200 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Your query</p>
            <p className="text-sm text-gray-600 italic">&ldquo;{query}&rdquo;</p>
          </div>
        </div>

        {/* Extracted preferences */}
        {prefTags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Extracted Requirements
            </p>
            <div className="flex flex-wrap gap-2">
              {prefTags.map((tag, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${tag.color}`}
                >
                  {tag.icon}
                  <span className="opacity-70">{tag.label}:</span>
                  <span className="font-semibold">{tag.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* AI explanation with markdown rendering */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recommendation Reasoning
          </p>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5
            prose-ul:list-disc prose-ul:pl-4">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>

        {/* No preferences tip */}
        {prefTags.length === 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <span className="text-amber-500 text-base leading-none">💡</span>
            <p className="text-xs text-amber-700">
              Try being more specific — mention budget, body type, or fuel preference for sharper results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

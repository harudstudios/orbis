"use client";

import { getTrustLevel, type TrustLevel } from "@/lib/utils/trust";

const TRUST_STYLES: Record<TrustLevel, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-gray-500/15", text: "text-gray-400", label: "Low" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Medium" },
  high: { bg: "bg-green-500/15", text: "text-green-400", label: "High" },
  verified: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Verified" },
};

export function TrustBadge({ score, size = "sm" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const level = getTrustLevel(score);
  const style = TRUST_STYLES[level];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${style.bg} ${style.text} ${sizeClasses[size]}`}>
      <span className="font-semibold">{score}</span>
      <span className="opacity-75">· {style.label}</span>
    </span>
  );
}

export function TrustBar({ score, max = 30 }: { score: number; max?: number }) {
  const level = getTrustLevel(score);
  const pct = Math.min((score / max) * 100, 100);
  const barColors: Record<TrustLevel, string> = {
    low: "bg-gray-500",
    medium: "bg-yellow-500",
    high: "bg-green-500",
    verified: "bg-blue-500",
  };

  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColors[level]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

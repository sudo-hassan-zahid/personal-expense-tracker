"use client";

import { Activity, TrendingDown, TrendingUp } from "lucide-react";

const signals = [
  { label: "Cashflow", value: "+2.4%", tone: "up" },
  { label: "Food", value: "-1.1%", tone: "down" },
  { label: "Savings", value: "+4.8%", tone: "up" },
  { label: "Bills", value: "-0.6%", tone: "down" },
  { label: "Income", value: "+1.9%", tone: "up" },
  { label: "Travel", value: "-2.0%", tone: "down" },
] as const;

export function MarketMotionStrip() {
  return (
    <div className="motion-safe:animate-slide-up rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark)/80 px-3 py-2 shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 text-caption font-semibold uppercase text-(--color-muted)">
          <Activity size={14} className="text-(--color-primary)" />
          Live Pulse
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="market-motion-track flex w-max items-center gap-4">
            {[...signals, ...signals].map((signal, index) => {
              const isUp = signal.tone === "up";
              const Icon = isUp ? TrendingUp : TrendingDown;
              return (
                <div
                  key={`${signal.label}-${index}`}
                  className="flex items-center gap-1.5 whitespace-nowrap text-caption"
                >
                  <Icon
                    size={14}
                    className={isUp ? "text-(--color-trading-up)" : "text-(--color-trading-down)"}
                  />
                  <span className="text-(--color-on-dark)">{signal.label}</span>
                  <span
                    className={isUp ? "text-(--color-trading-up)" : "text-(--color-trading-down)"}
                  >
                    {signal.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

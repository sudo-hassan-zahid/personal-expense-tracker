/**
 * UI component: Calendar.tsx
 */
"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Calendar({
  selected,
  onSelect,
  className = "",
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
  className?: string;
}) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div
      className={`bg-(--color-surface-card-dark) border border-(--color-hairline-on-dark) rounded-xl p-4 w-full max-w-[300px] shadow-2xl ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-body-md font-bold text-(--color-on-dark)">
          {format(currentMonth, "MMMM yyyy")}
        </h4>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-(--color-surface-elevated-dark) rounded-md text-(--color-muted) hover:text-(--color-on-dark) transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-(--color-surface-elevated-dark) rounded-md text-(--color-muted) hover:text-(--color-on-dark) transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-(--color-muted) uppercase py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = selected && isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={idx}
              onClick={() => onSelect(day)}
              className={`
                h-8 md:h-9 w-8 md:w-9 rounded-lg flex items-center justify-center text-body-sm transition-all

                ${!isCurrentMonth ? "text-(--color-muted) opacity-30" : "text-(--color-on-dark)"}
                ${isSelected ? "bg-(--color-primary) text-(--color-on-primary) font-bold scale-110 shadow-lg shadow-(--color-primary)/20" : "hover:bg-(--color-surface-elevated-dark)"}
                ${isToday && !isSelected ? "ring-1 ring-(--color-primary) text-(--color-primary)" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

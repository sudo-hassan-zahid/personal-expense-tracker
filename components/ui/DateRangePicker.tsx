/**
 * UI component: DateRangePicker.tsx
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { format, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./Calendar";

export function DateRangePicker({
  onRangeChange,
  className = "",
}: {
  onRangeChange: (start: Date, end: Date) => void;
  className?: string;
}) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
      onRangeChange(startDate, date);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-control flex items-center gap-2 rounded-xl px-4 py-2"
      >
        <CalendarIcon size={16} className="text-(--color-muted)" />
        <span>
          {startDate ? format(startDate, "MMM d") : "Start"} -{" "}
          {endDate ? format(endDate, "MMM d, yyyy") : "End"}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed md:absolute inset-x-4 md:inset-auto z-50 mt-2 md:right-0 flex justify-center md:block animate-in fade-in zoom-in duration-200 origin-top-right">
          <Calendar selected={startDate} onSelect={handleSelect} />
          {/* Note: A true range picker would highlight days between, but for simplicity and elegance we'll start with this */}
        </div>
      )}
    </div>
  );
}


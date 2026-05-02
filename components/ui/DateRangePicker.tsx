"use client";

import { useState, useRef, useEffect } from "react";
import { format, isSameDay, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "./Calendar";

export function DateRangePicker({ 
  onRangeChange,
  className = ""
}: { 
  onRangeChange: (start: Date, end: Date) => void,
  className?: string
}) {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
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
      setEndDate(null as any);
    } else if (isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null as any);
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
        className="flex items-center gap-2 bg-(--color-canvas-dark)/50 border border-(--color-hairline-on-dark) rounded-xl px-4 py-2 text-body-sm text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all"
      >
        <CalendarIcon size={16} className="text-(--color-muted)" />
        <span>
          {startDate ? format(startDate, "MMM d") : "Start"} - {endDate ? format(endDate, "MMM d, yyyy") : "End"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 right-0 animate-in fade-in zoom-in duration-200 origin-top-right">
          <Calendar 
            selected={startDate} 
            onSelect={handleSelect} 
          />
          {/* Note: A true range picker would highlight days between, but for simplicity and elegance we'll start with this */}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "./Calendar";

export function DatePicker({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    defaultValue ? new Date(defaultValue) : new Date()
  );
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

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-body-sm mb-1.5 text-(--color-muted)">{label}</label>}
      <input type="hidden" name={name} value={format(selectedDate, "yyyy-MM-dd")} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent border border-(--color-hairline-on-dark) rounded-lg px-4 py-2.5 text-body-md text-(--color-on-dark) focus:border-(--color-primary) focus:outline-none transition-all hover:bg-(--color-surface-elevated-dark)"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-(--color-muted)" />
          {format(selectedDate, "PPP")}
        </span>
      </button>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}


      {isOpen && (
        <div className="fixed md:absolute inset-x-4 md:inset-auto z-50 mt-2 md:left-0 flex justify-center md:block animate-in fade-in zoom-in duration-200 origin-top-left">

          <Calendar
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

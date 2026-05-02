"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Trash2, Search, ArrowUpDown, Filter, X as CloseIcon } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DeleteButton } from "./DeleteButton";
import { deleteExpense } from "@/actions/expense";
import { deleteIncome } from "@/actions/income";
import { PaginationControls } from "./PaginationControls";
import { DateRangePicker } from "./ui/DateRangePicker";

interface Transaction {
  id: string;
  amount: number | string;
  category?: string;
  source?: string;
  date: string;
  note: string;
  type: "expense" | "income";
}

import { useTransactions } from "@/hooks/useTransactions";

export function TransactionList({
  initialTransactions,
  currency,
  paginationEnabled,
  itemsPerPage: initialItemsPerPage,
}: {
  initialTransactions: Transaction[];
  currency: string;
  paginationEnabled: boolean;
  itemsPerPage: number;
}) {
  const {
    search, setSearch,
    sortField, setSortField,
    sortOrder, setSortOrder,
    currentPage, setCurrentPage,
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    startDate, setStartDate,
    endDate, setEndDate,
    sortedTransactions,
    totalItems,
    totalPages,
    displayedTransactions
  } = useTransactions(initialTransactions, initialItemsPerPage);

  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Monitor for new transactions to show highlight
  const [prevCount, setPrevCount] = useState(initialTransactions.length);
  useEffect(() => {
    if (initialTransactions.length > prevCount) {
      const newest = initialTransactions[0];
      if (newest) {
        setNewlyAddedId(newest.id);
        const timer = setTimeout(() => setNewlyAddedId(null), 3000);
        return () => clearTimeout(timer);
      }
    }
    setPrevCount(initialTransactions.length);
  }, [initialTransactions]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="relative w-full md:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-muted)">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-(--color-canvas-dark)/50 border border-(--color-hairline-on-dark) rounded-xl text-body-md text-(--color-on-dark) focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) focus:outline-none transition-all"
          />
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${showFilters ? 'bg-(--color-primary) text-white border-(--color-primary)' : 'bg-(--color-canvas-dark)/50 border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-on-dark)'}`}
        >
          <Filter size={18} />
          <span className="text-body-sm font-medium">Advanced Filters</span>
          {(minAmount || maxAmount || (startDate && endDate)) && (
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-(--color-canvas-dark)/30 border border-(--color-hairline-on-dark) rounded-xl p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-(--color-muted) font-medium">Amount Range</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-lg px-3 py-1.5 text-body-sm focus:border-(--color-primary) outline-none"
                />
                <span className="text-(--color-muted)">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-lg px-3 py-1.5 text-body-sm focus:border-(--color-primary) outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-(--color-muted) font-medium">Date Range</label>
              <DateRangePicker 
                onRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }} 
              />
            </div>

            <div className="flex items-end justify-end">
              <button 
                onClick={() => {
                  setMinAmount("");
                  setMaxAmount("");
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-caption text-(--color-muted) hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <CloseIcon size={14} />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 text-caption text-(--color-muted) pb-3 border-b border-(--color-hairline-on-dark) px-2">
          <div className="whitespace-nowrap pl-2">#</div>
          <div className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1" onClick={() => toggleSort("category")}>
            Description <ArrowUpDown size={12} />
          </div>
          <div className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1" onClick={() => toggleSort("date")}>
            Date <ArrowUpDown size={12} />
          </div>
          <div className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1" onClick={() => toggleSort("type")}>
            Type <ArrowUpDown size={12} />
          </div>
          <div className="text-right cursor-pointer hover:text-(--color-on-dark) flex items-center justify-end gap-1" onClick={() => toggleSort("amount")}>
            Amount <ArrowUpDown size={12} />
          </div>
          <div className="text-right">Action</div>
        </div>

        {displayedTransactions.length === 0 && (
          <div className="py-12 text-center text-body-md text-(--color-muted) bg-(--color-canvas-dark)/20 rounded-xl border border-dashed border-(--color-hairline-on-dark)">
            No transactions found matching your criteria.
          </div>
        )}

        {displayedTransactions.map((t, i) => (
          <div 
            key={t.id + t.type} 
            className={`grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 items-center py-3 border-b border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all duration-500 px-2 -mx-2 rounded-lg animate-slide-up ${i < 5 ? `stagger-${i + 1}` : 'opacity-100'} ${newlyAddedId === t.id ? 'bg-blue-500/10 ring-1 ring-blue-500/30 animate-pulse' : ''}`}
          >
            <div className="text-number-sm text-(--color-muted) pl-2">
              {((currentPage - 1) * initialItemsPerPage) + i + 1}
            </div>
            <div className="flex items-center gap-3 text-left">
              {t.type === "income" ? (
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <ArrowDownRight size={16} />
                </div>
              )}
              <div className="overflow-hidden">
                <div className="text-body-md text-(--color-on-dark) font-medium truncate">
                  {t.note || "No note"}
                </div>
                <div className="text-caption text-(--color-muted) truncate">
                  {t.type === "income" ? t.source : t.category}
                </div>
              </div>
            </div>
            <div className="text-number-sm text-(--color-muted)">
              {format(new Date(t.date), "MMM d, yyyy")}
            </div>
            <div className="text-body-sm capitalize">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.type === 'income' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {t.type}
              </span>
            </div>
            <div className={`text-number-md font-semibold text-right ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
              {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount), currency).replace(/^[^\d]*/, '')}
            </div>
            <div className="text-right flex justify-end">
              <DeleteButton
                action={async () => {
                  if (t.type === "income") await deleteIncome(t.id);
                  else await deleteExpense(t.id);
                }}
                successMessage={`${t.type === "income" ? "Income" : "Expense"} deleted successfully`}
                className="p-2 text-(--color-muted) hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
              >
                <Trash2 size={16} />
              </DeleteButton>
            </div>
          </div>
        ))}
      </div>

      {paginationEnabled && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={initialItemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

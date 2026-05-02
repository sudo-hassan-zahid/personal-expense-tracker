"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Trash2, Search, ArrowUpDown, Filter, X as CloseIcon, Pencil, AlertCircle } from "lucide-react";
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
  status?: string;
  created_at: string;
}

import { useTransactions } from "@/hooks/useTransactions";
import { EditTransactionModal } from "./EditTransactionModal";
import { Category } from "./CategorySelect";

/**
 * Component for displaying and managing the list of transactions.
 * Supports sorting, searching, pagination, and editing.
 */
export function TransactionList({
  initialTransactions,
  currency,
  paginationEnabled,
  itemsPerPage,
  expenseCategories,
  incomeCategories,
  enableStatusTracking,
  isWideView = false,
}: {
  initialTransactions: Transaction[];
  currency: string;
  paginationEnabled: boolean;
  itemsPerPage: number;
  expenseCategories: Category[];
  incomeCategories: Category[];
  enableStatusTracking: boolean;
  isWideView?: boolean;
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
  } = useTransactions(initialTransactions, itemsPerPage);

  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        <div className={`grid ${enableStatusTracking ? 'grid-cols-[48px_1fr_140px_100px_120px_100px_80px]' : 'grid-cols-[48px_1fr_140px_100px_120px_80px]'} gap-4 text-caption text-(--color-muted) pb-3 border-b border-(--color-hairline-on-dark) px-2`}>
          <div className="pl-2">#</div>
          <div className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1" onClick={() => toggleSort("category")}>
            Description <ArrowUpDown size={12} className={sortField === "category" ? "text-(--color-primary)" : ""} />
          </div>
          <div className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1" onClick={() => toggleSort("date")}>
            Date <ArrowUpDown size={12} className={sortField === "date" ? "text-(--color-primary)" : ""} />
          </div>
          <div className="text-center cursor-pointer hover:text-(--color-on-dark) flex items-center justify-center gap-1" onClick={() => toggleSort("type")}>
            Type <ArrowUpDown size={12} className={sortField === "type" ? "text-(--color-primary)" : ""} />
          </div>
          <div className="text-right cursor-pointer hover:text-(--color-on-dark) flex items-center justify-end gap-1" onClick={() => toggleSort("amount")}>
            Amount <ArrowUpDown size={12} className={sortField === "amount" ? "text-(--color-primary)" : ""} />
          </div>
          {enableStatusTracking && (
            <div 
              className="text-center cursor-pointer hover:text-(--color-on-dark) flex items-center justify-center gap-1 transition-colors" 
              onClick={() => toggleSort("status")}
            >
              Status <ArrowUpDown size={12} className={sortField === "status" ? "text-(--color-primary)" : ""} />
            </div>
          )}
          <div className="text-right pr-2">Action</div>
        </div>

        {displayedTransactions.length === 0 && (
          <div className="py-12 text-center text-body-md text-(--color-muted) bg-(--color-canvas-dark)/20 rounded-xl border border-dashed border-(--color-hairline-on-dark)">
            No transactions found matching your criteria.
          </div>
        )}

        {displayedTransactions.map((t, i) => (
          <div 
            key={t.id + t.type} 
            className={`grid ${enableStatusTracking ? 'grid-cols-[48px_1fr_140px_100px_120px_100px_80px]' : 'grid-cols-[48px_1fr_140px_100px_120px_80px]'} gap-4 items-center py-3 border-b border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all duration-500 px-2 -mx-2 rounded-lg animate-slide-up ${i < 5 ? `stagger-${i + 1}` : 'opacity-100'} ${newlyAddedId === t.id ? 'bg-blue-500/10 ring-1 ring-blue-500/30 animate-pulse' : ''}`}
          >
            <div className="text-number-sm text-(--color-muted) pl-2">
              {((currentPage - 1) * itemsPerPage) + i + 1}
            </div>
            <div className="flex items-center gap-3 text-left min-w-0">
              {t.type === "income" ? (
                <div className="w-8 h-8 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <ArrowDownRight size={16} />
                </div>
              )}
              <div className="overflow-hidden min-w-0 flex-1">
                <div className={`text-body-md text-(--color-on-dark) font-medium ${isWideView ? 'break-words' : 'truncate'}`} title={t.note || "No note"}>
                  {t.note || "No note"}
                </div>
                <div className={`text-caption text-(--color-muted) ${isWideView ? 'break-words' : 'truncate'}`} title={(t.type === "income" ? t.source : t.category) || ""}>
                  {t.type === "income" ? t.source : t.category}
                </div>
              </div>
            </div>
            <div className="text-number-sm text-(--color-muted) truncate">
              {format(new Date(t.date), "MMM d, yyyy")}
            </div>
            <div className="text-body-sm capitalize flex justify-center">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.type === 'income' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {t.type}
              </span>
            </div>
            <div className={`text-number-md font-semibold text-right ${t.type === 'income' ? 'text-green-500' : 'text-red-500'} truncate`}>
              {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount), currency).replace(/^[^\d]*/, '')}
            </div>
            {enableStatusTracking && (
              <div className="text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.status === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                  {t.status || 'done'}
                </span>
              </div>
            )}
            <div className="text-right flex justify-end gap-1 pr-2">
              <button
                onClick={() => setEditingTransaction(t)}
                className="p-2 text-(--color-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/10 rounded-md transition-all"
              >
                <Pencil size={16} />
              </button>
              <DeleteButton
                onClick={() => setTransactionToDelete(t)}
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
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {editingTransaction && (
        <EditTransactionModal 
          transaction={editingTransaction}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          showStatusTracking={enableStatusTracking}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-(--color-surface-card-dark) border border-(--color-hairline-on-dark) rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-title-md text-(--color-on-dark) mb-2">Confirm Deletion</h3>
                <p className="text-body-sm text-(--color-muted)">
                  Are you sure you want to delete this {transactionToDelete.type}? This action cannot be undone.
                </p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setTransactionToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-xl border border-(--color-hairline-on-dark) text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark) transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      if (transactionToDelete.type === "income") await deleteIncome(transactionToDelete.id);
                      else await deleteExpense(transactionToDelete.id);
                      import("sonner").then(({ toast }) => toast.success("Transaction deleted successfully"));
                      setTransactionToDelete(null);
                    } catch (error: any) {
                      import("sonner").then(({ toast }) => toast.error(error.message || "Failed to delete"));
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

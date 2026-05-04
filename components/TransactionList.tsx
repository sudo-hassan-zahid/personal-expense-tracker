/**
 * Component: TransactionList.tsx
 */
"use client";

import { useState, useEffect, memo, useTransition } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Search,
  ArrowUpDown,
  Filter,
  X as CloseIcon,
  Pencil,
  AlertCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { DeleteButton } from "./DeleteButton";
import { deleteExpense } from "@/actions/expense";
import { deleteIncome } from "@/actions/income";
import { bulkUpdateExpenses } from "@/actions/expense";
import { bulkUpdateIncomes } from "@/actions/income";
import { PaginationControls } from "./PaginationControls";
import { DateRangePicker } from "./ui/DateRangePicker";
import { toast } from "sonner";
import { useTransactions } from "@/hooks/useTransactions";
import { EditTransactionModal } from "./EditTransactionModal";
import { Transaction, Category } from "@/types";
import { HelpLabel, HelpTip } from "./HelpTip";

// Memoized Row Component for maximum performance
const TransactionRow = memo(
  ({
    t,
    index,
    currency,
    enableStatusTracking,
    isWideView,
    newlyAddedId,
    onEdit,
    onDelete,
    selected,
    onToggleSelected,
  }: {
    t: Transaction;
    index: number;
    currency: string;
    enableStatusTracking: boolean;
    isWideView: boolean;
    newlyAddedId: string | null;
    onEdit: (t: Transaction) => void;
    onDelete: (t: Transaction) => void;
    selected: boolean;
    onToggleSelected: (t: Transaction) => void;
  }) => {
    return (
      <div
        className={`flex flex-col md:grid ${enableStatusTracking ? "md:grid-cols-[48px_1fr_140px_100px_120px_100px_80px]" : "md:grid-cols-[48px_1fr_140px_100px_120px_80px]"} gap-2 md:gap-4 items-start md:items-center py-4 md:py-3 border-b border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all duration-200 px-3 md:px-2 -mx-3 md:-mx-2 rounded-xl md:rounded-lg ${index < 10 ? "animate-slide-up" : "opacity-100"} ${index < 5 ? `stagger-${index + 1}` : ""} ${newlyAddedId === t.id ? "bg-blue-500/10 ring-1 ring-blue-500/30 animate-pulse" : ""}`}
      >
        <div className="hidden md:block text-number-sm text-(--color-muted) pl-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelected(t)}
            className="accent-(--color-primary)"
            aria-label="Select transaction"
          />
        </div>

        <div className="flex items-center justify-between w-full md:contents">
          <div className="flex flex-col md:contents min-w-0">
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
                <div
                  className={`text-body-md text-(--color-on-dark) font-medium ${isWideView ? "break-words" : "truncate"}`}
                  title={t.note || "No note"}
                >
                  {t.note || "No note"}
                </div>
                <div
                  className={`text-caption text-(--color-muted) ${isWideView ? "break-words" : "truncate"}`}
                  title={(t.type === "income" ? t.source : t.category) || ""}
                >
                  {t.type === "income" ? t.source : t.category}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`text-number-md font-semibold text-right md:hidden ${t.type === "income" ? "text-green-500" : "text-red-500"} truncate`}
          >
            {t.type === "income" ? "+" : "-"}
            {formatCurrency(Number(t.amount), currency).replace(/^[^\d]*/, "")}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:contents mt-2 md:mt-0 pt-2 md:pt-0 border-t border-(--color-hairline-on-dark)/50 md:border-0">
          <div className="flex items-center justify-between gap-2 md:contents">
            <div className="text-number-sm text-(--color-muted) whitespace-nowrap md:truncate">
              <span className="md:hidden">{format(new Date(t.date), "MMM d")}</span>
              <span className="hidden md:inline">{format(new Date(t.date), "MMM d, yyyy")}</span>
            </div>

            <div className="text-body-sm capitalize flex justify-center">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.type === "income" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
              >
                {t.type}
              </span>
            </div>

            <div
              className={`hidden md:block text-number-md font-semibold text-right ${t.type === "income" ? "text-green-500" : "text-red-500"} truncate`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(Number(t.amount), currency).replace(/^[^\d]*/, "")}
            </div>

            {enableStatusTracking ? (
              <div className="text-center">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.status === "done" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}
                >
                  {t.status || "done"}
                </span>
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>

          <div className="text-right flex justify-end gap-1 md:pr-2">
            {t.type === "expense" && t.attachment_url && (
              <Link
                href={`/dashboard/attachments?path=${encodeURIComponent(t.attachment_url)}`}
                className="p-2 text-(--color-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/10 rounded-md transition-all"
                title="Open attachment"
              >
                <Paperclip size={16} />
              </Link>
            )}
            <button
              onClick={() => onEdit(t)}
              className="p-2 text-(--color-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/10 rounded-md transition-all"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton
              onClick={() => onDelete(t)}
              className="p-2 text-(--color-muted) hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
            >
              <Trash2 size={16} />
            </DeleteButton>
          </div>
        </div>
      </div>
    );
  }
);

TransactionRow.displayName = "TransactionRow";

export function TransactionList({
  initialTransactions,
  currency,
  paginationEnabled,
  itemsPerPage,
  expenseCategories,
  incomeCategories,
  enableStatusTracking,
  isWideView = false,
  onOptimisticDelete,
}: {
  initialTransactions: Transaction[];
  currency: string;
  paginationEnabled: boolean;
  itemsPerPage: number;
  expenseCategories: Category[];
  incomeCategories: Category[];
  enableStatusTracking: boolean;
  isWideView?: boolean;
  onOptimisticDelete?: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const optimisticTransactions = initialTransactions;

  const {
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    totalItems,
    totalPages,
    displayedTransactions,
  } = useTransactions(optimisticTransactions, paginationEnabled ? itemsPerPage : 0);

  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [bulkDate, setBulkDate] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  const [prevCount, setPrevCount] = useState(initialTransactions.length);
  useEffect(() => {
    if (initialTransactions.length > prevCount) {
      const newest = initialTransactions[0];
      if (newest) {
        const highlightTimer = setTimeout(() => setNewlyAddedId(newest.id), 0);
        const timer = setTimeout(() => setNewlyAddedId(null), 3000);
        return () => {
          clearTimeout(highlightTimer);
          clearTimeout(timer);
        };
      }
    }
    const countTimer = setTimeout(() => setPrevCount(initialTransactions.length), 0);
    return () => clearTimeout(countTimer);
  }, [initialTransactions, prevCount]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const toggleSelected = (transaction: Transaction) => {
    setSelectedTransactions((current) =>
      current.some((item) => item.id === transaction.id && item.type === transaction.type)
        ? current.filter((item) => !(item.id === transaction.id && item.type === transaction.type))
        : [...current, transaction]
    );
  };

  const applyBulkUpdate = async () => {
    const expenseIds = selectedTransactions.filter((t) => t.type === "expense").map((t) => t.id);
    const incomeIds = selectedTransactions.filter((t) => t.type === "income").map((t) => t.id);
    const sharedUpdates: Record<string, string> = {};
    if (bulkDate) sharedUpdates.date = bulkDate;
    if (bulkStatus) sharedUpdates.status = bulkStatus;

    try {
      if (expenseIds.length > 0) {
        await bulkUpdateExpenses(expenseIds, {
          ...sharedUpdates,
          ...(bulkCategory ? { category: bulkCategory } : {}),
        });
      }
      if (incomeIds.length > 0) {
        await bulkUpdateIncomes(incomeIds, {
          ...sharedUpdates,
          ...(bulkCategory ? { source: bulkCategory } : {}),
        });
      }
      toast.success("Bulk update complete");
      setSelectedTransactions([]);
      setBulkDate("");
      setBulkCategory("");
      setBulkStatus("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk update failed");
    }
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(
        selectedTransactions.map((transaction) =>
          transaction.type === "income"
            ? deleteIncome(transaction.id)
            : deleteExpense(transaction.id)
        )
      );
      toast.success("Selected transactions deleted");
      setSelectedTransactions([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk delete failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-2">
        <div className="relative w-full md:max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-muted) group-focus-within:text-(--color-primary) transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="form-control block w-full rounded-xl py-2.5 pl-10 pr-16 text-body-md"
          />
          <div className="absolute inset-y-0 right-9 hidden items-center sm:flex">
            <HelpTip label="Search transactions help">
              Searches notes, categories, sources, dates, and amounts in the currently loaded list.
            </HelpTip>
          </div>
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-(--color-muted) hover:text-(--color-on-dark) transition-colors"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all md:w-auto ${showFilters ? "bg-(--color-primary) text-white border-(--color-primary)" : "bg-(--color-canvas-dark)/50 border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-on-dark)"}`}
          >
            <Filter size={18} />
            <span className="text-body-sm font-medium">Advanced Filters</span>
            {(minAmount || maxAmount || (startDate && endDate)) && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>
          <HelpTip label="Advanced filters help">
            Open amount and date filters for a more precise transaction view.
          </HelpTip>
        </div>
      </div>

      {showFilters && (
        <div className="bg-(--color-canvas-dark)/30 border border-(--color-hairline-on-dark) rounded-xl p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <HelpLabel
                help="Show only transactions between the minimum and maximum amount."
                className="text-caption font-medium"
              >
                Amount Range
              </HelpLabel>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="form-control form-control-compact w-full"
                />
                <span className="text-(--color-muted)">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="form-control form-control-compact w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <HelpLabel
                help="Show only transactions between the selected start and end dates."
                className="text-caption font-medium"
              >
                Date Range
              </HelpLabel>
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

      {selectedTransactions.length > 0 && (
        <div className="bg-(--color-surface-elevated-dark) border border-(--color-hairline-on-dark) rounded-xl p-3 flex flex-col lg:flex-row gap-3 lg:items-center">
          <span className="text-body-sm text-(--color-on-dark)">
            {selectedTransactions.length} selected
          </span>
          <HelpTip label="Bulk actions help">
            Apply the entered date, category, source, or status to selected rows, or delete them
            together.
          </HelpTip>
          <input
            type="date"
            value={bulkDate}
            onChange={(e) => setBulkDate(e.target.value)}
            className="form-control"
          />
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="form-control"
          >
            <option value="">Category/source</option>
            {[...expenseCategories, ...incomeCategories].map((category) => (
              <option key={`${category.type}-${category.id}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {enableStatusTracking && (
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="form-control"
            >
              <option value="">Status</option>
              <option value="done">Done</option>
              <option value="pending">Pending</option>
            </select>
          )}
          <div className="flex gap-2 lg:ml-auto">
            <button
              onClick={applyBulkUpdate}
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-(--color-on-primary) text-button"
            >
              Apply
            </button>
            <button
              onClick={bulkDelete}
              className="px-4 py-2 rounded-lg bg-(--color-trading-down) text-white text-button"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedTransactions([])}
              className="px-4 py-2 rounded-lg border border-(--color-hairline-on-dark) text-button"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 relative">
        {/* Sorting header */}
        <div
          className={`hidden md:grid ${enableStatusTracking ? "grid-cols-[48px_1fr_140px_100px_120px_100px_80px]" : "grid-cols-[48px_1fr_140px_100px_120px_80px]"} gap-4 text-caption text-(--color-muted) pb-3 border-b border-(--color-hairline-on-dark) px-2`}
        >
          <div className="pl-2">#</div>
          <div
            className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1"
            onClick={() => toggleSort("note")}
          >
            Description{" "}
            <ArrowUpDown
              size={12}
              className={sortField === "note" ? "text-(--color-primary)" : ""}
            />
          </div>
          <div
            className="text-left cursor-pointer hover:text-(--color-on-dark) flex items-center gap-1"
            onClick={() => toggleSort("date")}
          >
            Date{" "}
            <ArrowUpDown
              size={12}
              className={sortField === "date" ? "text-(--color-primary)" : ""}
            />
          </div>
          <div
            className="text-center cursor-pointer hover:text-(--color-on-dark) flex items-center justify-center gap-1"
            onClick={() => toggleSort("type")}
          >
            Type{" "}
            <ArrowUpDown
              size={12}
              className={sortField === "type" ? "text-(--color-primary)" : ""}
            />
          </div>
          <div
            className="text-right cursor-pointer hover:text-(--color-on-dark) flex items-center justify-end gap-1"
            onClick={() => toggleSort("amount")}
          >
            Amount{" "}
            <ArrowUpDown
              size={12}
              className={sortField === "amount" ? "text-(--color-primary)" : ""}
            />
          </div>
          {enableStatusTracking && (
            <div
              className="text-center cursor-pointer hover:text-(--color-on-dark) flex items-center justify-center gap-1 transition-colors"
              onClick={() => toggleSort("status")}
            >
              Status{" "}
              <ArrowUpDown
                size={12}
                className={sortField === "status" ? "text-(--color-primary)" : ""}
              />
            </div>
          )}
          <div className="text-right pr-2">Action</div>
        </div>

        {displayedTransactions.length === 0 && (
          <div className="py-16 text-center text-body-md text-(--color-muted) bg-(--color-canvas-dark)/20 rounded-2xl border border-dashed border-(--color-hairline-on-dark) flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-(--color-surface-elevated-dark) flex items-center justify-center mb-2">
              <Search size={24} className="opacity-20" />
            </div>
            <p className="font-medium">No transactions found</p>
            <p className="text-caption opacity-70">Try adjusting your filters or search query.</p>
          </div>
        )}

        <div
          className={
            isPending
              ? "opacity-50 pointer-events-none transition-opacity duration-300"
              : "transition-opacity duration-300"
          }
        >
          {displayedTransactions.map((t, i) => (
            <TransactionRow
              key={t.id + t.type}
              t={t}
              index={i}
              currency={currency}
              enableStatusTracking={enableStatusTracking}
              isWideView={isWideView}
              newlyAddedId={newlyAddedId}
              onEdit={setEditingTransaction}
              onDelete={setTransactionToDelete}
              selected={selectedTransactions.some(
                (item) => item.id === t.id && item.type === t.type
              )}
              onToggleSelected={toggleSelected}
            />
          ))}
        </div>
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
                  Are you sure you want to delete this {transactionToDelete.type}? This action
                  cannot be undone.
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
                    const idToRemove = transactionToDelete.id;
                    setIsDeleting(true);

                    // Optimistic UI removal
                    if (onOptimisticDelete) {
                      startTransition(() => {
                        onOptimisticDelete(idToRemove);
                      });
                    }

                    try {
                      if (transactionToDelete.type === "income") await deleteIncome(idToRemove);
                      else await deleteExpense(idToRemove);
                      toast.success("Transaction deleted successfully");
                      setTransactionToDelete(null);
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Failed to delete");
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

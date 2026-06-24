/**
 * Component: TransactionList.tsx
 */
"use client";

import { useState, useEffect, memo, useMemo, useRef, useTransition, useCallback } from "react";
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
  ChevronDown,
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
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
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
        className={`flex flex-col md:grid ${enableStatusTracking ? "md:grid-cols-[48px_1fr_140px_100px_120px_100px_80px]" : "md:grid-cols-[48px_1fr_140px_100px_120px_80px]"} gap-2 md:gap-4 items-start md:items-center py-4 md:py-3 border-b border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all duration-200 px-3 md:px-2 -mx-3 md:mx-0 rounded-xl md:rounded-lg ${index < 10 ? "animate-slide-up" : "opacity-100"} ${index < 5 ? `stagger-${index + 1}` : ""} ${newlyAddedId === t.id ? "bg-blue-500/10 ring-1 ring-blue-500/30 animate-pulse" : ""}`}
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
                  title={t.note || "-"}
                >
                  {t.note || "-"}
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

type CategoryFilterOption = {
  key: string;
  name: string;
};

function CategoryFilterDropdown({
  value,
  expenseOptions,
  incomeOptions,
  onChange,
}: {
  value: string;
  expenseOptions: CategoryFilterOption[];
  incomeOptions: CategoryFilterOption[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allOptions = [...expenseOptions, ...incomeOptions];
  const selectedOption = allOptions.find((option) => option.key === value);
  const label = selectedOption?.name || "All categories and sources";

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const choose = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="form-control form-control-compact flex w-full min-w-0 items-center justify-between gap-2 text-left"
      >
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-(--color-muted) transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-72 overflow-y-auto rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) p-1 shadow-2xl shadow-black/40"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onClick={() => choose("")}
            className={`w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors ${
              value === ""
                ? "bg-(--color-primary) text-(--color-on-primary)"
                : "text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark)"
            }`}
          >
            All categories and sources
          </button>

          {expenseOptions.length > 0 && (
            <div className="mt-1">
              <div className="px-3 py-1.5 text-caption font-semibold uppercase tracking-wide text-(--color-muted)">
                Expense categories
              </div>
              {expenseOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="option"
                  aria-selected={value === option.key}
                  onClick={() => choose(option.key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors ${
                    value === option.key
                      ? "bg-(--color-primary) text-(--color-on-primary)"
                      : "text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark)"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}

          {incomeOptions.length > 0 && (
            <div className="mt-1 border-t border-(--color-hairline-on-dark) pt-1">
              <div className="px-3 py-1.5 text-caption font-semibold uppercase tracking-wide text-(--color-muted)">
                Income sources
              </div>
              {incomeOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="option"
                  aria-selected={value === option.key}
                  onClick={() => choose(option.key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors ${
                    value === option.key
                      ? "bg-(--color-primary) text-(--color-on-primary)"
                      : "text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark)"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
  initialSearch = "",
  isFirstRun = false,
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
  initialSearch?: string;
  isFirstRun?: boolean;
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
    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortedTransactions,
    totalItems,
    totalPages,
    displayedTransactions,
  } = useTransactions(optimisticTransactions, paginationEnabled ? itemsPerPage : 0, initialSearch);

  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [bulkDate, setBulkDate] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkAction, setBulkAction] = useState<"update" | "delete" | null>(null);

  const categoryFilterOptions = useMemo(
    () => ({
      expenses: expenseCategories.map((category) => ({
        key: `expense:${category.name.toLowerCase()}`,
        name: category.name,
      })),
      incomes: incomeCategories.map((category) => ({
        key: `income:${category.name.toLowerCase()}`,
        name: category.name,
      })),
    }),
    [expenseCategories, incomeCategories]
  );
  const allCategoryFilterOptions = useMemo(
    () => [...categoryFilterOptions.expenses, ...categoryFilterOptions.incomes],
    [categoryFilterOptions]
  );
  const selectedCategoryLabel =
    allCategoryFilterOptions.find((option) => option.key === categoryFilter)?.name || null;

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

  const selectedTypes = useMemo(
    () => new Set(selectedTransactions.map((transaction) => transaction.type)),
    [selectedTransactions]
  );
  const selectedTransactionKeys = useMemo(
    () => new Set(selectedTransactions.map((transaction) => `${transaction.type}:${transaction.id}`)),
    [selectedTransactions]
  );
  const hasMixedSelection = selectedTypes.size > 1;
  const bulkCategoryOptions = useMemo(() => {
    if (hasMixedSelection) return [];
    if (selectedTypes.has("income")) return incomeCategories;
    if (selectedTypes.has("expense")) return expenseCategories;
    return [];
  }, [expenseCategories, hasMixedSelection, incomeCategories, selectedTypes]);
  const hasBulkUpdates = bulkDate !== "" || bulkStatus !== "" || bulkCategory !== "";
  const filteredSummary = useMemo(
    () =>
      sortedTransactions.reduce(
        (summary, transaction) => {
          const isCompleted = !enableStatusTracking || (transaction.status || "done") === "done";
          const amount = Number(transaction.amount);
          summary.matchingTransactions += 1;

          if (isCompleted) {
            if (transaction.type === "income") {
              summary.totalIncome += amount;
            } else {
              summary.totalExpenses += amount;
            }
          }

          if (selectedCategoryLabel && isCompleted) {
            summary.selectedCategoryTotal += amount;
          }

          return summary;
        },
        {
          matchingTransactions: 0,
          totalIncome: 0,
          totalExpenses: 0,
          selectedCategoryTotal: 0,
        }
      ),
    [enableStatusTracking, selectedCategoryLabel, sortedTransactions]
  );

  const toggleSelected = useCallback((transaction: Transaction) => {
    setSelectedTransactions((current) =>
      current.some((item) => item.id === transaction.id && item.type === transaction.type)
        ? current.filter((item) => !(item.id === transaction.id && item.type === transaction.type))
        : [...current, transaction]
    );
  }, []);

  const applyBulkUpdate = async () => {
    if (bulkAction) return;
    if (!hasBulkUpdates) {
      toast.error("Choose at least one bulk field before applying changes.");
      return;
    }
    if (hasMixedSelection && bulkCategory) {
      toast.error("Category/source bulk updates only work when all selected rows share one type.");
      return;
    }

    const expenseIds = selectedTransactions.filter((t) => t.type === "expense").map((t) => t.id);
    const incomeIds = selectedTransactions.filter((t) => t.type === "income").map((t) => t.id);
    const sharedUpdates: Record<string, string> = {};
    if (bulkDate) sharedUpdates.date = bulkDate;
    if (bulkStatus) sharedUpdates.status = bulkStatus;

    setBulkAction("update");
    const toastId = toast.loading(`Updating ${selectedTransactions.length} transaction(s)...`);

    try {
      await Promise.all([
        expenseIds.length > 0
          ? bulkUpdateExpenses(expenseIds, {
              ...sharedUpdates,
              ...(bulkCategory ? { category: bulkCategory } : {}),
            })
          : Promise.resolve(),
        incomeIds.length > 0
          ? bulkUpdateIncomes(incomeIds, {
              ...sharedUpdates,
              ...(bulkCategory ? { source: bulkCategory } : {}),
            })
          : Promise.resolve(),
      ]);
      toast.success("Bulk update complete", { id: toastId });
      setSelectedTransactions([]);
      setBulkDate("");
      setBulkCategory("");
      setBulkStatus("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk update failed", { id: toastId });
    } finally {
      setBulkAction(null);
    }
  };

  const bulkDelete = async () => {
    if (bulkAction) return;

    setBulkAction("delete");
    const idsToRemove = selectedTransactions.map((transaction) => transaction.id);
    const toastId = toast.loading(`Deleting ${selectedTransactions.length} transaction(s)...`);

    try {
      await Promise.all(
        selectedTransactions.map((transaction) =>
          transaction.type === "income"
            ? deleteIncome(transaction.id)
            : deleteExpense(transaction.id)
        )
      );
      if (onOptimisticDelete) {
        startTransition(() => {
          idsToRemove.forEach((id) => onOptimisticDelete(id));
        });
      }
      toast.success("Selected transactions deleted", { id: toastId });
      setSelectedTransactions([]);
      setIsBulkDeleteOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk delete failed", { id: toastId });
    } finally {
      setBulkAction(null);
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
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-primary) bg-(--color-primary) px-4 py-2.5 text-button text-(--color-on-primary) transition-all md:w-auto ${showFilters ? "shadow-lg shadow-(--color-primary)/20" : "hover:bg-(--color-primary-active)"}`}
          >
            <Filter size={18} />
            <span>Advanced Filters</span>
            {(minAmount || maxAmount || categoryFilter || (startDate && endDate)) && (
              <span className="h-2 w-2 rounded-full bg-(--color-on-primary) animate-pulse" />
            )}
          </button>
          <HelpTip label="Advanced filters help" tooltipClassName="left-auto right-0 translate-x-0">
            Open amount and date filters for a more precise transaction view.
          </HelpTip>
        </div>
      </div>

      {showFilters && (
        <div className="bg-(--color-canvas-dark)/30 border border-(--color-hairline-on-dark) rounded-xl p-3 sm:p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(210px,0.9fr)_minmax(240px,1.1fr)_minmax(220px,1fr)_auto] xl:items-end">
            <div className="flex flex-col gap-1.5">
              <HelpLabel
                help="Show only transactions between the minimum and maximum amount."
                className="text-caption font-medium"
              >
                Amount Range
              </HelpLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
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
                help="Show only expenses in one category or income from one source."
                className="text-caption font-medium"
              >
                Category or Source
              </HelpLabel>
              <CategoryFilterDropdown
                value={categoryFilter}
                expenseOptions={categoryFilterOptions.expenses}
                incomeOptions={categoryFilterOptions.incomes}
                onChange={(nextValue) => {
                  setCategoryFilter(nextValue);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <HelpLabel
                help="Show only transactions between the selected start and end dates."
                className="text-caption font-medium"
              >
                Date Range
              </HelpLabel>
              <DateRangePicker
                className="w-full"
                onRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            </div>

            <div className="flex items-end justify-stretch sm:col-span-2 xl:col-span-1 xl:justify-end">
              <button
                onClick={() => {
                  setMinAmount("");
                  setMaxAmount("");
                  setCategoryFilter("");
                  setCurrentPage(1);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-(--color-hairline-on-dark) px-3 py-2 text-caption text-(--color-muted) transition-colors hover:border-red-500/40 hover:text-red-500 xl:w-auto xl:border-transparent"
              >
                <CloseIcon size={14} />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/25 p-3">
          <div className="mb-1 text-caption text-(--color-muted)">Filtered Expenses</div>
          <div className="text-title-sm text-(--color-trading-down)">
            {formatCurrency(filteredSummary.totalExpenses, currency)}
          </div>
        </div>
        <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/25 p-3">
          <div className="mb-1 text-caption text-(--color-muted)">Filtered Income</div>
          <div className="text-title-sm text-(--color-trading-up)">
            {formatCurrency(filteredSummary.totalIncome, currency)}
          </div>
        </div>
        <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/25 p-3">
          <div className="mb-1 text-caption text-(--color-muted)">
            {selectedCategoryLabel ? `${selectedCategoryLabel} Total` : "Matching Transactions"}
          </div>
          <div className="text-title-sm text-(--color-on-dark)">
            {selectedCategoryLabel
              ? formatCurrency(filteredSummary.selectedCategoryTotal, currency)
              : `${filteredSummary.matchingTransactions} transaction${filteredSummary.matchingTransactions === 1 ? "" : "s"}`}
          </div>
        </div>
      </div>

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
            value={hasMixedSelection ? "" : bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            disabled={hasMixedSelection}
            className="form-control"
          >
            <option value="">Category/source</option>
            {bulkCategoryOptions.map((category) => (
              <option key={`${category.type}-${category.id}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {hasMixedSelection && (
            <span className="text-caption text-(--color-muted)">
              Category/source bulk changes are disabled for mixed income and expense selections.
            </span>
          )}
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
              disabled={bulkAction !== null || !hasBulkUpdates}
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-(--color-on-primary) text-button disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {bulkAction === "update" && <Loader2 size={16} className="animate-spin" />}
              {bulkAction === "update" ? "Applying..." : "Apply"}
            </button>
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              disabled={bulkAction !== null}
              className="px-4 py-2 rounded-lg bg-(--color-trading-down) text-white text-button disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {bulkAction === "delete" && <Loader2 size={16} className="animate-spin" />}
              {bulkAction === "delete" ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setSelectedTransactions([])}
              disabled={bulkAction !== null}
              className="px-4 py-2 rounded-lg border border-(--color-hairline-on-dark) text-button disabled:opacity-60 disabled:cursor-wait"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="relative -mx-2 overflow-x-hidden px-2 md:mx-0 md:px-0">
        <div className="flex flex-col gap-2 md:min-w-[720px]">
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
              <p className="font-medium">
                {isFirstRun ? "No transactions yet" : "No transactions found"}
              </p>
              <p className="text-caption opacity-70">
                {isFirstRun
                  ? "Use the quick-add forms to record your first income or expense."
                  : "Try adjusting your filters or search query."}
              </p>
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
                selected={selectedTransactionKeys.has(`${t.type}:${t.id}`)}
                onToggleSelected={toggleSelected}
              />
            ))}
          </div>
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

      <DeleteConfirmationModal
        isOpen={isBulkDeleteOpen}
        onClose={() => {
          if (bulkAction !== "delete") setIsBulkDeleteOpen(false);
        }}
        onConfirm={bulkDelete}
        title="Delete Selected Transactions?"
        description={`Delete ${selectedTransactions.length} selected transaction(s)? This action cannot be undone.`}
        isDeleting={bulkAction === "delete"}
      />

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

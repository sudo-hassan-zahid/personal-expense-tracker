/**
 * Utility/Hook: useTransactions.ts
 */
import { useState, useMemo, useDeferredValue } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import { Transaction } from "@/types";

type SortableValue = string | number;

type NormalizedTransaction = {
  transaction: Transaction;
  amount: number;
  dateMs: number;
  createdAtMs: number;
  categoryText: string;
  categoryKey: string;
  noteText: string;
  searchText: string;
};

export function useTransactions(
  initialTransactions: Transaction[],
  initialItemsPerPage: number,
  initialSearch = ""
) {
  const [search, setSearch] = useState(initialSearch);
  const deferredSearch = useDeferredValue(search);
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const normalizedTransactions = useMemo<NormalizedTransaction[]>(
    () =>
      initialTransactions.map((transaction) => {
        const categoryText =
          (transaction.type === "income" ? transaction.source : transaction.category) || "";
        const amount = Number(transaction.amount);
        const dateMs = new Date(transaction.date).getTime();
        const createdAtMs = new Date(transaction.created_at).getTime();
        const dateText = format(new Date(transaction.date), "MMM d, yyyy").toLowerCase();
        const noteText = (transaction.note || "").toLowerCase();

        return {
          transaction,
          amount,
          dateMs,
          createdAtMs,
          categoryText: categoryText.toLowerCase(),
          categoryKey: `${transaction.type}:${categoryText.toLowerCase()}`,
          noteText,
          searchText: [
            categoryText,
            amount.toString(),
            dateText,
            transaction.note || "",
            transaction.type,
          ]
            .join(" ")
            .toLowerCase(),
        };
      }),
    [initialTransactions]
  );

  const filteredTransactions = useMemo(() => {
    const searchLower = deferredSearch.toLowerCase();
    const minAmountValue = minAmount === "" ? null : Number(minAmount);
    const maxAmountValue = maxAmount === "" ? null : Number(maxAmount);
    const startMs = startDate ? startOfDay(startDate).getTime() : null;
    const endMs = endDate ? endOfDay(endDate).getTime() : null;

    return normalizedTransactions.filter(({ amount, dateMs, searchText, categoryKey }) => {
      const matchesSearch = searchLower === "" || searchText.includes(searchLower);
      const matchesMinAmount = minAmountValue === null || amount >= minAmountValue;
      const matchesMaxAmount = maxAmountValue === null || amount <= maxAmountValue;
      const matchesCategory = categoryFilter === "" || categoryKey === categoryFilter;
      const matchesDateRange =
        startMs === null || endMs === null || (dateMs >= startMs && dateMs <= endMs);

      return (
        matchesSearch &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesCategory &&
        matchesDateRange
      );
    });
  }, [
    normalizedTransactions,
    deferredSearch,
    minAmount,
    maxAmount,
    categoryFilter,
    startDate,
    endDate,
  ]);

  const sortedTransactions = useMemo(() => {
    if (sortField === "date" && sortOrder === "desc") {
      return filteredTransactions.map(({ transaction }) => transaction);
    }

    return [...filteredTransactions]
      .sort((a, b) => {
        let valA: SortableValue;
        let valB: SortableValue;

        switch (sortField) {
          case "amount":
            valA = a.amount;
            valB = b.amount;
            break;
          case "category":
            valA = a.categoryText;
            valB = b.categoryText;
            break;
          case "note":
            valA = a.noteText;
            valB = b.noteText;
            break;
          case "date":
            valA = a.dateMs;
            valB = b.dateMs;
            break;
          case "type":
            valA = a.transaction.type;
            valB = b.transaction.type;
            break;
          case "status":
            valA = (a.transaction.status || "pending").toLowerCase();
            valB = (b.transaction.status || "pending").toLowerCase();
            break;
          default:
            valA = String(a.transaction[sortField as keyof Transaction] || "");
            valB = String(b.transaction[sortField as keyof Transaction] || "");
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;

        return sortOrder === "asc" ? a.createdAtMs - b.createdAtMs : b.createdAtMs - a.createdAtMs;
      })
      .map(({ transaction }) => transaction);
  }, [filteredTransactions, sortField, sortOrder]);

  const totalPages =
    initialItemsPerPage > 0 ? Math.ceil(sortedTransactions.length / initialItemsPerPage) : 1;

  const displayedTransactions = useMemo(() => {
    if (initialItemsPerPage <= 0) return sortedTransactions;
    return sortedTransactions.slice(
      (currentPage - 1) * initialItemsPerPage,
      currentPage * initialItemsPerPage
    );
  }, [sortedTransactions, currentPage, initialItemsPerPage]);

  return {
    search,
    setSearch,
    deferredSearch,
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
    totalItems: filteredTransactions.length,
    totalPages,
    displayedTransactions,
  };
}

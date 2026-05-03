import { useState, useMemo, useEffect } from "react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";

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

export function useTransactions(initialTransactions: Transaction[], initialItemsPerPage: number) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((t) => {
      const searchLower = search.toLowerCase();
      const categoryText = (t.type === "income" ? t.source : t.category) || "";
      const amount = Number(t.amount);
      const date = new Date(t.date);
      const dateText = format(date, "MMM d, yyyy").toLowerCase();
      const noteText = (t.note || "").toLowerCase();

      const matchesSearch =
        categoryText.toLowerCase().includes(searchLower) ||
        amount.toString().includes(searchLower) ||
        dateText.includes(searchLower) ||
        noteText.includes(searchLower) ||
        t.type.includes(searchLower);

      const matchesMinAmount = minAmount === "" || amount >= Number(minAmount);
      const matchesMaxAmount = maxAmount === "" || amount <= Number(maxAmount);
      const matchesDateRange =
        !startDate ||
        !endDate ||
        isWithinInterval(date, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });

      return matchesSearch && matchesMinAmount && matchesMaxAmount && matchesDateRange;
    });
  }, [initialTransactions, search, minAmount, maxAmount, startDate, endDate]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortField) {
        case "amount":
          valA = Number(a.amount);
          valB = Number(b.amount);
          break;
        case "category":
          // Special handling for category/source
          valA = ((a.type === "income" ? a.source : a.category) || "").toLowerCase();
          valB = ((b.type === "income" ? b.source : b.category) || "").toLowerCase();
          break;
        case "note":
          valA = (a.note || "").toLowerCase();
          valB = (b.note || "").toLowerCase();
          break;
        case "date":
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
          break;
        case "type":
          valA = a.type;
          valB = b.type;
          break;
        case "status":
          valA = (a.status || "pending").toLowerCase();
          valB = (b.status || "pending").toLowerCase();
          break;
        default:
          valA = (a as any)[sortField] || "";
          valB = (b as any)[sortField] || "";
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;

      // Tie breaker: newest created_at first for desc, oldest for asc
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  const totalPages = initialItemsPerPage > 0 ? Math.ceil(sortedTransactions.length / initialItemsPerPage) : 1;
  const displayedTransactions = initialItemsPerPage > 0
    ? sortedTransactions.slice(
      (currentPage - 1) * initialItemsPerPage,
      currentPage * initialItemsPerPage
    )
    : sortedTransactions;

  return {
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
    sortedTransactions,
    totalItems: filteredTransactions.length,
    totalPages,
    displayedTransactions,
  };
}


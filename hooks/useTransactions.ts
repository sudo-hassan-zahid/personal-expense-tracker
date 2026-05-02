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

      const matchesSearch = (
        categoryText.toLowerCase().includes(searchLower) ||
        amount.toString().includes(searchLower) ||
        dateText.includes(searchLower) ||
        noteText.includes(searchLower) ||
        t.type.includes(searchLower)
      );

      const matchesMinAmount = minAmount === "" || amount >= Number(minAmount);
      const matchesMaxAmount = maxAmount === "" || amount <= Number(maxAmount);
      const matchesDateRange = (!startDate || !endDate) || isWithinInterval(date, { 
        start: startOfDay(startDate), 
        end: endOfDay(endDate) 
      });

      return matchesSearch && matchesMinAmount && matchesMaxAmount && matchesDateRange;
    });
  }, [initialTransactions, search, minAmount, maxAmount, startDate, endDate]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA: any = a[sortField as keyof Transaction] || "";
      let valB: any = b[sortField as keyof Transaction] || "";

      if (sortField === "amount") {
        valA = Number(a.amount);
        valB = Number(b.amount);
      } else if (sortField === "category") {
        valA = (a.type === "income" ? a.source : a.category) || "";
        valB = (b.type === "income" ? b.source : b.category) || "";
      } else if (sortField === "date") {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  return {
    search, setSearch,
    sortField, setSortField,
    sortOrder, setSortOrder,
    currentPage, setCurrentPage,
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    startDate, setStartDate,
    endDate, setEndDate,
    sortedTransactions,
    totalItems: filteredTransactions.length,
    totalPages: Math.ceil(sortedTransactions.length / initialItemsPerPage),
    displayedTransactions: sortedTransactions.slice((currentPage - 1) * initialItemsPerPage, currentPage * initialItemsPerPage)
  };
}

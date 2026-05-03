import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Transaction } from "@/types";

export type CategoryTotal = {
  name: string;
  amount: number;
};

export function getCompletedTransactions(
  transactions: Transaction[],
  enableStatusTracking: boolean
) {
  return enableStatusTracking
    ? transactions.filter((transaction) => transaction.status === "done")
    : transactions;
}

export function summarizeCashFlow(transactions: Transaction[]) {
  return transactions.reduce(
    (summary, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === "income") summary.inflow += amount;
      else summary.outflow += amount;
      summary.closing = summary.inflow - summary.outflow;
      return summary;
    },
    { opening: 0, inflow: 0, outflow: 0, closing: 0 }
  );
}

export function getTopExpenseCategories(transactions: Transaction[], limit = 3): CategoryTotal[] {
  const totals = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;
    totals.set(transaction.category, (totals.get(transaction.category) || 0) + Number(transaction.amount));
  });

  return Array.from(totals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function getAverageDailySpend(transactions: Transaction[]) {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");
  const total = expenseTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  if (expenseTransactions.length === 0) return 0;

  const dates = expenseTransactions.map((transaction) => parseISO(transaction.date));
  const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
  const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));
  const days = Math.max(1, differenceInCalendarDays(maxDate, minDate) + 1);

  return total / days;
}

export function getForecastedMonthlyExpense(transactions: Transaction[]) {
  const average = getAverageDailySpend(transactions);
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return average * daysInMonth;
}

export function getYearlyComparison(transactions: Transaction[]) {
  const currentYear = new Date().getFullYear();
  const totals = { currentIncome: 0, currentExpense: 0, previousIncome: 0, previousExpense: 0 };

  transactions.forEach((transaction) => {
    const year = parseISO(transaction.date).getFullYear();
    const amount = Number(transaction.amount);
    if (year === currentYear && transaction.type === "income") totals.currentIncome += amount;
    if (year === currentYear && transaction.type === "expense") totals.currentExpense += amount;
    if (year === currentYear - 1 && transaction.type === "income") totals.previousIncome += amount;
    if (year === currentYear - 1 && transaction.type === "expense") totals.previousExpense += amount;
  });

  return totals;
}

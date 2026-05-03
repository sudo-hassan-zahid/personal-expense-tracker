export interface BaseTransaction {
  id: string;
  amount: number | string;
  date: string;
  note: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
  currency?: string;
}

export interface Expense extends BaseTransaction {
  category: string;
  attachment_url?: string | null;
  type?: "expense";
}

export interface Income extends BaseTransaction {
  source: string;
  type?: "income";
}

export type Transaction = (Expense & { type: "expense" }) | (Income & { type: "income" });

export type Category = {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
};

export type MonthlyBudget = {
  id: string;
  category: string;
  month: string;
  limit_amount: number | string;
  alert_threshold: number | string;
  rollover_amount?: number | string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  target_date: string | null;
};

export type RecurringTransaction = {
  id: string;
  type: "expense" | "income";
  amount: number | string;
  category_or_source: string;
  note: string | null;
  frequency: "weekly" | "monthly" | "yearly";
  next_date: string;
  end_date: string | null;
  status: "active" | "paused";
};

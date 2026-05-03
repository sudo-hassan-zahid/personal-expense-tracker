export interface BaseTransaction {
  id: string;
  amount: number | string;
  date: string;
  note: string;
  status?: string;
  created_at: string;
}

export interface Expense extends BaseTransaction {
  category: string;
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

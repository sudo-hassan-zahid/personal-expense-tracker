"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTransactions } from "@/lib/revalidate";
import { validateRequiredText, validateTransactionInput } from "@/lib/form-validation";

type ImportRow =
  | {
      kind: "income";
      amount: number;
      date: string;
      note: string;
      status: "done" | "pending";
      source: string;
    }
  | {
      kind: "expense";
      amount: number;
      date: string;
      note: string;
      status: "done" | "pending";
      category: string;
    };

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function getHeaderIndexLookup(header: string[]) {
  const normalizedHeader = header.map((cell) => cell.toLowerCase());
  return (name: string) => normalizedHeader.indexOf(name);
}

function formatImportSummary(imported: number, skipped: number) {
  if (skipped === 0) {
    return `Import completed: ${imported} row${imported === 1 ? "" : "s"} imported.`;
  }

  return `Import completed: ${imported} imported, ${skipped} skipped.`;
}

export async function importTransactions(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file to import." };

  const text = await file.text();
  const rows = text.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
  if (rows.length < 2) {
    return { error: "The CSV must include a header row and at least one data row." };
  }

  const [header, ...records] = rows;
  const indexOf = getHeaderIndexLookup(header);
  const requiredHeaders = ["type", "amount", "date"];
  const missingHeaders = requiredHeaders.filter((name) => indexOf(name) === -1);

  if (
    indexOf("category_or_source") === -1 &&
    indexOf("category") === -1 &&
    indexOf("source") === -1
  ) {
    missingHeaders.push("category_or_source");
  }

  if (missingHeaders.length > 0) {
    return {
      error: `Missing required CSV column${missingHeaders.length === 1 ? "" : "s"}: ${missingHeaders.join(", ")}.`,
    };
  }

  const parsedRows: ImportRow[] = [];
  let skipped = 0;

  for (const record of records) {
    const type = record[indexOf("type")]?.toLowerCase();
    const categoryOrSource =
      record[indexOf("category_or_source")] ||
      record[indexOf("category")] ||
      record[indexOf("source")] ||
      "";

    const row = new FormData();
    row.set("amount", record[indexOf("amount")] || "");
    row.set("date", record[indexOf("date")] || "");
    row.set("note", record[indexOf("note")] || "");
    row.set("status", record[indexOf("status")] || "done");

    const transaction = validateTransactionInput(row);
    if (!transaction.ok) {
      skipped += 1;
      continue;
    }

    if (type === "income") {
      const source = validateRequiredText(categoryOrSource, "Source");
      if (!source.ok) {
        skipped += 1;
        continue;
      }

      parsedRows.push({
        kind: "income",
        ...transaction.value,
        source: source.value,
      });
      continue;
    }

    if (type === "expense") {
      const category = validateRequiredText(categoryOrSource, "Category");
      if (!category.ok) {
        skipped += 1;
        continue;
      }

      parsedRows.push({
        kind: "expense",
        ...transaction.value,
        category: category.value,
      });
      continue;
    }

    skipped += 1;
  }

  if (parsedRows.length === 0) {
    return { error: "No valid rows were found in the CSV." };
  }

  const { supabase, user } = await getAuthenticatedClient();
  const uniqueIncomeDates = Array.from(
    new Set(parsedRows.filter((row) => row.kind === "income").map((row) => row.date))
  );
  const uniqueExpenseDates = Array.from(
    new Set(parsedRows.filter((row) => row.kind === "expense").map((row) => row.date))
  );

  const [existingIncomeRes, existingExpenseRes] = await Promise.all([
    uniqueIncomeDates.length > 0
      ? supabase
          .from("incomes")
          .select("amount, source, date")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .in("date", uniqueIncomeDates)
      : Promise.resolve({ data: [], error: null }),
    uniqueExpenseDates.length > 0
      ? supabase
          .from("expenses")
          .select("amount, category, date")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .in("date", uniqueExpenseDates)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (existingIncomeRes.error || existingExpenseRes.error) {
    return { error: "Failed to validate existing transactions before import." };
  }

  const existingIncomeKeys = new Set(
    (existingIncomeRes.data || []).map(
      (row) => `${Number(row.amount)}|${row.source.toLowerCase()}|${row.date}`
    )
  );
  const existingExpenseKeys = new Set(
    (existingExpenseRes.data || []).map(
      (row) => `${Number(row.amount)}|${row.category.toLowerCase()}|${row.date}`
    )
  );

  const seenImportKeys = new Set<string>();
  const incomeRows = [];
  const expenseRows = [];

  for (const row of parsedRows) {
    if (row.kind === "income") {
      const duplicateKey = `${row.amount}|${row.source.toLowerCase()}|${row.date}`;
      if (existingIncomeKeys.has(duplicateKey) || seenImportKeys.has(`income|${duplicateKey}`)) {
        skipped += 1;
        continue;
      }

      seenImportKeys.add(`income|${duplicateKey}`);
      incomeRows.push({
        user_id: user.id,
        amount: row.amount,
        source: row.source,
        date: row.date,
        note: row.note,
        status: row.status,
        currency: "USD",
      });
      continue;
    }

    const duplicateKey = `${row.amount}|${row.category.toLowerCase()}|${row.date}`;
    if (existingExpenseKeys.has(duplicateKey) || seenImportKeys.has(`expense|${duplicateKey}`)) {
      skipped += 1;
      continue;
    }

    seenImportKeys.add(`expense|${duplicateKey}`);
    expenseRows.push({
      user_id: user.id,
      amount: row.amount,
      category: row.category,
      date: row.date,
      note: row.note,
      status: row.status,
      currency: "USD",
    });
  }

  if (incomeRows.length === 0 && expenseRows.length === 0) {
    return { error: "All rows were skipped because they were invalid or duplicates." };
  }

  const [incomeInsert, expenseInsert] = await Promise.all([
    incomeRows.length > 0
      ? supabase.from("incomes").insert(incomeRows)
      : Promise.resolve({ error: null }),
    expenseRows.length > 0
      ? supabase.from("expenses").insert(expenseRows)
      : Promise.resolve({ error: null }),
  ]);

  if (incomeInsert.error || expenseInsert.error) {
    return { error: "Import failed while saving transactions." };
  }

  const imported = incomeRows.length + expenseRows.length;
  revalidateTransactions(user.id);

  return {
    success: true,
    imported,
    message: formatImportSummary(imported, skipped),
  };
}

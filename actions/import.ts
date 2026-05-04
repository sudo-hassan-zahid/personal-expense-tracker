"use server";

import { addIncome } from "@/actions/income";
import { addExpense } from "@/actions/expense";

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

export async function importTransactions(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file to import." };

  const text = await file.text();
  const rows = text.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
  const [header, ...records] = rows;
  const normalizedHeader = header.map((cell) => cell.toLowerCase());
  const indexOf = (name: string) => normalizedHeader.indexOf(name);

  let imported = 0;
  for (const record of records) {
    const type = record[indexOf("type")]?.toLowerCase();
    const category =
      record[indexOf("category_or_source")] ||
      record[indexOf("category")] ||
      record[indexOf("source")];
    const row = new FormData();
    row.set("amount", record[indexOf("amount")] || "");
    row.set("date", record[indexOf("date")] || "");
    row.set("note", record[indexOf("note")] || "");
    row.set("status", record[indexOf("status")] || "done");

    if (type === "income") {
      row.set("source", category || "");
      const result = await addIncome(row);
      if (!result?.error) imported += 1;
    } else if (type === "expense") {
      row.set("category", category || "");
      const result = await addExpense(row);
      if (!result?.error) imported += 1;
    }
  }

  return { success: true, imported };
}

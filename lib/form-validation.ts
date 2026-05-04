export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

const MAX_NOTE_LENGTH = 240;

export type TransactionInput = {
  amount: number;
  date: string;
  note: string;
  status: "done" | "pending";
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function validateTransactionInput(formData: FormData): ValidationResult<TransactionInput> {
  const amount = Number(getString(formData, "amount"));
  const date = getString(formData, "date");
  const note = getString(formData, "note");
  const statusValue = getString(formData, "status") || "done";

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  if (!date || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    return { ok: false, error: "Choose a valid transaction date." };
  }

  if (note.length > MAX_NOTE_LENGTH) {
    return { ok: false, error: `Notes must be ${MAX_NOTE_LENGTH} characters or fewer.` };
  }

  if (statusValue !== "done" && statusValue !== "pending") {
    return { ok: false, error: "Status must be pending or done." };
  }

  return {
    ok: true,
    value: {
      amount,
      date,
      note,
      status: statusValue,
    },
  };
}

export function validateRequiredText(
  value: FormDataEntryValue | null,
  label: string,
  maxLength = 80
): ValidationResult<string> {
  const text = String(value || "").trim();

  if (!text) return { ok: false, error: `${label} is required.` };
  if (text.length > maxLength) {
    return { ok: false, error: `${label} must be ${maxLength} characters or fewer.` };
  }

  return { ok: true, value: text };
}

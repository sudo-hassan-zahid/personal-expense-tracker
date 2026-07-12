"use client";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import { Transaction } from "@/types";
import { FullscreenModal } from "./ui/FullscreenModal";
import { RichDescriptionView } from "./RichDescriptionEditor";

export function TransactionDescriptionModal({
  transaction,
  currency,
  onClose,
}: {
  transaction: Transaction;
  currency: string;
  onClose: () => void;
}) {
  const categoryOrSource = transaction.type === "income" ? transaction.source : transaction.category;

  return (
    <FullscreenModal
      title="Transaction Description"
      onClose={onClose}
      widthClassName="max-w-4xl"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-(--color-primary) px-4 py-2 text-button text-(--color-on-primary) transition-colors hover:bg-(--color-primary-active)"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-3 rounded-lg border border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark)/55 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-caption text-(--color-muted)">Amount</div>
            <div className="text-number-md text-(--color-on-dark)">
              {formatCurrency(Number(transaction.amount), currency)}
            </div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Type</div>
            <div className="text-body-md capitalize text-(--color-on-dark)">{transaction.type}</div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Category or Source</div>
            <div className="text-body-md text-(--color-on-dark)">{categoryOrSource}</div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Date</div>
            <div className="text-body-md text-(--color-on-dark)">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </div>
          </div>
        </div>

        {transaction.note && (
          <div className="rounded-lg border border-(--color-hairline-on-dark) p-4">
            <div className="mb-1 text-caption text-(--color-muted)">Table Note</div>
            <p className="text-body-md text-(--color-on-dark)">{transaction.note}</p>
          </div>
        )}

        <div className="rounded-lg border border-(--color-hairline-on-dark) p-4">
          <RichDescriptionView html={transaction.description_html} />
        </div>
      </div>
    </FullscreenModal>
  );
}

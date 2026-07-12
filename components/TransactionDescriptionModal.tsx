"use client";

import { format } from "date-fns";
import { CalendarDays, CircleDollarSign, Tag, WalletCards } from "lucide-react";
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
  const hasRichDescription = Boolean(transaction.description_html);
  const amountTone =
    transaction.type === "income" ? "text-(--color-trading-up)" : "text-(--color-trading-down)";

  return (
    <FullscreenModal
      title="Transaction Description"
      onClose={onClose}
      widthClassName="max-w-[min(92vw,640px)]"
      contentClassName="max-h-[calc(92dvh-7rem)]"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-(--color-primary) px-4 py-2 text-button text-(--color-on-primary) shadow-sm transition-colors hover:bg-(--color-primary-active)"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark)/45 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 text-caption uppercase text-(--color-muted)">
                {transaction.type}
              </div>
              <div className={`truncate text-title-md ${amountTone}`}>
                {formatCurrency(Number(transaction.amount), currency)}
              </div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-card-dark) text-(--color-primary)">
              <CircleDollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-(--color-hairline-on-dark) p-3">
            <div className="mb-1 flex items-center gap-1.5 text-caption text-(--color-muted)">
              <WalletCards size={13} />
              Amount
            </div>
            <div className={`truncate text-number-sm ${amountTone}`}>
              {formatCurrency(Number(transaction.amount), currency)}
            </div>
          </div>
          <div className="rounded-lg border border-(--color-hairline-on-dark) p-3">
            <div className="mb-1 flex items-center gap-1.5 text-caption text-(--color-muted)">
              <Tag size={13} />
              {transaction.type === "income" ? "Source" : "Category"}
            </div>
            <div className="truncate text-body-sm font-semibold text-(--color-on-dark)">
              {categoryOrSource}
            </div>
          </div>
          <div className="rounded-lg border border-(--color-hairline-on-dark) p-3">
            <div className="mb-1 flex items-center gap-1.5 text-caption text-(--color-muted)">
              <CalendarDays size={13} />
              Date
            </div>
            <div className="truncate text-body-sm font-semibold text-(--color-on-dark)">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </div>
          </div>
        </div>

        {transaction.note && (
          <div className="rounded-lg border border-(--color-hairline-on-dark) p-3">
            <div className="mb-1 text-caption text-(--color-muted)">Table Note</div>
            <p className="text-body-md text-(--color-on-dark)">{transaction.note}</p>
          </div>
        )}

        <div
          className={`rounded-lg border border-(--color-hairline-on-dark) p-3 ${
            hasRichDescription ? "bg-(--color-surface-card-dark)" : "bg-(--color-surface-elevated-dark)/30"
          }`}
        >
          <div className="mb-2 text-caption text-(--color-muted)">Rich Description</div>
          <RichDescriptionView html={transaction.description_html} />
        </div>
      </div>
    </FullscreenModal>
  );
}

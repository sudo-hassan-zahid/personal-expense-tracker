"use client";

import Link from "next/link";
import { ArrowRight, FolderTree, PiggyBank, Wallet } from "lucide-react";
import { HelpTip } from "./HelpTip";

export function FirstRunGuide() {
  return (
    <section className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) p-5 md:p-6 animate-slide-up stagger-1">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h2 className="text-title-md text-(--color-on-dark)">Start With A Few Simple Steps</h2>
            <HelpTip label="Getting started help">
              Add one income, one expense, and tidy your categories. That is enough to make the
              dashboard useful.
            </HelpTip>
          </div>
          <p className="mt-2 text-body-md text-(--color-muted)">
            Keep it light. You do not need budgets, goals, or a perfect setup before tracking your
            first month.
          </p>
        </div>
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center gap-2 rounded-lg border border-(--color-hairline-on-dark) px-4 py-2 text-body-sm text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark) transition-colors"
        >
          Manage categories
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="#quick-add-income"
          className="rounded-lg border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/30 p-4 transition-colors hover:bg-(--color-surface-elevated-dark)"
        >
          <div className="flex items-center gap-2 text-(--color-trading-up)">
            <Wallet size={18} />
            <span className="text-body-sm font-medium">Add income</span>
          </div>
          <p className="mt-2 text-body-sm text-(--color-muted)">
            Record salary, freelance work, or any money coming in.
          </p>
        </Link>

        <Link
          href="#quick-add-expense"
          className="rounded-lg border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/30 p-4 transition-colors hover:bg-(--color-surface-elevated-dark)"
        >
          <div className="flex items-center gap-2 text-(--color-trading-down)">
            <PiggyBank size={18} />
            <span className="text-body-sm font-medium">Add expense</span>
          </div>
          <p className="mt-2 text-body-sm text-(--color-muted)">
            Start with obvious things like rent, groceries, transport, or bills.
          </p>
        </Link>

        <Link
          href="/dashboard/categories"
          className="rounded-lg border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/30 p-4 transition-colors hover:bg-(--color-surface-elevated-dark)"
        >
          <div className="flex items-center gap-2 text-(--color-primary)">
            <FolderTree size={18} />
            <span className="text-body-sm font-medium">Clean categories</span>
          </div>
          <p className="mt-2 text-body-sm text-(--color-muted)">
            Keep category names short and familiar so reports stay readable.
          </p>
        </Link>
      </div>
    </section>
  );
}

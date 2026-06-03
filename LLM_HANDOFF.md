# LLM Developer Handoff

This file is a quick orientation note for future LLM/coding agents working in this repo.
Read `AGENTS.md` first for the git command policy. In particular, do not run `git push` or
`git reset`.

## Project Overview

- App: Personal expense tracker built with Next.js App Router, React, TypeScript, Tailwind, and Supabase.
- Main dashboard route: `app/dashboard/page.tsx`.
- Dashboard UI: `components/DashboardContent.tsx`.
- Dashboard data queries: `lib/dashboard-data.ts`.
- URL/filter parsing: `lib/dashboard-filters.ts`.
- Profile settings UI: `app/dashboard/profile/page.tsx`.
- Profile server actions: `actions/profile.ts`.
- Supabase schema/migrations: `supabase/database.sql` and `supabase/migrations/`.

## Current Feature Branch Context

Branch: `feature/month-filters-carry-forward`

This branch addresses month rollover problems on the dashboard:

- Dashboard no longer traps users in the current calendar month when a new month starts.
- Month selection uses a dropdown populated only from months that have income or expense rows.
- If the current month has no transactions, the dashboard redirects to the latest month with data.
- Balance carry-forward can be applied one time from the dashboard.
- Profile Settings includes a saved `Auto Carry Forward Balance` preference.
- When auto carry-forward is enabled, dashboard totals and Cash Flow include the opening balance from prior completed transactions.
- Monthly budgets are fetched for the selected month, not always the real current month.

## Database Notes

The carry-forward profile preference requires this migration:

`supabase/migrations/20260603_auto_carry_forward_balance.sql`

It adds `profiles.auto_carry_forward_balance`, backfills existing rows to `FALSE`, then sets
`DEFAULT FALSE` and `NOT NULL`.

If the app logs this error:

```text
column profiles.auto_carry_forward_balance does not exist
```

apply the migration to the active Supabase database before debugging application code.

## Validation Commands

Use these after meaningful code changes:

```bash
npx tsc --noEmit
pnpm run lint
pnpm run build
```

## Implementation Gotchas

- `getDashboardData` is cached with `use cache` and `cacheTag`; keep user-specific cache tags intact.
- Dashboard filters are driven by query params. Preserve existing params like `type`, `status`, `q`, `view`, and `limit` when adding filter navigation.
- Carry-forward should respect status tracking. Pending transactions are excluded from opening balance when profile status tracking is enabled.
- `month=YYYY-MM` is converted into a custom start/end date by `parseDashboardFilters`.
- Avoid replacing `AGENTS.md`; it is intentionally focused on git policy.

## PR Helper

The PR title/description draft for this branch is in:

`docs/PR_MONTH_FILTER_CARRY_FORWARD.md`

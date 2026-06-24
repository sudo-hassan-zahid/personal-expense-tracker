# Performance Changes - 2026-06-24

This branch focuses on making the dashboard faster by reducing database row transfer, cutting repeated client-side list processing, and trimming imported client code where Next can safely rewrite package imports.

## Changes Made

### Dashboard database aggregates

- Added `supabase/migrations/20260624_dashboard_aggregate_helpers.sql`.
- Added `get_transaction_months(p_user_id)` to compute available dashboard months in Postgres.
- Added `get_opening_balance(p_user_id, p_before_date, p_status_tracking_enabled)` to compute carry-forward opening balance in Postgres.
- Updated `lib/dashboard-data.ts` to call these RPC helpers instead of fetching all historical transaction dates and pre-period amounts into the Next server.

Expected impact: dashboard loads should transfer fewer rows for users with long transaction histories, especially when month navigation or carry-forward balance is enabled.

### Transaction table render work

- Memoized selected transaction keys in `components/TransactionList.tsx`.
- Replaced repeated selected-row scans during row rendering with `Set` lookups.
- Memoized filtered transaction summaries so unrelated table state changes do not recompute totals unnecessarily.
- Stabilized the selection toggle callback with `useCallback`.

Expected impact: smoother table interactions when selecting rows, changing filters, or rendering larger transaction lists.

### Chart processing

- Updated `components/DashboardChart.tsx` so filtering, summary totals, and chart bucket aggregation happen in one memoized pass.
- Removed separate filtered-list and chart-data passes over the same transactions.
- Preserved existing date granularity behavior for day, week, and month views.

Expected impact: faster chart updates when changing date range, type, category, or status filters.

### Analytics summary

- Converted `components/AnalyticsSummary.tsx` into a client component with memoized analytics calculations.
- Cached cash flow, top categories, daily spend, forecast, and yearly net calculations across unrelated parent renders.

Expected impact: less repeated work when the dashboard parent re-renders without changing transaction data.

### Package import optimization

- Enabled `experimental.optimizePackageImports` for `date-fns` and `lucide-react` in `next.config.ts`.

Expected impact: smaller or more efficient client/server bundles where Next can rewrite broad named imports into narrower module paths.

## Verification

- Ran `pnpm lint` after each code change.
- Ran `pnpm build` after all implementation commits.
- No lint errors were reported.
- Production build completed successfully.

## Commits

- `62ab7ec` - Move dashboard aggregates into Postgres
- `d52eec1` - Memoize transaction table derived state
- `95a3e22` - Process chart data in one pass
- `b49335c` - Memoize analytics summary calculations
- `8b83e26` - Optimize modular package imports
- `d0c7553` - Document performance optimization work

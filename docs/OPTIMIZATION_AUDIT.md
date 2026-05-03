# Optimization Audit

Date: 2026-05-04
Branch: `optimize/prod-performance-pass`

## Current Issues Found

- Cache invalidation was too broad: most mutations purged transaction, category, profile, page, and layout caches together.
- Transaction update/delete actions relied mostly on RLS and did not include explicit `user_id` predicates.
- Logged-out public routes still paid for Supabase profile and nav auth lookups.
- Category mutations selected whole rows and used broad case-insensitive transaction checks.
- Dashboard render work rebuilt, filtered, sorted, and totaled transactions during render.
- Transaction filtering repeatedly parsed amounts/dates and lowercased text during search and sort.
- The heavy chart bundle loaded with the main dashboard client component.
- Decorative canvas effects kept rendering for reduced-motion users and hidden browser tabs.
- Dashboard data loaded expense and income categories with two nearly identical network queries.
- Existing indexes helped, but dashboard ordering needed composite `(user_id, date, created_at)` coverage.

## Prod-Grade Practices Applied

- Scope cache revalidation to the changed domain instead of invalidating the whole app.
- Add explicit ownership predicates to mutations for clearer query plans and defense in depth.
- Skip server auth/database calls when no Supabase auth cookie exists.
- Select only fields needed by the application.
- Prefer index-friendly equality checks for canonical category names.
- Memoize expensive client derivations and avoid mutating render inputs.
- Normalize searchable/sortable transaction fields once per data refresh.
- Code-split heavy visualization dependencies.
- Respect `prefers-reduced-motion` and pause decorative work when the tab is hidden.
- Align Postgres indexes with real application filter and order patterns.

## Implemented Fixes

- Added scoped cache helpers in `lib/revalidate.ts`.
- Updated income, expense, profile, category, and nav flows to avoid unnecessary cache or auth work.
- Memoized dashboard transaction derivations and totals.
- Precomputed transaction search and sort fields in `useTransactions`.
- Dynamically loaded the dashboard chart.
- Paused particle rendering for reduced-motion and hidden-tab states.
- Collapsed category loading into one dashboard query.
- Added query-pattern index refinements for dashboard date ordering and category ordering.

## Remaining Opportunities

- Move monthly totals and chart aggregation into SQL/RPC if transaction volume grows substantially.
- Add pagination at the database layer for historical transaction views beyond the current month.
- Normalize transaction category references to `category_id` for stronger integrity and cheaper rename/delete flows.
- Add performance smoke tests or Playwright traces around dashboard load and table interactions.

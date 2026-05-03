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
- Proxy did an auth network call even for requests with no Supabase auth cookie.
- The homepage repeated an auth lookup that proxy already needed for signed-in redirects.
- Recharts emitted `width(-1)` / `height(-1)` warnings before the responsive container measured.
- Next dev warned that `.next/dev` was on a slow filesystem under `J:`.

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
- Short-circuit auth work when a request has no Supabase session cookie.
- Avoid duplicate auth checks between proxy and server-rendered pages.
- Provide stable initial dimensions to responsive charts during first paint.

## Implemented Fixes

- Added scoped cache helpers in `lib/revalidate.ts`.
- Updated income, expense, profile, category, and nav flows to avoid unnecessary cache or auth work.
- Memoized dashboard transaction derivations and totals.
- Precomputed transaction search and sort fields in `useTransactions`.
- Dynamically loaded the dashboard chart.
- Paused particle rendering for reduced-motion and hidden-tab states.
- Collapsed category loading into one dashboard query.
- Added query-pattern index refinements for dashboard date ordering and category ordering.
- Moved signed-in homepage redirects into proxy and removed the duplicate homepage auth call.
- Added a proxy no-cookie fast path for public routes and protected-route redirects.
- Set Recharts `initialDimension` to avoid negative first-measure warnings.

## Remaining Opportunities

- Move monthly totals and chart aggregation into SQL/RPC if transaction volume grows substantially.
- Add pagination at the database layer for historical transaction views beyond the current month.
- Normalize transaction category references to `category_id` for stronger integrity and cheaper rename/delete flows.
- Add performance smoke tests or Playwright traces around dashboard load and table interactions.
- For local dev on Windows, keep the repo on a fast local disk and exclude the project folder from antivirus scanning. Next.js documents antivirus and filesystem speed as common local-development bottlenecks, and `distDir` must stay inside the project directory, so `.next/dev` cannot be moved to a different drive through `next.config.ts`.

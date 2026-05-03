# PR Title

Optimize dashboard performance, auth flow, cache invalidation, and dev stability

# PR Description

## Summary

This branch performs a production-grade optimization pass over the personal expense tracker. It reduces unnecessary Supabase/auth work, narrows cache invalidation, improves dashboard render performance, code-splits heavier client dependencies, adds query-pattern indexes, cleans lint blockers, and documents remaining scaling opportunities.

## Major Changes

- Scoped cache invalidation by data domain instead of purging profile, category, transaction, page, and layout caches together.
- Added explicit `user_id` predicates to transaction and category mutations.
- Skipped profile/nav Supabase calls when no auth cookie is present.
- Added proxy fast paths for no-cookie requests and moved signed-in `/` redirects into proxy.
- Removed duplicate homepage auth lookup.
- Collapsed dashboard category loading from two Supabase queries into one.
- Memoized dashboard transaction derivations and totals.
- Precomputed transaction search and sort fields.
- Dynamically loaded the Recharts dashboard chart.
- Added stable Recharts initial dimensions to avoid `width(-1)` / `height(-1)` warnings.
- Paused decorative particle rendering for reduced-motion users and hidden tabs.
- Shared request-scoped auth/profile data across layout, top nav, and dashboard rendering.
- Added explicit user-scoped dashboard filters so Supabase queries line up with composite indexes.
- Deferred decorative particle/cursor chunks until browser idle, skipping cursor effects on non-pointer devices.
- Added composite query-pattern indexes for dashboard ordering and category listing.
- Resolved lint blockers across the app.
- Added optimization audit documentation.

## Database

- Added `supabase/migrations/20260504_query_pattern_indexes.sql`.
- New indexes cover user-scoped date ordering for expenses/incomes and user/type/name ordering for categories.

## Local Development Notes

- The slow filesystem warning is environment-driven when the project and `.next/dev` are on a slow or network-backed drive such as `J:`.
- Next.js supports custom `distDir`, but it must remain inside the project directory, so the development output cannot be moved to a different drive through `next.config.ts`.
- Recommended local fix: keep the repository on a fast local SSD path and add the project folder to Windows Defender or antivirus exclusions.

## Verification

```bash
npx tsc --noEmit
pnpm run lint
pnpm run build
```

All checks passed on this branch after the optimization pass.

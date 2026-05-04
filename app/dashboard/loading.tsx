/**
 * Page/Route: loading.tsx
 */
/**
 * Dashboard loading skeleton for instant perceived performance.
 * Renders immediately while SSR data fetches happen in the background.
 */
export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-[40px] flex flex-col gap-8 flex-1 animate-pulse">
      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)"
          >
            <div className="h-4 w-24 bg-(--color-surface-elevated-dark) rounded mb-4" />
            <div className="h-10 w-40 bg-(--color-surface-elevated-dark) rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="w-full bg-(--color-surface-card-dark) p-6 md:p-8 rounded-2xl border border-(--color-hairline-on-dark) h-[460px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-6 w-64 bg-(--color-surface-elevated-dark) rounded mb-2" />
            <div className="h-3 w-48 bg-(--color-surface-elevated-dark) rounded" />
          </div>
          <div className="h-10 w-72 bg-(--color-surface-elevated-dark) rounded-xl" />
        </div>
        <div className="h-[340px] bg-(--color-canvas-dark)/30 rounded-xl" />
      </div>

      {/* Table + Actions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table */}
        <div className="lg:col-span-8 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-48 bg-(--color-surface-elevated-dark) rounded" />
            <div className="h-8 w-32 bg-(--color-surface-elevated-dark) rounded-xl" />
          </div>
          <div className="flex flex-col gap-3">
            {/* Search bar */}
            <div className="h-10 w-full max-w-sm bg-(--color-surface-elevated-dark) rounded-xl mb-4" />
            {/* Header row */}
            <div className="h-8 bg-(--color-surface-elevated-dark)/50 rounded" />
            {/* Transaction rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-(--color-surface-elevated-dark)/30 rounded-lg"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-(--color-surface-card-dark) rounded-xl p-6 border border-(--color-hairline-on-dark)"
            >
              <div className="h-5 w-40 bg-(--color-surface-elevated-dark) rounded mb-6" />
              <div className="flex flex-col gap-4">
                <div className="h-10 bg-(--color-surface-elevated-dark)/50 rounded-md" />
                <div className="h-10 bg-(--color-surface-elevated-dark)/50 rounded-md" />
                <div className="h-10 bg-(--color-surface-elevated-dark)/50 rounded-md" />
                <div className="h-10 bg-(--color-surface-elevated-dark)/50 rounded-md" />
                <div className="h-11 bg-(--color-primary)/20 rounded-md mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

-- Dashboard Aggregate Helpers
-- Date: 2026-06-24
-- Push dashboard metadata reductions into Postgres so the app does not transfer
-- every historical transaction row just to compute month options or balances.

CREATE OR REPLACE FUNCTION public.get_transaction_months(p_user_id uuid)
RETURNS TABLE(month text)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT transaction_month
  FROM (
    SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS transaction_month
    FROM public.expenses
    WHERE user_id = p_user_id
      AND deleted_at IS NULL

    UNION

    SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS transaction_month
    FROM public.incomes
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
  ) months
  ORDER BY transaction_month DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_opening_balance(
  p_user_id uuid,
  p_before_date date,
  p_status_tracking_enabled boolean DEFAULT NULL
)
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  WITH settings AS (
    SELECT COALESCE(
      p_status_tracking_enabled,
      (
        SELECT enable_status_tracking
        FROM public.profiles
        WHERE id = p_user_id
      ),
      false
    ) AS status_tracking_enabled
  )
  SELECT
    COALESCE((
      SELECT SUM(amount)
      FROM public.incomes
      CROSS JOIN settings
      WHERE user_id = p_user_id
        AND deleted_at IS NULL
        AND date < p_before_date
        AND (
          NOT settings.status_tracking_enabled
          OR COALESCE(status, 'done') = 'done'
        )
    ), 0)
    -
    COALESCE((
      SELECT SUM(amount)
      FROM public.expenses
      CROSS JOIN settings
      WHERE user_id = p_user_id
        AND deleted_at IS NULL
        AND date < p_before_date
        AND (
          NOT settings.status_tracking_enabled
          OR COALESCE(status, 'done') = 'done'
        )
    ), 0);
$$;

-- Query Pattern Index Refinements
-- Date: 2026-05-04
-- These indexes match the tightened application queries in the optimization pass.

-- Dashboard monthly ranges order by date and created_at after RLS narrows by user.
CREATE INDEX IF NOT EXISTS idx_expenses_user_date_created
ON public.expenses (user_id, date DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_incomes_user_date_created
ON public.incomes (user_id, date DESC, created_at DESC);

-- Category delete/update validation now uses exact user-scoped equality checks.
CREATE INDEX IF NOT EXISTS idx_expenses_user_category_exact
ON public.expenses (user_id, category);

CREATE INDEX IF NOT EXISTS idx_incomes_user_source_exact
ON public.incomes (user_id, source);

-- Category lists filter by type and order by name.
CREATE INDEX IF NOT EXISTS idx_categories_user_type_name
ON public.categories (user_id, type, name);

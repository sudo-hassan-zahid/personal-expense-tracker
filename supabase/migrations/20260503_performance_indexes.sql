-- Performance Indexes Migration
-- These composite indexes match the exact query patterns used by the application.
-- Without these, every query does a sequential scan filtered only by RLS (user_id).

-- Expenses: Dashboard query filters by user_id (via RLS) + date range, orders by date + created_at
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_created ON public.expenses (user_id, created_at DESC);
-- Expenses: Category update propagation uses ilike on category
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON public.expenses (user_id, category);

-- Incomes: Same patterns as expenses
CREATE INDEX IF NOT EXISTS idx_incomes_user_date ON public.incomes (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_incomes_user_created ON public.incomes (user_id, created_at DESC);
-- Incomes: Source update propagation uses ilike on source
CREATE INDEX IF NOT EXISTS idx_incomes_user_source ON public.incomes (user_id, source);

-- Categories: Queried by user_id + type, ordered by name
CREATE INDEX IF NOT EXISTS idx_categories_user_type ON public.categories (user_id, type);
CREATE INDEX IF NOT EXISTS idx_categories_user_name ON public.categories (user_id, name);

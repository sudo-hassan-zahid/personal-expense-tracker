ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS description_html text,
  ADD COLUMN IF NOT EXISTS description_text text;

ALTER TABLE public.incomes
  ADD COLUMN IF NOT EXISTS description_html text,
  ADD COLUMN IF NOT EXISTS description_text text;

CREATE INDEX IF NOT EXISTS expenses_description_text_idx
  ON public.expenses USING gin (to_tsvector('simple', coalesce(description_text, '')));

CREATE INDEX IF NOT EXISTS incomes_description_text_idx
  ON public.incomes USING gin (to_tsvector('simple', coalesce(description_text, '')));

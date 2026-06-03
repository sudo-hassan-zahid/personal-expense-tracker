-- Add saved carry-forward preference for dashboard balances.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS auto_carry_forward_balance BOOLEAN DEFAULT FALSE;

UPDATE public.profiles
SET auto_carry_forward_balance = FALSE
WHERE auto_carry_forward_balance IS NULL;

ALTER TABLE public.profiles
ALTER COLUMN auto_carry_forward_balance SET DEFAULT FALSE,
ALTER COLUMN auto_carry_forward_balance SET NOT NULL;

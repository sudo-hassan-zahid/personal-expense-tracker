-- Add saved carry-forward preference for dashboard balances.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS auto_carry_forward_balance BOOLEAN DEFAULT FALSE;

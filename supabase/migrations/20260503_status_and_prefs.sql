-- Migration for Status Tracking and UI Preferences
-- Date: 2026-05-03

-- 1. Update profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enable_status_tracking BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_cursor_trail BOOLEAN DEFAULT TRUE;

-- 2. Update expenses table
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'done' CHECK (status IN ('pending', 'done'));

-- 3. Update incomes table
ALTER TABLE public.incomes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'done' CHECK (status IN ('pending', 'done'));

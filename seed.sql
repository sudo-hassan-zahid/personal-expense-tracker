-- ============================================
-- Seed script for hassanisavailable@gmail.com
-- Run this in the Supabase SQL Editor
-- ============================================

-- Step 1: Get the user ID
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'hassanisavailable@gmail.com';

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User hassanisavailable@gmail.com not found. Please sign up first.';
    END IF;

    -- Step 1b: Set currency to PKR
    UPDATE public.profiles
    SET currency = 'PKR', updated_at = now()
    WHERE id = target_user_id;

    -- Step 1c: Clear existing data for this user (makes script re-runnable)
    DELETE FROM public.expenses WHERE user_id = target_user_id;
    DELETE FROM public.incomes WHERE user_id = target_user_id;
    DELETE FROM public.categories WHERE user_id = target_user_id;

    -- Step 2: Seed expense categories
    INSERT INTO public.categories (user_id, name, type) VALUES
        (target_user_id, 'Savings & Investments', 'expense'),
        (target_user_id, 'Debt Repayment', 'expense'),
        (target_user_id, 'Office & Work', 'expense'),
        (target_user_id, 'Family & Friends', 'expense'),
        (target_user_id, 'Food & Dining', 'expense'),
        (target_user_id, 'Fees & Misc', 'expense'),
        (target_user_id, 'Utilities & Telecom', 'expense'),
        (target_user_id, 'Subscriptions & Software', 'expense'),
        (target_user_id, 'Education', 'expense'),
        (target_user_id, 'Transportation', 'expense')
    ON CONFLICT (user_id, name, type) DO NOTHING;

    -- Step 3: Seed income categories
    INSERT INTO public.categories (user_id, name, type) VALUES
        (target_user_id, 'Salary', 'income'),
        (target_user_id, 'Freelance', 'income'),
        (target_user_id, 'Investments', 'income'),
        (target_user_id, 'Gift', 'income'),
        (target_user_id, 'Other', 'income')
    ON CONFLICT (user_id, name, type) DO NOTHING;

    -- Step 4: Seed expenses from CSV
    INSERT INTO public.expenses (user_id, amount, category, date, note) VALUES
        (target_user_id, 15000.00, 'Savings & Investments', '2026-05-01', 'Committee (Ma''am Shumaila)'),
        (target_user_id, 4500.00, 'Debt Repayment', '2026-05-01', 'Loan (Mama)'),
        (target_user_id, 1610.00, 'Debt Repayment', '2026-05-01', 'Loan (Khawar)'),
        (target_user_id, 20000.00, 'Office & Work', '2026-05-01', 'Office Furniture'),
        (target_user_id, 10000.00, 'Family & Friends', '2026-05-01', 'Hussain'),
        (target_user_id, 3000.00, 'Family & Friends', '2026-05-01', 'Haseeb'),
        (target_user_id, 2000.00, 'Family & Friends', '2026-05-01', 'Mama'),
        (target_user_id, 720.00, 'Food & Dining', '2026-05-01', 'Eatery'),
        (target_user_id, 5000.00, 'Family & Friends', '2026-05-01', 'Paid to Azeem Mamu'),
        (target_user_id, 3000.00, 'Food & Dining', '2026-05-01', 'Pizza'),
        (target_user_id, 500.00, 'Fees & Misc', '2026-05-01', 'Paid for transaction failures (NP)'),
        (target_user_id, 280.00, 'Food & Dining', '2026-05-01', 'Eatery'),
        (target_user_id, 30000.00, 'Savings & Investments', '2026-05-01', 'Committee (Ma''am Ruby)'),
        (target_user_id, 2000.00, 'Savings & Investments', '2026-05-01', 'Committee (Misc)'),
        (target_user_id, 3000.00, 'Utilities & Telecom', '2026-05-01', 'Phone package'),
        (target_user_id, 1800.00, 'Utilities & Telecom', '2026-05-01', 'Internet'),
        (target_user_id, 300.00, 'Utilities & Telecom', '2026-05-01', 'Cable'),
        (target_user_id, 6000.00, 'Subscriptions & Software', '2026-05-01', 'Claude'),
        (target_user_id, 1800.00, 'Subscriptions & Software', '2026-05-01', 'OpenAI'),
        (target_user_id, 1000.00, 'Subscriptions & Software', '2026-05-01', 'Google'),
        (target_user_id, 500.00, 'Food & Dining', '2026-05-01', 'Foodpanda'),
        (target_user_id, 700.00, 'Subscriptions & Software', '2026-05-01', 'Youtube'),
        (target_user_id, 700.00, 'Subscriptions & Software', '2026-05-01', 'Spotify'),
        (target_user_id, 1300.00, 'Subscriptions & Software', '2026-05-01', 'Netflix'),
        (target_user_id, 8000.00, 'Fees & Misc', '2026-05-01', 'Misc.'),
        (target_user_id, 8500.00, 'Education', '2026-05-01', 'Uni fee'),
        (target_user_id, 500.00, 'Food & Dining', '2026-05-01', 'Panini Sandwich'),
        (target_user_id, 280.00, 'Food & Dining', '2026-05-01', 'Eatery'),
        (target_user_id, 2000.00, 'Food & Dining', '2026-05-01', 'KFC'),
        (target_user_id, 200.00, 'Fees & Misc', '2026-05-01', 'Misc.'),
        (target_user_id, 3100.00, 'Subscriptions & Software', '2026-05-01', 'Google AI'),
        (target_user_id, 2300.00, 'Transportation', '2026-05-01', 'Petrol Delivered');

    -- Step 5: Seed income
    INSERT INTO public.incomes (user_id, amount, source, date, note) VALUES
        (target_user_id, 115000.00, 'Salary', '2026-05-01', 'Monthly salary');

    RAISE NOTICE 'Seeded successfully for user %', target_user_id;
END $$;

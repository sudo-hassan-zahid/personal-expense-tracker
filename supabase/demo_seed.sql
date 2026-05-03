-- ============================================
-- Seed script for demo@test.com
-- This script creates the user and populates their data
-- Run this in the Supabase SQL Editor
-- ============================================

-- Step 1: Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_user_id uuid := uuid_generate_v4();
    target_user_id uuid;
BEGIN
    -- Check if user already exists
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'demo@test.com';

    -- If user doesn't exist, create them
    IF target_user_id IS NULL THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        )
        VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            'demo@test.com',
            crypt('12345678', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Demo User"}'::jsonb,
            'authenticated',
            'authenticated',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        target_user_id := new_user_id;
        RAISE NOTICE 'Created new user: demo@test.com';
    ELSE
        RAISE NOTICE 'User demo@test.com already exists, using existing ID: %', target_user_id;
    END IF;

    -- Note: The public.profiles record is automatically created by the on_auth_user_created trigger

    -- Step 2: Set user preferences
    UPDATE public.profiles
    SET currency = 'USD', theme = 'dark', updated_at = now()
    WHERE id = target_user_id;

    -- Step 3: Clear existing data for this user to avoid duplicates if re-run
    DELETE FROM public.expenses WHERE user_id = target_user_id;
    DELETE FROM public.incomes WHERE user_id = target_user_id;
    DELETE FROM public.categories WHERE user_id = target_user_id;

    -- Step 4: Seed categories
    -- Expense categories
    INSERT INTO public.categories (user_id, name, type) VALUES
        (target_user_id, 'Housing & Rent', 'expense'),
        (target_user_id, 'Food & Dining', 'expense'),
        (target_user_id, 'Transportation', 'expense'),
        (target_user_id, 'Utilities', 'expense'),
        (target_user_id, 'Entertainment', 'expense'),
        (target_user_id, 'Shopping', 'expense'),
        (target_user_id, 'Health & Fitness', 'expense'),
        (target_user_id, 'Personal Care', 'expense'),
        (target_user_id, 'Education', 'expense'),
        (target_user_id, 'Travel', 'expense');

    -- Income categories
    INSERT INTO public.categories (user_id, name, type) VALUES
        (target_user_id, 'Salary', 'income'),
        (target_user_id, 'Freelance', 'income'),
        (target_user_id, 'Investment Returns', 'income'),
        (target_user_id, 'Gifts', 'income');

    -- Step 5: Seed income
    INSERT INTO public.incomes (user_id, amount, source, date, note) VALUES
        (target_user_id, 5000.00, 'Salary', CURRENT_DATE - INTERVAL '1 month', 'Monthly Salary'),
        (target_user_id, 5000.00, 'Salary', CURRENT_DATE, 'Monthly Salary'),
        (target_user_id, 1200.00, 'Freelance', CURRENT_DATE - INTERVAL '15 days', 'Web Design Project'),
        (target_user_id, 450.00, 'Investment Returns', CURRENT_DATE - INTERVAL '5 days', 'Dividend Payment');

    -- Step 6: Seed expenses (Mix of recent and older)
    INSERT INTO public.expenses (user_id, amount, category, date, note) VALUES
        -- Housing
        (target_user_id, 1800.00, 'Housing & Rent', CURRENT_DATE - INTERVAL '2 days', 'Monthly Rent Payment'),
        
        -- Food & Dining
        (target_user_id, 45.50, 'Food & Dining', CURRENT_DATE - INTERVAL '1 day', 'Dinner with friends'),
        (target_user_id, 12.80, 'Food & Dining', CURRENT_DATE - INTERVAL '2 days', 'Morning Coffee'),
        (target_user_id, 85.00, 'Food & Dining', CURRENT_DATE - INTERVAL '4 days', 'Grocery Shopping'),
        (target_user_id, 32.00, 'Food & Dining', CURRENT_DATE - INTERVAL '6 days', 'Lunch Delivery'),
        
        -- Transportation
        (target_user_id, 55.00, 'Transportation', CURRENT_DATE - INTERVAL '3 days', 'Gas Station'),
        (target_user_id, 15.00, 'Transportation', CURRENT_DATE - INTERVAL '5 days', 'Public Transport Pass'),
        (target_user_id, 42.00, 'Transportation', CURRENT_DATE - INTERVAL '10 days', 'Uber Ride'),
        
        -- Utilities
        (target_user_id, 120.00, 'Utilities', CURRENT_DATE - INTERVAL '12 days', 'Electricity Bill'),
        (target_user_id, 60.00, 'Utilities', CURRENT_DATE - INTERVAL '14 days', 'Water Bill'),
        (target_user_id, 80.00, 'Utilities', CURRENT_DATE - INTERVAL '15 days', 'Internet Subscription'),
        
        -- Entertainment
        (target_user_id, 15.99, 'Entertainment', CURRENT_DATE - INTERVAL '20 days', 'Netflix Subscription'),
        (target_user_id, 12.00, 'Entertainment', CURRENT_DATE - INTERVAL '22 days', 'Spotify'),
        (target_user_id, 65.00, 'Entertainment', CURRENT_DATE - INTERVAL '8 days', 'Movie Night'),
        
        -- Shopping
        (target_user_id, 120.00, 'Shopping', CURRENT_DATE - INTERVAL '18 days', 'New Shoes'),
        (target_user_id, 45.00, 'Shopping', CURRENT_DATE - INTERVAL '25 days', 'Kitchenware'),
        
        -- Health
        (target_user_id, 50.00, 'Health & Fitness', CURRENT_DATE - INTERVAL '7 days', 'Gym Membership'),
        (target_user_id, 35.00, 'Health & Fitness', CURRENT_DATE - INTERVAL '28 days', 'Pharmacy'),
        
        -- Travel
        (target_user_id, 450.00, 'Travel', CURRENT_DATE - INTERVAL '35 days', 'Flight Booking');

    RAISE NOTICE 'Demo data seeded successfully for user demo@test.com';
END $$;

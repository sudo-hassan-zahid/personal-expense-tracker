-- Migration for Enhanced Features
-- Date: 2026-05-03
-- Description: Update user profile trigger for name saving and cleanup

-- 1. Update the handle_new_user trigger to save full_name from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Note: No changes needed to expenses/incomes tables as they use text for categories/sources.
-- The deletion validation is handled in the application logic (actions/category.ts).

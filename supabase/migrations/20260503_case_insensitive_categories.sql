-- Migration: Case-insensitive Categories with Cleanup
-- Date: 2026-05-03

-- 1. Identify and merge duplicates before creating index
do $$
declare
    cat_rec record;
    canonical_id uuid;
    canonical_name text;
begin
    -- Loop through all sets of duplicate names (case-insensitive) for each user/type
    for cat_rec in (
        select user_id, lower(name) as lower_name, type
        from public.categories
        group by user_id, lower(name), type
        having count(*) > 1
    ) loop
        -- Find the "canonical" version (we'll keep the oldest one)
        select id, name into canonical_id, canonical_name
        from public.categories
        where user_id = cat_rec.user_id 
          and lower(name) = cat_rec.lower_name 
          and type = cat_rec.type
        order by created_at asc
        limit 1;

        -- Update linked expenses to the canonical name
        if cat_rec.type = 'expense' then
            update public.expenses
            set category = canonical_name
            where user_id = cat_rec.user_id
              and lower(category) = cat_rec.lower_name;
        else
            -- Update linked incomes to the canonical name
            update public.incomes
            set source = canonical_name
            where user_id = cat_rec.user_id
              and lower(source) = cat_rec.lower_name;
        end if;

        -- Delete the other duplicate category records
        delete from public.categories
        where user_id = cat_rec.user_id
          and lower(name) = cat_rec.lower_name
          and type = cat_rec.type
          and id != canonical_id;
          
    end loop;
end $$;

-- 2. Remove the old unique constraint (if it exists)
alter table public.categories drop constraint if exists categories_user_id_name_type_key;

-- 3. Create the new case-insensitive unique index
create unique index if not exists categories_user_id_lower_name_type_idx on public.categories (user_id, lower(name), type);

-- Monthly category budgets
create table if not exists public.monthly_budgets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    category text not null,
    month date not null,
    limit_amount numeric not null check (limit_amount > 0),
    alert_threshold numeric not null default 0.8 check (alert_threshold > 0 and alert_threshold <= 1),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, category, month)
);

alter table public.monthly_budgets enable row level security;

create policy "Users can view their own budgets"
    on public.monthly_budgets for select
    using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
    on public.monthly_budgets for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
    on public.monthly_budgets for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own budgets"
    on public.monthly_budgets for delete
    using (auth.uid() = user_id);

create index if not exists monthly_budgets_user_month_idx
    on public.monthly_budgets(user_id, month);

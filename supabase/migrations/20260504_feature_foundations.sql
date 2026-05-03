-- Feature foundations for advanced workflows.

alter table public.expenses add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
alter table public.expenses add column if not exists deleted_at timestamp with time zone;
alter table public.expenses add column if not exists attachment_url text;
alter table public.expenses add column if not exists currency text default 'USD' not null;

alter table public.incomes add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
alter table public.incomes add column if not exists deleted_at timestamp with time zone;
alter table public.incomes add column if not exists currency text default 'USD' not null;

alter table public.monthly_budgets add column if not exists rollover_amount numeric default 0 not null;

create index if not exists expenses_user_deleted_date_idx
    on public.expenses(user_id, deleted_at, date desc);

create index if not exists incomes_user_deleted_date_idx
    on public.incomes(user_id, deleted_at, date desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_expenses_updated_at on public.expenses;
create trigger set_expenses_updated_at
    before update on public.expenses
    for each row execute procedure public.set_updated_at();

drop trigger if exists set_incomes_updated_at on public.incomes;
create trigger set_incomes_updated_at
    before update on public.incomes
    for each row execute procedure public.set_updated_at();

drop trigger if exists set_monthly_budgets_updated_at on public.monthly_budgets;
create trigger set_monthly_budgets_updated_at
    before update on public.monthly_budgets
    for each row execute procedure public.set_updated_at();

create table if not exists public.recurring_transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    type text not null check (type in ('expense', 'income')),
    amount numeric not null check (amount > 0),
    category_or_source text not null,
    note text,
    frequency text not null check (frequency in ('weekly', 'monthly', 'yearly')),
    next_date date not null,
    end_date date,
    status text default 'active' not null check (status in ('active', 'paused')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recurring_transactions enable row level security;

create policy "Users can view their own recurring transactions"
    on public.recurring_transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own recurring transactions"
    on public.recurring_transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own recurring transactions"
    on public.recurring_transactions for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own recurring transactions"
    on public.recurring_transactions for delete
    using (auth.uid() = user_id);

create index if not exists recurring_transactions_user_next_date_idx
    on public.recurring_transactions(user_id, status, next_date);

create table if not exists public.savings_goals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    target_amount numeric not null check (target_amount > 0),
    current_amount numeric not null default 0 check (current_amount >= 0),
    target_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.savings_goals enable row level security;

create policy "Users can view their own savings goals"
    on public.savings_goals for select
    using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
    on public.savings_goals for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
    on public.savings_goals for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
    on public.savings_goals for delete
    using (auth.uid() = user_id);

create index if not exists savings_goals_user_created_idx
    on public.savings_goals(user_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('transaction-attachments', 'transaction-attachments', false)
on conflict (id) do nothing;

create policy "Users can view their own transaction attachments"
    on storage.objects for select
    using (
        bucket_id = 'transaction-attachments'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Users can upload their own transaction attachments"
    on storage.objects for insert
    with check (
        bucket_id = 'transaction-attachments'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Users can update their own transaction attachments"
    on storage.objects for update
    using (
        bucket_id = 'transaction-attachments'
        and auth.uid()::text = (storage.foldername(name))[1]
    )
    with check (
        bucket_id = 'transaction-attachments'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Users can delete their own transaction attachments"
    on storage.objects for delete
    using (
        bucket_id = 'transaction-attachments'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

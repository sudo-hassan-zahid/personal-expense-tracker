-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create expenses table
create table public.expenses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    amount numeric not null,
    category text not null,
    date date not null,
    note text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create incomes table
create table public.incomes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    amount numeric not null,
    source text not null,
    date date not null,
    note text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.expenses enable row level security;
alter table public.incomes enable row level security;

-- Create policies for expenses
create policy "Users can view their own expenses"
    on public.expenses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
    on public.expenses for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
    on public.expenses for update
    using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
    on public.expenses for delete
    using (auth.uid() = user_id);

-- Create policies for incomes
create policy "Users can view their own incomes"
    on public.incomes for select
    using (auth.uid() = user_id);

create policy "Users can insert their own incomes"
    on public.incomes for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own incomes"
    on public.incomes for update
    using (auth.uid() = user_id);

create policy "Users can delete their own incomes"
    on public.incomes for delete
    using (auth.uid() = user_id);

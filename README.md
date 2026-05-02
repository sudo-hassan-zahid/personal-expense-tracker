# Personal Expense Tracker

A fast, scalable personal finance tracker designed with a Binance-inspired UI. Built with Next.js (App Router), Tailwind CSS v4, and Supabase.

Live Demo: [https://expense-tracker-by-hassan.vercel.app](https://expense-tracker-by-hassan.vercel.app)

## Tech Stack

- Framework: Next.js 15 (App Router)
- Backend: Supabase (PostgreSQL + Auth)
- Database: Row Level Security (RLS)
- Styling: Tailwind CSS v4
- Icons: Lucide React
- Package Manager: pnpm

## Setup Steps

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Initialize database schema using `database.sql` in Supabase SQL Editor.



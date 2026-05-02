# Personal Expense Tracker

A high-performance personal finance tracking application featuring a Binance-inspired professional trading interface. Built for speed and granular data control.

Live Demo: [https://expense-tracker-by-hassan.vercel.app](https://expense-tracker-by-hassan.vercel.app)

## Tech Stack

- Framework: Next.js 15 (App Router)
- Backend: Supabase (PostgreSQL + Auth)
- Database: Row Level Security (RLS)
- Styling: Tailwind CSS v4 (Engineered for performance)
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

4. Run the development server:
   ```bash
   pnpm dev
   ```



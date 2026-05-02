# Personal Expense Tracker

A high-performance personal finance tracking application featuring a Binance-inspired professional trading interface. Built for speed and granular data control.

Deployed Application: [https://expense-tracker-by-hassan.vercel.app](https://expense-tracker-by-hassan.vercel.app)

## Key Features

- Interactive Dashboard: Real-time data visualization with area charts and date range filtering.
- Transaction Management: Full CRUD support for income and expenses with advanced editing and table migration.
- Advanced Organization: Custom category creation and status tracking (Pending vs Done) for precise accounting.

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

3. Initialize database schema using the `database.sql` file in the Supabase SQL Editor.

4. Start the development server:
   ```bash
   pnpm dev
   ```



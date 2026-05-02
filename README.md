# 📊 Personal Expense Tracker

A fast, scalable personal finance tracker designed with a Binance-inspired UI. Built with Next.js (App Router), Tailwind CSS v4, and Supabase.

## ✨ Features

- **Binance-Inspired UI**: Built with strict adherence to the Binance design system with standard dark/light canvases and signature primary-yellow accents.
- **Server Actions & SSR**: Optimized using Next.js Server Components and Server Actions to ensure minimal client-side state.
- **Supabase Authentication**: Secure email/password login integrated seamlessly with Next.js middleware.
- **Strict Row Level Security**: All PostgreSQL databases are protected by RLS (`user_id = auth.uid()`).
- **Dashboard Filters**: Transaction tables support fast category and type filtering via native Next.js `searchParams`.

## ⚙️ Tech Stack

- **Framework**: Next.js (App Router)
- **Package Manager**: pnpm
- **Backend & Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Parsing**: Date-fns

---

## 🚀 How to Run and Test Locally

Follow these steps to safely run the project in your local development environment:

### 1. Install Dependencies

Make sure you are using `pnpm` as your package manager.

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (you can copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then, populate the file with your actual Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase `anon` / `public` API key. _(Note: This key is safe to be exposed on the frontend since we are enforcing RLS.)_

### 3. Setup Database Schema & RLS

Open your Supabase project dashboard, navigate to the **SQL Editor**, and copy-paste the contents of the `database.sql` file provided in this repository. Run the script to:

- Generate the `expenses` and `incomes` tables.
- Enforce strict Row Level Security (RLS) policies linking records to `auth.users`.

### 4. Start Development Server

```bash
pnpm run dev
```

### 5. Test the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Click **Sign Up** to create an account.
2. Observe how the Next.js `middleware.ts` automatically redirects you to the `/dashboard`.
3. Quick-add an **Income** and **Expense** using the forms on the right.
4. Try filtering transactions using the dropdown in the **Recent Transactions** table.

# 📊 Personal Expense Tracker

A fast, scalable personal finance tracker designed with a Binance-inspired UI. Built with Next.js (App Router), Tailwind CSS v4, and Supabase.

## ✨ Features
Binance-Inspired UI: Built with strict adherence to the Binance design system with standard dark/light canvases and signature primary-yellow accents.
Server Actions & SSR: Optimized using Next.js Server Components and Server Actions to ensure minimal client-side state.
Supabase Authentication: Secure email/password login integrated seamlessly with Next.js middleware.
Strict Row Level Security: All PostgreSQL databases are protected by RLS (user_id = auth.uid()).
Dashboard Filters: Transaction tables support fast category and type filtering via native Next.js searchParams.

## ⚙️ Tech Stack
Framework: Next.js (App Router)
Package Manager: pnpm
Backend & Auth: Supabase (PostgreSQL + Auth)
Styling: Tailwind CSS v4
Icons: Lucide React
Date Parsing: Date-fns

## 🚀 How to Run and Test Locally
Follow these steps to safely run the project in your local development environment:

### 1. Install Dependencies
Make sure you are using pnpm as your package manager.

```bash
pnpm install
```
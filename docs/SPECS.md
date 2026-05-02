# 📊 Personal Expense Tracker — Technical Specification (SPECS.md)

## 1. 🎯 Objective

Build a fast, scalable personal finance tracker for:

- Expenses
- Income
- Financial analytics

Focus:

- Performance
- Simplicity
- Maintainability

---

## 2. 🧱 Tech Stack

### Frontend & Backend

- Next.js (App Router)
- Server Components (default)
- Server Actions for mutations

### Package Manager

- pnpm (mandatory)

### Database & Auth

- Supabase (PostgreSQL + Auth)

### Styling

- Tailwind CSS

### Hosting

- Vercel (Free tier)

---

## 3. ⚡ Performance Rules

- Prefer Server Components
- Avoid unnecessary client state
- Use Server Actions for writes
- Optimize DB queries
- Keep bundle size small
- Avoid heavy dependencies

---

## 4. 🎨 Design System (STRICT)

Must follow DESIGN.md exactly:

- No UI decisions outside it
- Binance-style UI inspiration
- Mobile-first responsive design

---

## 5. 📦 Features

### Authentication

- Email/password login
- Supabase Auth
- Protected routes

---

### Dashboard

- Total income
- Total expenses
- Net balance

Filters:

- Category
- Date range
- Month
- Amount range
- Sorting (asc/desc)

---

### Expenses

- Create
- Edit
- Delete

Fields:

- amount
- category
- date
- note

---

### Income

- Create
- Edit
- Delete

Fields:

- amount
- source
- date
- note

---

## 6. 🗄️ Database (Supabase)

### expenses

- id (uuid)
- user_id (uuid)
- amount (numeric)
- category (text)
- date (date)
- note (text)
- created_at (timestamp)

### incomes

- id (uuid)
- user_id (uuid)
- amount (numeric)
- source (text)
- date (date)
- note (text)
- created_at (timestamp)

---

## 7. 🔐 Security

- Enable Row Level Security (RLS)
- Policy:
  user_id = auth.uid()

Keys:

- anon key → frontend safe
- service_role → server only

---

## 8. 📡 Data Layer

Use Server Actions:

- addExpense
- updateExpense
- deleteExpense
- getExpenses
- addIncome
- getIncome

---

## 9. 📁 Structure

/app
/dashboard
/login
/signup

/components
/ui
/forms
/charts

/lib
supabaseClient.ts
utils.ts

/actions
expense.ts
income.ts

/types
index.ts

---

## 10. ⚙️ Setup

Initialize:

pnpm create next-app .

Supabase env:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

## 11. 🚀 Deployment

- Push to GitHub
- Connect Vercel
- Add env vars
- Deploy

---

## 12. 🔁 Git Rules

Commit often:

- feat: add feature
- fix: bug fix
- refactor: cleanup

---

## 13. 🧠 Philosophy

- Keep it simple
- Avoid overengineering
- Prioritize clarity
- Optimize only when needed

# Feature Ideas

This document lists practical features that can be added next to the Personal Expense Tracker. The ideas are grouped by product area and include a suggested priority so future work can be planned without losing the app's current focus on speed, simplicity, and maintainability.

## Priority Legend

- **P0**: High-value feature that strengthens the core tracker experience.
- **P1**: Useful enhancement after the main workflows are stable.
- **P2**: Nice-to-have feature for a more polished or advanced product.

## Core Finance Features

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Edit income records | Add full update support for income entries, matching the expense edit workflow. |
| P0 | Delete income records | Let users remove incorrect income entries from their account. |
| P1 | Recurring transactions | Let users define repeating income or expense records such as salary, rent, subscriptions, and bills. |
| P1 | Transaction attachments | Allow receipts or supporting files to be attached to expenses using Supabase Storage. |
| P1 | Custom categories | Let users create, rename, reorder, and delete their own income and expense categories. |
| P1 | Transaction search | Add keyword search across notes, categories, and income sources. |
| P2 | Split transactions | Support splitting one payment across multiple categories. |

## Budgeting

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Monthly category budgets | Let users set budget limits for each expense category per month. |
| P0 | Budget progress indicators | Show used budget, remaining budget, and over-budget status on the dashboard. |
| P1 | Budget alerts | Notify users when a category reaches a configurable threshold such as 80% or 100%. |
| P1 | Savings goals | Let users define goals with target amounts, target dates, and progress tracking. |
| P2 | Rollover budgets | Allow unused budget from one month to roll into the next month. |

## Analytics And Reporting

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Category breakdown chart | Show expense distribution by category using a chart component. |
| P0 | Income vs expense trend | Display monthly income, expenses, and net balance over time. |
| P1 | Cash flow summary | Show opening balance, total inflow, total outflow, and closing balance for a selected period. |
| P1 | Top spending categories | Highlight the categories with the highest spending for the selected period. |
| P1 | Average daily spend | Calculate daily spending pace for the current month. |
| P2 | Yearly comparison | Compare spending and income across months or years. |
| P2 | Forecasting | Estimate end-of-month balance based on current spending pace and recurring transactions. |

## Data Management

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | CSV export | Let users export filtered income and expense data for backup or external analysis. |
| P1 | CSV import | Allow users to import existing financial records from spreadsheets. |
| P1 | Bulk edit | Let users select multiple transactions and update category, date, or delete them together. |
| P1 | Duplicate detection | Warn users when a newly added transaction looks similar to an existing one. |
| P2 | Bank statement import | Add guided import for common bank statement formats. |

## User Experience

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Empty states | Add helpful empty states for new users who do not have income or expense records yet. |
| P0 | Loading and error states | Make dashboard, forms, and tables feel smoother during server actions and failed requests. |
| P1 | Quick-add modal | Add a keyboard-friendly modal for quickly adding income or expense records from anywhere. |
| P1 | Toast confirmations | Show clear success and error messages after create, update, and delete actions. |
| P1 | Mobile table improvements | Improve transaction browsing on small screens with stacked rows or compact cards. |
| P2 | Keyboard shortcuts | Add shortcuts for opening quick-add, saving forms, and switching filters. |

## Account And Personalization

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | User profile settings | Let users manage display name and account preferences. |
| P1 | Currency preference | Allow users to choose a default currency symbol and formatting style. |
| P1 | Theme preference | Persist light or dark theme choice per user. |
| P2 | Multi-currency support | Track income and expenses in more than one currency with optional exchange rates. |

## Security And Reliability

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Stronger form validation | Validate required fields, positive amounts, date boundaries, and note length on the server. |
| P0 | Server action error handling | Standardize mutation responses so the UI can show predictable errors. |
| P1 | Audit timestamps | Track `updated_at` on financial records for better debugging and future sync support. |
| P1 | Soft delete | Mark deleted records as archived before permanent deletion. |
| P2 | Account data deletion | Let users permanently delete their account data with confirmation. |

## Performance And Maintenance

| Priority | Feature | Description |
| --- | --- | --- |
| P0 | Query pagination | Paginate transaction lists so large accounts stay fast. |
| P0 | Database indexes | Add indexes for common filters such as `user_id`, `date`, `category`, and `created_at`. |
| P1 | Shared data loaders | Keep dashboard data fetching centralized and cache-aware. |
| P1 | Component test coverage | Add focused tests around forms, filters, and summary calculations. |
| P2 | Observability | Add lightweight logging or monitoring for production errors. |

## Suggested Roadmap

### Phase 1: Complete The Core

- Edit and delete income records.
- Keep transaction sorting and search fast for larger accounts.
- Add stronger server-side validation.
- Add empty, loading, and error states.
- Add transaction pagination and database indexes.

### Phase 2: Make It Useful Daily

- Monthly category budgets.
- Budget progress indicators.
- Category breakdown and income vs expense charts.
- CSV export.
- Custom categories.
- Currency and theme preferences.

### Phase 3: Advanced Finance Workflows

- Recurring transactions.
- Savings goals.
- CSV import.
- Transaction attachments.
- Duplicate detection.
- Forecasting and yearly comparison reports.

## Implementation Notes

- Keep new reads in Server Components where possible.
- Keep mutations in Server Actions.
- Continue enforcing Supabase RLS on user-owned data.
- Avoid adding heavy dependencies unless the feature clearly needs them.
- Prefer small, focused database changes that are easy to migrate and test.

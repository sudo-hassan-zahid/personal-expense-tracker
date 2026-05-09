# Simple Feature Roadmap

This app should stay a personal expense tracker: fast entry, clear totals, simple planning, and easy cleanup. Avoid bank-like features such as account linking, card products, credit scoring, loan flows, investment dashboards, or compliance-heavy workflows.

## Product Direction

- Help users record income and expenses with less effort.
- Make monthly spending easier to understand at a glance.
- Keep planning features light: budgets, goals, recurring reminders, and imports.
- Prefer clear defaults over complex settings.
- Keep every new feature useful without requiring financial knowledge.

## P0: Best Next Features

| Feature | Why it helps | Keep it simple by |
| --- | --- | --- |
| Better first-run setup | New users need categories, currency, and one sample workflow before the dashboard feels useful. | Ask for currency and starter categories only. Skip long onboarding. |
| Recent transaction undo | Soft delete already exists, so users should be able to recover accidental deletes. | Add a short-lived undo toast and a simple "Recently deleted" list. |
| Recurring reminders polish | Recurring transactions exist, but users must manually post due items. | Show due recurring items on the dashboard with one "Post due" button. |
| Budget month switcher | Budgets are tied to the current month only in the main dashboard flow. | Add previous/current/next month controls, no forecasting model. |
| Cleaner CSV import review | CSV import currently imports row-by-row without showing what will happen first. | Add a preview screen with valid rows, skipped rows, and simple error messages. |
| Mobile transaction cards | The table is usable, but day-to-day phone use should feel easier. | Use compact cards with date, note, category/source, amount, and actions. |

## P1: Useful After The Core Is Stable

| Feature | Why it helps | Keep it simple by |
| --- | --- | --- |
| Quick edit inline | Editing through a modal is fine, but amount/category/date fixes are common. | Let users edit one row at a time. Keep advanced fields in the modal. |
| Category cleanup tools | Categories can be renamed, but old/duplicate category management will matter as users import more data. | Add merge category/source, not a full taxonomy system. |
| Saved dashboard filters | Users may repeatedly view "this month groceries" or "pending income." | Save 3-5 named filter presets per user. |
| Monthly note | Some users want a plain comment like "travel month" or "moved apartments." | One text note per month, shown near monthly summary. |
| Import templates | Users should not guess CSV column names. | Provide one sample CSV download and copyable accepted headers. |
| Goal contribution shortcut | Savings goals are currently manually updated. | Add "Add contribution" that only increments current amount. |

## P2: Nice Polish

| Feature | Why it helps | Keep it simple by |
| --- | --- | --- |
| Spending pace | Helps users know whether the month is going too fast. | Show "You are spending about X/day" for the selected month. |
| Duplicate review queue | Duplicate detection exists during add, but imports can skip context. | Show possible duplicates in import preview and let users skip/import. |
| Attachments cleanup | Expenses can have attachments, but users need confidence files are manageable. | Add replace/remove attachment on expense edit. |
| Lightweight reminders | Helpful for bills or salary dates. | In-app reminders only; avoid email/SMS until there is a clear need. |
| Export presets | CSV export exists. | Add one-click "current month" and "all data backup" export links. |

## Features To Avoid For Now

- Bank account connections.
- Real-time bank transaction sync.
- Credit cards, loans, investments, crypto, taxes, or financial advice.
- Multi-user household permissions.
- AI financial coach or prediction engine.
- Exchange-rate automation unless multi-currency becomes a real user problem.

## Suggested Build Order

1. Fix the critical bugs and data correctness issues in `BUGS_OPTIMIZATION_AUDIT.md`.
2. Add first-run setup and stronger empty states.
3. Add undo/recently deleted.
4. Improve recurring transaction visibility on the dashboard.
5. Add CSV import preview.
6. Polish mobile transaction browsing.

## Success Criteria

- A user can add, edit, find, delete, and recover basic records without confusion.
- Monthly totals and budgets match the selected period.
- Imports do not silently skip important data.
- The app still feels like a simple tracker, not a banking product.

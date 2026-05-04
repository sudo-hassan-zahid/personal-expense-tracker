@echo off
setlocal enabledelayedexpansion

REM Commits formatted files one by one. Run from the repo root.
git status --short
if errorlevel 1 exit /b 1

call :commit_one "AGENTS.md"
call :commit_one "actions/category.ts"
call :commit_one "actions/expense.ts"
call :commit_one "actions/import.ts"
call :commit_one "actions/income.ts"
call :commit_one "actions/planning.ts"
call :commit_one "actions/profile.ts"
call :commit_one "app/auth/callback/route.ts"
call :commit_one "app/auth/signout/route.ts"
call :commit_one "app/dashboard/categories/page.tsx"
call :commit_one "app/dashboard/loading.tsx"
call :commit_one "app/dashboard/page.tsx"
call :commit_one "app/dashboard/planning/page.tsx"
call :commit_one "app/dashboard/profile/page.tsx"
call :commit_one "app/forgot-password/actions.ts"
call :commit_one "app/globals.css"
call :commit_one "app/layout.tsx"
call :commit_one "app/login/actions.ts"
call :commit_one "app/login/page.tsx"
call :commit_one "app/page.tsx"
call :commit_one "app/signup/actions.ts"
call :commit_one "app/signup/page.tsx"
call :commit_one "app/signup/success/page.tsx"
call :commit_one "components/ActionForm.tsx"
call :commit_one "components/AnalyticsSummary.tsx"
call :commit_one "components/BudgetProgress.tsx"
call :commit_one "components/CategoryManager.tsx"
call :commit_one "components/CategorySelect.tsx"
call :commit_one "components/CurrencySelector.tsx"
call :commit_one "components/DashboardChart.tsx"
call :commit_one "components/DashboardContent.tsx"
call :commit_one "components/DeleteButton.tsx"
call :commit_one "components/DeleteConfirmationModal.tsx"
call :commit_one "components/DemoAccountCard.tsx"
call :commit_one "components/EditTransactionModal.tsx"
call :commit_one "components/LazyEffects.tsx"
call :commit_one "components/PaginationControls.tsx"
call :commit_one "components/PlanningPanel.tsx"
call :commit_one "components/QuickAddModal.tsx"
call :commit_one "components/SortButton.tsx"
call :commit_one "components/SplitExpenseForm.tsx"
call :commit_one "components/ThemeToggle.tsx"
call :commit_one "components/TopNav.tsx"
call :commit_one "components/TopNavClient.tsx"
call :commit_one "components/TransactionFilter.tsx"
call :commit_one "components/TransactionList.tsx"
call :commit_one "components/ui/Calendar.tsx"
call :commit_one "components/ui/CursorTrail.tsx"
call :commit_one "components/ui/DatePicker.tsx"
call :commit_one "components/ui/DateRangePicker.tsx"
call :commit_one "components/ui/LoadingSpinner.tsx"
call :commit_one "components/ui/ParticleBackground.tsx"
call :commit_one "components/ui/ProgressBar.tsx"
call :commit_one "docs/FEATURE_IDEAS.md"
call :commit_one "hooks/useTransactions.ts"
call :commit_one "lib/analytics.ts"
call :commit_one "lib/currency.ts"
call :commit_one "lib/dashboard-data.ts"
call :commit_one "lib/date-utils.ts"
call :commit_one "lib/form-validation.ts"
call :commit_one "lib/request-data.ts"
call :commit_one "lib/supabase.ts"
call :commit_one "lib/url.ts"

echo.
echo Done. Final status:
git status --short
exit /b %errorlevel%

:commit_one
set "file=%~1"
git diff --quiet -- "%file%"
if not errorlevel 1 (
  echo.
  echo Creating empty commit for unchanged file: %file%
  git commit --allow-empty -m "Format %file%"
  if errorlevel 1 exit /b 1
  exit /b 0
)

echo.
echo Committing: %file%
git add -- "%file%"
if errorlevel 1 exit /b 1
git commit -m "Format %file%"
if errorlevel 1 exit /b 1
exit /b 0

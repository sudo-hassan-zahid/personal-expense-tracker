@echo off
setlocal EnableExtensions

cd /d "%~dp0\.."

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo This script must be run inside a Git worktree.
  exit /b 1
)

for /f %%F in ('git diff --cached --name-only') do (
  echo Staged changes already exist: %%F
  echo Please commit or unstage them before running this script.
  exit /b 1
)

echo Current status:
git status --short
echo.

call :commit_one "components\ui\DatePicker.tsx" "Add date picker help text" || exit /b 1
call :commit_one "components\TransactionFilter.tsx" "Add transaction filter help text" || exit /b 1
call :commit_one "components\SplitExpenseForm.tsx" "Add split expense help text" || exit /b 1
call :commit_one "components\DashboardContent.tsx" "Add dashboard contextual help" || exit /b 1
call :commit_one "components\EditTransactionModal.tsx" "Add edit transaction help text" || exit /b 1
call :commit_one "components\PlanningPanel.tsx" "Add planning panel help text" || exit /b 1
call :commit_one "components\TransactionList.tsx" "Add transaction list help text" || exit /b 1
call :commit_one "components\BudgetProgress.tsx" "Add budget progress help text" || exit /b 1
call :commit_one "components\AnalyticsSummary.tsx" "Add analytics summary help text" || exit /b 1
call :commit_one "components\CategoryManager.tsx" "Add category manager help text" || exit /b 1
call :commit_one "app\dashboard\profile\page.tsx" "Add profile settings help text" || exit /b 1

echo.
echo Incremental commits complete.
git status --short
echo.
echo Push manually when ready:
echo git push origin main
exit /b 0

:commit_one
set "FILE=%~1"
set "MESSAGE=%~2"

git diff --quiet -- "%FILE%"
if not errorlevel 1 (
  echo Skipping clean file: %FILE%
  exit /b 0
)

echo.
echo Committing %FILE%
git add -- "%FILE%" || exit /b 1
git commit -m "%MESSAGE%" || exit /b 1
exit /b 0

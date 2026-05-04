@echo off
setlocal EnableExtensions DisableDelayedExpansion

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo This script must be run inside a Git repository.
  exit /b 1
)

git diff --quiet --exit-code
set "HAS_UNSTAGED=%ERRORLEVEL%"

git diff --cached --quiet --exit-code
set "HAS_STAGED=%ERRORLEVEL%"

for /f "delims=" %%F in ('git ls-files --others --exclude-standard') do (
  set "HAS_UNTRACKED=1"
)

if "%HAS_UNSTAGED%"=="0" if "%HAS_STAGED%"=="0" if not defined HAS_UNTRACKED (
  echo No changed files to commit.
  exit /b 0
)

for /f "delims=" %%F in ('git diff --name-only --diff-filter=ACMRTUXB') do (
  call :commit_one "%%F"
  if errorlevel 1 exit /b 1
)

for /f "delims=" %%F in ('git diff --cached --name-only --diff-filter=ACMRTUXB') do (
  call :commit_one "%%F"
  if errorlevel 1 exit /b 1
)

for /f "delims=" %%F in ('git ls-files --others --exclude-standard') do (
  call :commit_one "%%F"
  if errorlevel 1 exit /b 1
)

echo Done.
exit /b 0

:commit_one
set "FILE=%~1"

git diff --quiet --exit-code -- "%FILE%"
set "WORKTREE_CLEAN=%ERRORLEVEL%"

git diff --cached --quiet --exit-code -- "%FILE%"
set "INDEX_CLEAN=%ERRORLEVEL%"

git ls-files --error-unmatch -- "%FILE%" >nul 2>&1
set "TRACKED=%ERRORLEVEL%"

if "%WORKTREE_CLEAN%"=="0" if "%INDEX_CLEAN%"=="0" if "%TRACKED%"=="0" (
  exit /b 0
)

echo Committing %FILE%
git add -- "%FILE%"
if errorlevel 1 exit /b 1

git commit --only --message "chore: formatted '%FILE%'" -- "%FILE%"
if errorlevel 1 exit /b 1

exit /b 0

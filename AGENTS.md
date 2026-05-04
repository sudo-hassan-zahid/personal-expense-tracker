# Codex Git Command Policy

## Git permissions

Codex may run Git commands automatically when useful, including:

- `git status`
- `git diff`
- `git log`
- `git branch`
- `git checkout`
- `git switch`
- `git fetch`
- `git pull`
- `git add`
- `git commit`
- `git stash`
- `git restore`
- `git merge`
- `git rebase`
- `git tag`
- `git remote`
- `git config`

## Strictly forbidden Git commands

Codex must never run these commands:

- `git reset`
- `git push`

This includes all variants, flags, aliases, and indirect forms, such as:

- `git reset --hard`
- `git reset --soft`
- `git reset HEAD`
- `git push origin main`
- `git push --force`
- `git push --tags`

## Behavior rules

- Do not ask before running allowed Git commands unless the command may overwrite work.
- Always check `git status` before making Git changes.
- Never discard user work without explicit confirmation.
- Never rewrite history unless explicitly requested.
- Never push changes. Instead, tell the user the exact push command they can run manually.
- Never reset changes. Use safer alternatives like `git restore`, `git checkout`, or `git stash` only when appropriate.

## Commit rules

Codex may create commits automatically after completing a task.

Before committing:

1. Run `git status`.
2. Review the changed files.
3. Run relevant tests or checks when available.
4. Use a clear commit message.

After committing:

- Show the commit hash.
- Show the command the user can run manually to push.

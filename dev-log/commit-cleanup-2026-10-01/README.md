# Commit cleanup — 2026-10-01

Branch: `feature/quiz`. Existing changes grouped by code topic; no history rewritten.

## Validation errors

- `npm run lint` — exit 2: ESLint 9.39.5 cannot find `eslint.config.js`, `.mjs`, or `.cjs`. The IDE referenced a config, but none exists in this checkout. See `lint.log`; the original supplied `lint.txt` is preserved at repository root.
- `npm test` — exit 1: all four server suites fail during import resolution; no tests run. Unresolved imports: `@bq/shared/services`, `@/redis`, `@/redis/key-setter`. See `server-tests.log`.
- `./node_modules/.bin/tsc --noEmit` — exit 2: 649 diagnostics, including unresolved app/shared aliases and type errors. See `typecheck.log`.
- Initial `git diff --check` — exit 2: trailing whitespace in `packages/shared/package.json:12` and `packages/shared/tsconfig.json:19`. Removed whitespace; subsequent check passed. Removed the shared package manifest's empty-line-only change.

These checks describe the submitted working tree; they were not compared against a clean baseline. Functional and configuration fixes are outside this commit-organization task.

## Git operations

- Initial staging attempt failed (exit 128): Git could not create `.git/index.lock` because `.git` is mounted read-only in the sandbox. Requested escalated execution for staging and committing.

- Created 11 topic commits successfully after granting Git write access (listed below).
- Final committed-range whitespace check found trailing whitespace in the newly tracked Redis helper and excess blank lines at EOF in two lint reports. Cleaned these in a follow-up documentation/whitespace commit.
- `git push -u origin feature/quiz` inside the sandbox — exit 128: `Could not resolve host: github.com`.
- Network-enabled push retry — exit 128: `could not read Username for https://github.com: No such device or address`. GitHub HTTPS credentials are unavailable. No commits were pushed; authenticate Git, then retry `git push -u origin feature/quiz`.

## Topic commits


- `5b2f7d1` chore(tooling): add lint dependencies and update TypeScript scope
- `35485f8` feat(shared): add answer checking and quiz question processing
- `57746da` feat(quiz): connect shared quiz and question state machines
- `9370710` feat(server): add Redis quiz messaging and heartbeat helpers
- `47fa317` style(server): standardize services, scraper, and test formatting
- `c05b308` style(ui): standardize Expo UI primitive formatting
- `66f8419` refactor(expo): update style definitions and editor components
- `c6e39c8` feat(expo): add profile preview content
- `cf015ee` style(expo): clean up app screens, quiz setup, and providers
- `2a045f4` chore(expo): refresh app icon and favicon
- `9d76f8e` docs: update development log and record validation errors

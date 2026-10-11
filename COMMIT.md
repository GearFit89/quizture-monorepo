# Approved commit plan

Reviewed on October 10, 2026. Branch: `feature/quiz`. Baseline: `0c94cc2`.

**Approved on October 10, 2026, with group 4 split into three commits.** This plan covers the current tracked edits, deletions, and untracked source/test files. Existing commits are not being reorganized. Titles below are proposed commit messages.

## 1. `feat(shared): add random word selection helpers`

Add inclusive `randomInt`, random-word selection, and question-pool word selection helpers.

- `packages/shared/src/utils.ts`

This file also contains substantial quote/semicolon formatting changes. Keep those with this file unless you prefer a separate formatting commit. This commit does not claim the helpers handle empty pools safely or have dedicated tests.

## 2. `feat(shared): implement normal quiz lifecycle and actor types`

Wire the real normal quiz into the root, carry questions/difficulty/timing into its input, initialize question actors, grade/store answers, preserve retries, and transition through Summary until COMPLETE. Include capitalized state references, ACTIVITY_QUIT, actor exports/types, relative imports, and removal of unused offline placeholders.

- `packages/shared/src/machines/root.machine.ts`
- `packages/shared/src/machines/quizzes/normal.machine.ts`
- `packages/shared/src/machines/quizzes/actions.ts`
- `packages/shared/src/machines/quizzes/index.ts`
- `packages/shared/src/machines/index.ts`
- Rename `packages/shared/src/machines/questions/normal.ts` to `packages/shared/src/machines/questions/normal.machine.ts`, including its logic changes.
- `packages/shared/src/machines/questions/index.ts`
- Delete `packages/shared/src/machines/quizzes/offline/actions.ts` and `solo-quiz.machine.ts`.
- `packages/shared/src/types/machine.ts`
- `packages/shared/src/types/index.ts`
- `packages/shared/src/types/score.ts`
- `packages/shared/src/logic/answer-checker.ts` (type-import path only)
- `packages/shared/src/logic/load-questions.ts` (import paths only)
- `packages/shared/src/score-config/default-score-config.ts` (type-import path only)

Depends on the existing repository code; no claim that every lifecycle edge case is resolved. Source changes and machine renames belong together so imports remain connected.

## 3. `test(shared): add machine lifecycle coverage`

Add Vitest configuration, a non-watch test command, and question/quiz/root/timer/summary tests.

- `packages/shared/package.json`
- `packages/shared/vitest.config.ts`
- `packages/shared/test/question.machine.test.ts`
- `packages/shared/test/quiz.machine.test.ts`
- `packages/shared/test/quiz-lifecycle.test.ts`
- `packages/shared/test/quiz-summary.machine.test.ts`
- `packages/shared/test/root.machine.test.ts`
- `packages/shared/test/timer.machine.test.ts`

Update stale test imports, actor inputs, nested question context, timing, and ACTIVITY_QUIT expectations to match the current machines. Production logic is unchanged. Unanswered questions currently retain the outcome `none`; this is recorded as a remaining issue.

## 4a. `feat(expo): connect quiz actor selectors and UI resources`

Add quiz actor access through hooks/provider, quiz content helpers, and the quiz content/types/styles foundation.

- `apps/expo-app/src/hooks/quiz.hook.ts`
- `apps/expo-app/src/hooks/content.hook.ts`
- `apps/expo-app/src/providers/quiz.provider.tsx`
- Quiz-only hunks in `lib/content/content.json` and `lib/content/types.ts`.
- The quiz style group and formatting-only hunks in `lib/styles/content.ts`.

## 4b. `feat(expo): add quiz progress and summary presentation`

Add quiz progress/score derivation, answer-block data helpers, progress and points displays, and the completion summary, with their tests.

- `apps/expo-app/src/quiz/answer-blocks.ts`
- `apps/expo-app/src/quiz/quiz-state.ts`
- `apps/expo-app/src/quiz/progress-bar.tsx`
- `apps/expo-app/src/quiz/points-display.tsx`
- `apps/expo-app/src/quiz/quiz-summary.tsx`
- `apps/expo-app/src/quiz/test/quiz-state.test.ts`
- `apps/expo-app/src/quiz/test/quiz-header.test.tsx`
- `apps/expo-app/src/quiz/test/quiz-summary.test.tsx`

## 4c. `feat(expo): compose quiz question cards and answer controls`

Connect question/answer cards, block input, quiz layout/registry, and static timer/microphone previews. Timer and microphone remain nonfunctional previews.

- `apps/expo-app/src/providers/blocks.provider.tsx`
- `apps/expo-app/src/lib/quiz-registry.ts`
- `apps/expo-app/src/quiz/question-section.tsx`
- `apps/expo-app/src/quiz/quiz-timer.tsx`
- `apps/expo-app/src/quiz/normal-quiz.tsx`
- `apps/expo-app/src/quiz/quiz-container.tsx`
- `apps/expo-app/src/quiz/index.ts`
- `apps/expo-app/src/quiz/test/question-section.test.tsx`

These subcommits depend on commit 2 and run in 4a, 4b, 4c order. Previously committed routes, block components, icons, and context are excluded.

## 5. `feat(expo): refresh quiz setup options and start controls`

Make difficulty/mode selection compact and reflect the real selected option. Add descriptions, labeled question counts, and primary start-button styling. Pass filtered questions, difficulty, length, and timed-mode selection when starting.

- `apps/expo-app/src/components/quiz-setup/difficulty-option.tsx`
- `apps/expo-app/src/components/quiz-setup/mode-option.tsx`
- `apps/expo-app/src/components/quiz-setup/questions.tsx`
- `apps/expo-app/src/components/quiz-setup/quiz-start-button.tsx`
- `apps/expo-app/src/components/quiz-setup/test/options.test.tsx`
- Setup-specific hunks in `apps/expo-app/src/lib/content/content.json`.
- Setup-specific hunks in `apps/expo-app/src/lib/content/types.ts`.
- `difficultyOption`, `modeOption`, and `quizSetup` style-group hunks in `apps/expo-app/src/lib/styles/content.ts`.

Depends on commits 2 and 4. Use hunk-level staging for the three shared content/style files; do not stage their complete contents in both commits.

## 6. `style(expo): refine shared button hover and press feedback`

Use neutral hover/pressed backgrounds and subtle web hover movement for outline, secondary, and ghost variants.

- `apps/expo-app/src/components/ui/button.tsx`

This affects reusable buttons throughout the app and stays separate from the quiz-specific styling.

## Checks actually run during this review

- Expo: `npm run test:run --workspace=@bq/expo-app -- --run` — 17 tests passed across five files.
- Shared: `npm run test:run --workspace=@bq/shared` — 20 passed, 15 failed; two suites failed at import. Stale machine imports/exports are a primary cause.
- Root: `npm run test` — four server suites failed on unresolved `@bq/shared/services`, `@/redis`, and `@/redis/key-setter` imports; no server tests executed.
- `git diff --check` — trailing whitespace in root.machine.ts and an extra EOF blank line in types/score.ts. No fixes made during this review.
- Git index was empty at the start of this review. It remains unchanged.
- No fresh TypeScript, device, or browser verification in this review. Passing Expo tests do not establish that intermediate commits compile independently.

## Approval and execution

The user approved committing all groups after splitting group 4. Stage and inspect each group separately, then commit in order. Content/style hunks are split between quiz resources and setup changes without changing working-tree files.

Include this plan and the task log in the final `chore(agent): add agent log` commit, then push the working branch as required by project instructions.

## Execution results

All approved source/test groups were committed; group 4 became three subcommits:

- `92acf4d` feat(shared): add random word selection helpers
- `d75a4ad` feat(shared): implement normal quiz lifecycle and actor types
- `6e3ce5b` test(shared): add machine lifecycle coverage
- `e1471d2` feat(expo): connect quiz actor selectors and UI resources
- `535dacd` feat(expo): add quiz progress and summary presentation
- `0a499ac` feat(expo): compose quiz question cards and answer controls
- `7ed7405` feat(expo): refresh quiz setup options and start controls
- `bccfb66` style(expo): refine shared button hover and press feedback

Fresh checks during execution:

- Shared: 47 tests passed across six files after updating stale test imports and expectations.
- Expo: 17 tests passed across five files.
- Root `npm run test`: four server suites still fail before running tests on unresolved `@bq/shared/services`, `@/redis`, and `@/redis/key-setter` imports.
- Full and staged partial content JSON parsed successfully.
- Staged whitespace checks found existing whitespace in the question/root machines, score type EOF, and question-section.tsx. Those source edits were preserved.
- No fresh TypeScript or device/browser checks during this commit task.

Remaining behavior: unanswered quiz questions currently keep state `none`; the tests reflect that behavior without modifying production logic. Timer and microphone remain previews.

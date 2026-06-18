---
name: implement-issue
description: Use this skill to implement a user story based on a GitHub issue reference.
---

Use this skill to implement a user story based on a GitHub issue reference.
Make sure to follow the workflow defined below to implement the issue.

This is the standing contract for any coding agent assigned an issue.

The issue is the **single source of truth**. Do not implement behaviour that is not
specified, and do not work outside the declared scope.

## 0. Work on a feature branch

Never commit to the default branch. Before writing any code, create a branch whose prefix
matches the kind of work:

- `feat/<task-name>` — a feature or task
- `fix/<bug-name>` — a bug fix
- `chore/<chore-name>` — maintenance, dependencies, tooling
- `docs/<improvement-name>` - improvement to docs

Use a short kebab-case name derived from the issue title (e.g. `task/parcel-bay-lookup`).
All commits for the issue live on this branch; the PR merges it into the default branch.

## 1. Implement from the spec

1. Read **Context & goal**, then treat each **Functional requirement** as a unit of work.
2. Match **Interfaces & contracts** exactly — signatures, routes, and schemas are literal.
3. Stay inside **In scope**; never touch anything in **Out of scope**.
4. Obey every line in **Technical constraints & pointers**, including prohibitions
   (e.g. "no new dependencies"). Imitate the referenced existing code rather than
   inventing new patterns.
5. Implement each requirement using **red-green-refactor**:
   - **Red** — write a failing test that pins the requirement before writing any production code.
   - **Green** — write the minimum code needed to make that test pass.
   - **Refactor** — improve the design with the test suite green; never refactor on red.
     Commit at each green so the history shows the cycle, and never write production code that no
     failing test demanded.

### Code-writing ladder

When the green step needs new code, walk these rungs top to bottom and apply the **last** one
that matches. Each rung is only reached when the one above it didn't resolve the need.

1. **Don't.** Confirm the code is actually needed. If not, leave it out.
2. **Platform built-in.** If it is needed, check whether Node or Next.js already provides it — use that.
3. **Existing dependency.** Otherwise, check the project's current dependencies and call a function from one.
4. **New dependency.** If none fits, find a suitable package on the npm registry and use it.
5. **Write it yourself.** Only when none of the above apply, write the code by hand.

## 2. Self-validate before marking the PR ready

The **Acceptance criteria** checklist is the gate. The PR may only be marked ready when:

- Every functional requirement has at least one automated test that exercises it.
- Every box in the acceptance checklist is genuinely checked (build, lint, test, no secrets, docs).
- You restate the requirement → test mapping in the PR description (one line per requirement).

If any box cannot be checked, the PR is not ready — fix it, or flag the blocker in the issue.

## 3. Run a code review

Before marking the PR ready, run the `/code-review` skill over your own diff and resolve its
findings. This is a required gate, not advisory — do not mark the PR ready while findings are open.

Review-tier assignment is handled separately by a script; do not compute it here.

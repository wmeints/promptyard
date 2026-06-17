---
name: pr-create
description: Open a pull request from the changes on the branch you are currently working on, with a properly structured description and a computed review-tier assessment. Use this whenever the user says "open a PR", "create a pull request", "raise a PR for this", "ship this branch", or finishes a piece of work and wants it submitted for review. The skill inspects the branch diff and provides the required LLM escalation signal in the PR body marker. GitHub Actions computes and enforces the deterministic final tier, label, and reviewer requirement. Prefer this over a bare `gh pr create` so the description and tier metadata are never skipped.
---

# Create a Pull Request

Open a PR from the current working branch with a description that lets a reviewer
decide _how_ to engage before reading a line of the diff. The description carries
a **computed review tier** so high-impact changes can't slip through as if they
were trivial.

This skill authors PRs. Final tiering is computed and enforced in CI from one
`risk-rules.yml` source of truth.

## Honesty rule (read first)

The "Proof it works" section must reflect what you **actually did**. If you did not
run the tests, do not check the tests box — run them, or leave it unchecked and say
so. A PR description that claims passing tests that were never run is worse than no
description: it launders unverified work past the reviewer. The whole point of the
tier is to be trustworthy.

## Workflow

### 1. Establish branch and base

Confirm the current branch and the base it targets:

```bash
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true   # upstream, if set
gh repo view --json defaultBranchRef -q .defaultBranchRef.name             # default base
```

Pick the base (usually the default branch, e.g. `main`/`develop`) unless the user
specified one. Do not proceed on a detached HEAD or on the base branch itself.

### 2. Make sure work is committed and pushed

```bash
git status --porcelain          # must be clean; if not, surface it to the user before continuing
git log --oneline <base>..HEAD  # the commits that will form the PR
git push -u origin HEAD         # push the branch
```

If there are uncommitted changes, stop and ask the user whether to commit them —
don't silently leave work out of the PR or commit on their behalf without asking.

### 3. Get the diff

```bash
git diff <base>...HEAD --stat
git diff <base>...HEAD
```

This is the input to the CI tier computation and the "What" summary.

### 4. Run the verification you intend to claim

Before writing "Proof it works", actually run the project's checks (tests, lint,
type-check) if they exist and are runnable. Capture the exact commands and results
— they go verbatim into the body. If something can't be run, say why rather than
guessing the outcome.

### 5. Provide LLM escalation signal

Choose exactly one LLM escalation value:
`NONE`, `T1`, `T2`, or `T3`.
This value is advisory and can only escalate upward in CI.

Add this machine-readable marker to the PR body (for CI enforcement):

```md
<!-- llm_escalation: NONE|T1|T2|T3 -->
```

Use the exact value you selected. GitHub Actions then computes final tier
deterministically from trusted scripts and enforces canonical `review:T*`
labels and reviewer requirements.

| Tier                        | Required                | Trigger                                                                  |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| T1 — Agent-only             | agent review sufficient | low impact, low complexity, reversible                                   |
| T2 — Agent + human approval | named human signs off   | touches a quality goal, or high complexity                               |
| T3 — Line-by-line           | full human walkthrough  | data integrity, destructive change, or high complexity on a quality goal |

(If gates are failing — tests red, security scan failing — that's **T0**: don't open
the PR as ready; open as draft or fix first.)

### 6. Fill the body template

Use `assets/pr-body-template.md`. Fill every section from real data:

- **Why / What** — from the linked issue and the diff, in your own words.
- **Proof it works** — only the boxes you actually verified, with the commands.
- **AI role** — honest split of agent-generated vs hand-written.
- **Review tier input** — include the chosen `llm_escalation` value.
- **Quality goals touched** — checked from the rules that fired.
- **Rollback plan** — required if T3 or destructive.
- **Review focus** — the 1–2 areas you most want human eyes on.

### 7. Create the PR

Write the filled body to a temp file and create the PR. Set draft status for T0 or
when checks are red.

```bash
gh pr create \
  --base "<base>" \
  --head "$(git branch --show-current)" \
  --title "<type>(<scope>): <concise summary>" \
  --body-file /tmp/pr-body.md \
  ${REVIEWER:+--reviewer "$REVIEWER"} \
  ${DRAFT:+--draft}
```

CI enforcement will set/sync the canonical `review:T1/T2/T3` label and fail if
required reviewer conditions are not met.

### 8. Report back

Print the PR URL and a one-line tier summary, e.g.
`Opened #142 — T2 (auth rule fired on src/middleware/auth.ts); requested review from @erik`.

## Customizing

Tier rules are project-specific. The bundled `assets/risk-rules.example.yml`
encodes four common quality goals (authorization, authentication, performance,
data integrity); edit the committed `risk-rules.yml` to match the repo's real auth
layer, migration directory, and hot paths. Keep it identical to what the review
side reads so authoring and reviewing agree.

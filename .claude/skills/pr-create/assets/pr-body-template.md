## Why
<!-- The problem/intent in 1-2 sentences. Link the issue. If you can't state why, the change isn't ready to review. -->

Closes #

## What
<!-- Summary of the change and key technical decisions. Not a restatement of the diff. -->

## Proof it works
<!-- Don't promise, show. -->

- [ ] Tests added/updated and passing
- [ ] Manually verified (steps / screenshots / logs below)
- [ ] No new lint or type errors

## AI role
<!-- Which parts were agent-generated vs hand-written. Be specific about the high-impact parts. -->

- [ ] Fully hand-written
- [ ] Agent-assisted (mixed)
- [ ] Agent-generated, human-verified

---

## Risk routing

### 1. Quality goals touched
<!-- Check every box that applies. These set the MINIMUM review tier — the author cannot route below them. -->

- [ ] **Authorization** — content ownership / access scoping (OpenFGA model or tuples, row-level checks) → min tier: **Human approval**, never agent-only
- [ ] **Authentication** — auth middleware, route guards, session/token handling → min tier: **Human approval**, never agent-only
- [ ] **Performance** — hot-path queries, new sync I/O, N+1 risk, caching (p95 < 250ms) → min tier: **Human approval** + perf note
- [ ] **Data integrity** — migration files, schema changes, backfills → min tier: **Line-by-line** + rollback plan
- [ ] None of the above

### 2. Blast radius
<!-- Separate from complexity. A trivially simple but irreversible change still escalates. -->

- [ ] Reversible (revert + redeploy fully recovers)
- [ ] Hard to reverse / destructive (data migration, irreversible side effects) → escalate to **Line-by-line**

### 3. Complexity
<!-- Complexity can only RAISE the tier set by the boxes above, never lower it. -->

- [ ] Low — small, local, well-patterned diff
- [ ] High — non-local reasoning, novel logic, cross-cutting change → escalate one tier

### 4. Computed review tier
<!-- Take the highest tier triggered by sections 1-3. -->

- [ ] **T0 — Auto-blocked** — failing gates (tests / security scan / coverage). Not ready for review.
- [ ] **T1 — Agent-only** — low impact, low complexity, reversible. No quality goal touched. Agent review is sufficient.
- [ ] **T2 — Agent + human approval** — touches a quality goal OR high complexity. Named human signs off after agent review.
- [ ] **T3 — Line-by-line** — data integrity, destructive/irreversible change, or high complexity on a quality goal. Full human walkthrough.

### Rollback plan
<!-- Required for T3 and any destructive change. How do we recover if this is wrong in prod? -->

## Review focus
<!-- The 1-2 areas where you specifically want human eyes. Respect the reviewer's time. -->

---

<!--
Routing principle: impact (section 1) sets the floor, complexity (section 3) and blast radius (section 2)
can only escalate. The tier should be derived from path/diff rules outside the reviewing agent's
discretion — the agent may escalate, never downgrade itself.
-->

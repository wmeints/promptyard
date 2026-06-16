# Commit guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for every commit in this
repository. On top of the base specification, we enforce the additional rules below. These rules
are validated automatically through [commitlint](../../commitlint.config.mjs); a commit that breaks
them is rejected.

## Allowed commit types

We only allow the following commit types:

- `feat` — a new feature for users.
- `fix` — a bug fix for users.
- `docs` — a change to documentation only.
- `chore` — work that adds no direct user value but still has to be done (see below).

Any other Conventional Commits type (`refactor`, `style`, `perf`, `test`, `ci`, `build`, etc.) is
**not** allowed.

### When to use `chore`

Anything related to the following is considered a `chore`. It adds no value on its own, but the work
must be done:

- Build files and tooling configuration.
- Claude settings, skills, and agents.
- Global configuration.

A `chore` does not need a scope, because this kind of work usually does not belong to a single
product domain.

## Allowed commit scopes

When a commit targets a specific product domain, use one of the following scopes:

- `authn` — authentication.
- `authz` — authorization.
- `content` — prompt/skill/agent content management.
- `search` — search and discovery.

No other scope is allowed. The scope is optional: omit it when the change does not belong to one of
these domains (for example, most `chore` commits).

## Examples

```text
feat(authn): add GitHub OAuth login
fix(search): correct ranking for exact title matches
docs: document the commit guidelines
chore: bump commitlint to the latest version
```

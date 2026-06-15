## Project structure

This is a monorepo structure with the following key locations:

- `docs/architecture`: contains the architecture docs for everything in this repo.
- `docs/product`: contains product requirements for everything in this repo.
- `docs/engineering`: contains engineering process descriptions for this repo.

- `packages/*`: stores reusable packages that can be shared between apps
- `apps/*`: stores code related to individually distributed executables

### Executables in the repository

- `apps/website`: the main website that we deploy to vercel
- `apps/cli`: the client executable that developers use to install skills and agents

### Libraries in the repository

None.

## Review checklist

- Run `pnpm lint` for each package and/or application you've modified and ensure issues are fixed.
- Run `pnpm test` for each package and/or application you've modified and ensure issues are fixed.
- Run `pnpm build` for each package and/or application you've modified and ensure issues are fixed.

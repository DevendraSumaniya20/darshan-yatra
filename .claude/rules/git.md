# Git

## Commits

- Commit only when asked.
- The author is the repository owner. Never add `Co-Authored-By` trailers, "Generated with" lines, or any mention of an AI tool in commit messages, PR titles, or PR descriptions.
- Conventional Commits: `type(scope): summary`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`.
  - Scopes: `backend`, `frontend`, `db`, `rules`, or a feature name such as `yatras`.
  - Summary in the imperative, lower case, no full stop, 72 characters or fewer.
- The body explains why the change was made when the summary is not enough.
- One logical change per commit. Schema migrations are committed with the code that needs them.

## Branches

- `main` stays releasable. Work happens on `feat/<topic>`, `fix/<topic>`, or `chore/<topic>`.
- Rebase onto `main` before opening a PR. No merge commits inside feature branches.

## Never commit

- `.env` files, credentials, database dumps.
- `node_modules/`, `dist/`, `backend/generated/`.
- Editor settings and OS files.

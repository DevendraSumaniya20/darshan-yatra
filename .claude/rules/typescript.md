# TypeScript

- `strict` is on in both apps, with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` in the backend.
- No `any`. Use `unknown` at boundaries and narrow it. No non-null `!` and no `as` casts except at a parsed boundary.
- No `enum`; use a union of string literals or an `as const` object.
- Prefer `type` for data shapes and `interface` for ports that classes implement.
- Exported functions have explicit return types.
- Named exports only. No default exports except where a tool requires one.
- Model absence with `null` in domain and API types. `undefined` means "not provided".
- Identifiers and money get branded or wrapper types in the domain, not bare `string` and `number`.
- Files: `kebab-case.ts` in the backend, `PascalCase.tsx` for React components, `camelCase.ts` for hooks and helpers.
- Comments explain why, not what. No commented-out code.
- No dead code, no speculative abstractions. Write the second implementation before extracting an interface, except for architectural ports.

---
paths:
  - "backend/**"
---

# Backend

## HTTP API

- Base path `/api/v1`. Resource names are plural nouns in kebab-case.
- Success responses: `{ "data": ... }`. Lists add `"meta": { "total", "page", "pageSize" }`.
- Error responses: `{ "error": { "code", "message", "details?" } }`. `code` is a stable SCREAMING_SNAKE string clients can switch on.
- Status codes: 200 read, 201 create, 400 validation, 404 not found, 409 business conflict, 500 unexpected.
- Never leak stack traces, SQL, or Prisma error text to clients.

## Validation

- Every request body, query, and params object is parsed with a Zod schema in `presentation/http/schemas/` before a use case sees it.
- Zod types stop at the controller. Use cases take plain DTO types defined in `application/`.
- Invariants are also enforced in the domain. Validation at the edge is for good error messages, not for safety.

## Errors

- Throw subclasses of `DomainError` from domain and application code. Each carries a `code`.
- One error-handling middleware maps `DomainError` subclasses to status codes. Controllers do not catch.
- Unknown errors are logged with the request id and returned as `INTERNAL_ERROR`.

## Prisma

- The schema is the source of truth for storage, not for the domain model. Entities are written by hand.
- Schema changes go through `prisma migrate dev` with a descriptive name. Never edit an applied migration.
- Money is stored as integer minor units (paise) with the column suffix `Paise`. No floats for money.
- Dates that are calendar days (departures) are stored as `DATE`, timestamps as `DATETIME(3)` in UTC.
- Use `select` or explicit `include`. No unbounded `findMany` on user-facing endpoints; always paginate.
- The generated client lives in `backend/generated/prisma` and is not committed.

## Configuration

- `process.env` is read in exactly one file, `infrastructure/config/env.ts`, validated with Zod at startup. The process exits with a clear message if a variable is missing.
- When a new variable is added, add it to `.env.example` in the same change.

## Tests

- Use cases are tested with in-memory repositories. No database, no HTTP.
- Entities with rules get their own tests.
- Test names state behaviour: `rejects a booking when seats are exhausted`.

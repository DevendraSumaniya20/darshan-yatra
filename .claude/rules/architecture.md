# Architecture

Both apps follow Clean Architecture. Source dependencies point inward only.

```
presentation  ->  application  ->  domain
infrastructure ->  application  ->  domain
main (composition root) wires everything
```

## Backend layers (`backend/src/`)

| Layer | Folder | Holds | May import |
|---|---|---|---|
| Domain | `domain/` | Entities, value objects, domain errors, repository interfaces (ports) | nothing outside `domain/` |
| Application | `application/` | Use cases, input/output DTOs | `domain/` |
| Infrastructure | `infrastructure/` | Prisma repositories, in-memory repositories, config, clock, id generation | `application/`, `domain/` |
| Presentation | `presentation/http/` | Express routers, controllers, Zod request schemas, response mappers, middleware | `application/`, `domain/` |
| Main | `main/` | Dependency container, app factory, server bootstrap | everything |

Rules:

- `domain/` and `application/` never import Express, Prisma, Zod, `process.env`, or anything from `infrastructure/` or `presentation/`.
- A use case is one class with one public `execute` method. It receives its ports through the constructor.
- Controllers do three things: parse the request, call one use case, map the result. No business rules.
- Repositories return domain entities, never Prisma rows. Mapping lives next to the repository.
- Business rules that involve a single entity live on the entity. Rules that span entities live in a use case.
- Every port has an in-memory implementation used by tests and by local runs without a database.
- New objects are created only in `main/container.ts`. Nothing else calls `new` on a repository or use case.

## Frontend layers (`frontend/src/`)

| Folder | Holds | May import |
|---|---|---|
| `app/` | Root component, router, providers | everything |
| `features/<name>/` | One vertical slice: `model/` (types, pure logic), `api/` (gateway), `ui/` (components, pages) | `shared/`, its own folders |
| `shared/` | `ui/` primitives, `lib/` helpers, `styles/` tokens | nothing outside `shared/` |

Rules:

- Features do not import from other features. Shared needs move to `shared/`.
- `model/` is plain TypeScript: no React, no `fetch`.
- Components never call `fetch` directly. They use the feature's gateway through a hook.
- The API response shape is mapped to the feature's model types at the gateway boundary.

## Adding a feature

1. Domain: entity and port.
2. Application: use case with a unit test against the in-memory port.
3. Infrastructure: Prisma repository and in-memory repository.
4. Presentation: schema, controller, route.
5. Wire it in `main/container.ts`.
6. Frontend: model types, gateway, hook, UI.

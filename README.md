# Darshan Yatra

Group pilgrimage tours on fixed dates. Travellers see each departure's date, seats left and price per person, read the day-by-day plan, and send a booking request that holds their seats.

- `backend/` — Express + Prisma (MariaDB) API in TypeScript, Clean Architecture
- `frontend/` — React + Vite site in TypeScript

## Run it locally

Two terminals:

```
cd backend
npm install
npm run db:generate
DATA_SOURCE=memory npm run dev      # API on http://localhost:5000
```

```
cd frontend
npm install
npm run dev                         # site on http://localhost:5173
```

`DATA_SOURCE=memory` serves the sample catalogue from memory, so no database is needed. Bookings made this way are lost when the API restarts.

## Use MariaDB

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.
2. `npx prisma migrate deploy` to create the tables.
3. `npm run db:seed` to load the sample catalogue.
4. `npm run dev`.

## Checks

| Where | Command |
|---|---|
| `backend/` | `npm run typecheck`, `npm test`, `npm run build` |
| `frontend/` | `npm run build`, `npm run lint` |

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/yatras` | List with `circuit`, `startCity`, `difficulty`, `maxDays`, `month`, `page`, `pageSize` |
| GET | `/api/v1/yatras/:slug` | One yatra with itinerary and upcoming departures |
| GET | `/api/v1/start-cities` | Cities yatras leave from |
| POST | `/api/v1/booking-requests` | Hold seats on a departure |
| GET | `/api/v1/health` | Liveness |

## Project documents

- `CLAUDE.md` and `.claude/rules/` — architecture, code, design and git rules
- `PRODUCT.md` — who the product is for and what it does
- `DESIGN.md` — the visual system

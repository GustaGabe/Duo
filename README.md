# Duo

A shared money manager for the people who split a life. Every entry carries the name of whoever
paid, so a household — or a trip, or a flatshare — sees one balance and each person's slice of it,
and the month settles without a spreadsheet.

The product is built around **spaces**: a person belongs to many, and each holds up to four people
with their own entries, categories and settlement. The same people can appear in several spaces
with a different colour in each.

---

## Stack

| | |
|---|---|
| **Web** | React 19 · Vite 7 · TanStack Router · TanStack Query · Tailwind v4 · tailwind-variants |
| **API** | NestJS 11 · TypeORM · PostgreSQL 17 · JWT in httpOnly cookies · bcryptjs |
| **Shared** | `@duo/shared` — domain types both sides compile against |
| **Tooling** | pnpm workspaces · TypeScript strict · oxlint + ESLint · Docker Compose |

Requires Node 20+ and pnpm 11.

---

## Layout

```
apps/web          React app — screens, components, data hooks
apps/api          NestJS API — one folder per bounded context
packages/shared   domain types, imported by both
```

---

## Running it

### 1. Environment

```bash
cp .env.example .env
```

Fill in the two JWT secrets — the API refuses to start without them:

```bash
openssl rand -hex 32   # once for JWT_ACCESS_SECRET
openssl rand -hex 32   # again for JWT_REFRESH_SECRET
```

`apps/api/.env` holds the API's own copy while developing:

```
DATABASE_URL=postgresql://duo:<password>@localhost:5432/duo
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
PORT=3000
```

### 2. Database

```bash
docker compose up -d postgres
```

Postgres binds to `127.0.0.1` only. Migrations run automatically when the API boots.

### 3. Development

```bash
pnpm install
pnpm --filter api start:dev     # http://localhost:3000
pnpm --filter @duo/web dev      # http://localhost:5173
```

Vite proxies `/api` to the API, so the browser sees a single origin and the session cookie is
first-party — no CORS involved.

### 4. Checks

```bash
pnpm typecheck      # tsc --noEmit across every package
pnpm lint           # oxlint, then ESLint for the project guards
pnpm build          # production build
```

---

## Deploying

The compose file *is* the deployment — three services, no separate development stack.

```bash
docker compose up -d --build
```

| Service | Notes |
|---|---|
| `postgres` | named volume, healthcheck, bound to loopback |
| `api` | multi-stage image, runs as a non-root user, publishes nothing |
| `web` | nginx serving the built assets, proxying `/api` over the internal network |

The API is reachable only through nginx. Credentials are interpolated as `${VAR:?}`, so a missing
`.env` fails the deploy instead of starting with an empty password.

Put a TLS terminator (Caddy, Traefik) in front of `web` in production.

---

## API

Every route requires a session except sign-up, sign-in and refresh. Anything scoped to a space is
also behind a membership check — being signed in is not enough to read someone else's space.

| Method | Route | |
|---|---|---|
| `POST` | `/auth/sign-up` | creates the account and a personal space |
| `POST` | `/auth/sign-in` | |
| `POST` | `/auth/refresh` | rotates the refresh token |
| `POST` | `/auth/sign-out` | |
| `GET` | `/auth/me` | the current session |
| `GET` `POST` | `/spaces` | |
| `POST` | `/spaces/join` | join with a `DUO-XXXX` code |
| `GET` `PATCH` | `/spaces/:id` | |
| `POST` | `/spaces/:id/invites` | |
| `DELETE` | `/spaces/:id/members/:userId` | owner only |
| `DELETE` | `/spaces/:id/members/me` | leave |
| `GET` `POST` | `/categories?spaceId=` | |
| `PATCH` `DELETE` | `/categories/:id?spaceId=` | |
| `GET` `POST` | `/transactions?spaceId=` | filters: `month`, `ownerId`, `kind`, `categoryId`, `limit` |
| `GET` `PATCH` `DELETE` | `/transactions/:id` | |
| `GET` | `/summary?spaceId=&month=` | balance, per-person split, per-category, settlements |

### Sessions

Two `httpOnly` cookies — a 15-minute access token and a 7-day refresh — so no script on the page can
read the session. Only the refresh token's SHA-256 hash reaches the database.

Refresh tokens rotate: each use revokes the token it consumed. Replaying a revoked token is treated
as theft and drops every session for that user.

### Settlement

An entry marked as split is divided by the number of members. Each person's net is what they paid
minus their share; creditors are then matched against debtors largest first, which clears every
balance in the fewest transfers. A space of four can settle in three.

Money is an integer number of cents from the database to the screen. No floats anywhere near a
division.

---

## Conventions

`CLAUDE.md` is the working agreement, and it is worth reading before the first pull request. The
short version:

1. **One flexible component, not a family of near-duplicates.** Variants come from
   `tailwind-variants` at the top of the file. There is exactly one `Modal` in the project.
2. **Semantic tokens only.** Literal hex outside `globals.css` fails lint. Dark mode swaps tokens,
   so components never need a `dark:` class.
3. **Data flows component → hook → `src/api`.** A component never calls `fetch` or reaches into the
   API layer directly.
4. **Every backend module has the same shape** — `domain / application / http / infrastructure`,
   with dependencies pointing inward and the repository as an abstract class doubling as the DI
   token.
5. **The auth token lives in a cookie, never in `localStorage`.**

Code, comments and commits are in English. Everything a user reads on screen is Brazilian
Portuguese.

---

## Status

Working: authentication, spaces with members and invites, categories, transactions, the month
summary and settlement, light and dark themes, mobile and desktop.

**Goals** is deliberately a work in progress and **Reports** is a placeholder — neither has a design
yet. Social login, password recovery and invite e-mail delivery are not built.

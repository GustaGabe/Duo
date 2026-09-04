# Duo — project guide

A money manager **for couples**. Every entry has an owner: the couple sees one shared total plus
each person's slice. pnpm monorepo with `apps/web` (Vite + React) and, later, `apps/api`
(NestJS + PostgreSQL).

The visual language comes from a finished design (Claude Design, `Duo Financas.dc.html`).
**Don't invent new styling.** If something isn't in the design, compose it from the tokens and
primitives that already exist.

---

## Layout

```
apps/web          React app (Vite + TanStack Router)
apps/api          NestJS + PostgreSQL — not created yet
packages/shared   pure domain types shared by both sides (@duo/shared)
```

### Commands (run from the repo root)

| Command | What it does |
|---|---|
| `pnpm install` | install everything |
| `pnpm dev` | serve the web app on http://localhost:5173 |
| `pnpm build` | production build |
| `pnpm typecheck` | `tsc --noEmit` across all packages |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

`pnpm typecheck && pnpm lint && pnpm build` must be green before every commit.

---

## Rule 1 — build one flexible component, not a family of near-duplicates

This is the principle the whole codebase is organised around. When two screens need almost the same
thing, that is **one component with a variant**, not two components. Variants come from a lookup map
at the top of the file, not from `if` branches scattered through JSX.

Before writing any component, look for it in `src/components/ui/` (generic) or
`src/components/finance/` (domain). If something close already exists, extend it.

```
components/ui/        primitives with no domain knowledge (Button, Field, Chip, Switch, Progress…)
components/modal/     the modal system
components/layout/    Sidebar, BottomNav, TopBar, PageHeader
components/finance/   domain pieces (TransactionItem, BalanceHero, CategoryRow, AmountKeypad…)
modals/               modal content only
routes/               pages (file-based routing)
```

### Worked example: the modal

The modal is the sharpest illustration of Rule 1, and the reference to copy when you are unsure how
far to push reuse.

There is no "expense modal", "category modal", "confirm modal". There is **one** component that
draws overlay and panel, and it adapts along two axes: sheet on mobile → centred dialog from `md` up,
in four sizes, with an optional side column. That is how "new expense" can be a full-height sheet on
a phone and a 720px two-column dialog on desktop while being the same component and the same content.

```
src/components/modal/modal-shell.tsx     the app's only overlay + panel
src/components/modal/modal-registry.ts   key -> content, size, title
src/components/modal/modal-store.ts      which modal is open
src/components/modal/use-modal.ts        typed open/close API
src/components/modal/modal-root.tsx      mounted once in __root.tsx
```

Open one from anywhere:

```tsx
const { open } = useModal();
open('transaction-form', { kind: 'expense' });
```

Add a new one:

1. Write **only the content** in `src/modals/`. No overlay, no `<dialog>`, no `position: fixed`,
   no close button — the shell provides all of it. The component receives its props plus `close`.
2. Register it in `modal-registry.ts` with a key, a size and a title.
3. Done — `open('your-key', { … })` is now typed.

Never drive a modal with `useState`. ESLint blocks `createPortal`, `<dialog>` and
`role="dialog"` outside `components/modal/`; if you are fighting that rule, the fix is a new variant
on `ModalShell`, not a way around it.

Do not install Radix, Headless UI, shadcn/ui or any modal library.

---

## Rule 2 — semantic tokens only

Colors, radii, shadows and fonts live in `apps/web/src/styles/globals.css`, inside the Tailwind v4
`@theme` block. Components use **only** the semantic classes:

| Use | Not |
|---|---|
| `bg-surface`, `bg-surface-2`, `bg-surface-3` | `bg-white`, `bg-[#F4F4F6]` |
| `text-ink`, `text-muted`, `text-subtle` | `text-black`, `text-[#6B6B73]` |
| `border-line` | `border-[#E4E4E9]` |
| `bg-accent`, `text-accent` | `bg-blue-600`, `bg-[#1B1FE5]` |
| `bg-owner-a` / `bg-owner-b` | picking blue/black by hand for Ana/Léo |
| `rounded-field`, `rounded-card`, `rounded-pill` | `rounded-[14px]` |
| `shadow-float` | `shadow-[0_30px_60px_…]` |

Literal hex is **banned** outside `globals.css` (ESLint enforces it). If a token is missing, add the
token — don't escape the system.

### Owner colour

Ana is slot `a`, Léo is slot `b`. This isn't decoration: in dark mode slot `b`'s black becomes white.
Always go through `bg-owner-a` / `bg-owner-b` or the helpers in `src/lib/owner.ts`.

### Dark mode

Toggled by `data-theme="dark"` on `<html>`, persisted in `localStorage`, defaults to the system
preference. Semantic tokens swap themselves — a component written with tokens needs **no** `dark:`
classes at all. Writing `dark:` usually means a primitive token slipped in by mistake.

---

## Rule 3 — data only through hooks

```
component  →  hooks/use-*.ts (TanStack Query)  →  api/*.ts  →  api/mock-db.ts
```

A component **never** imports from `src/api/` directly. Reads are queries, writes are mutations that
invalidate the affected queries.

Today `src/api/*` returns data from an in-memory store with simulated latency. When the NestJS API
lands, only the bodies of those functions change to `fetch` — hooks, components and screens don't
move. That is the entire reason the layer exists.

Money is **always an integer in cents** (`amountCents`) from the domain to the edge. Format only at
render time, with `formatBRL` from `src/lib/format.ts`.

---

## Conventions

- **Files** kebab-case (`transaction-item.tsx`). **Components** PascalCase.
- **Mobile-first**: write the base style for 390px and scale up with `md:` / `lg:`, never the reverse.
- **Strict TypeScript**: no `any`, no `@ts-ignore`. Domain types come from `@duo/shared`.
- **Language**: code, comments, docs and commit messages in English. Everything the user reads on
  screen is Brazilian Portuguese (pt-BR) — it's a Brazilian product.
- **44px minimum touch target** on anything tappable; it's in the design system.
- **Accessibility**: every control has an accessible name; selected state uses `aria-pressed` or
  `aria-current`, not colour alone.

### Commits

One commit per shipped feature, Conventional Commits with a scope:

```
feat(web): couple dashboard (mobile and desktop)
fix(web): keep focus on the amount field while using the keypad
chore: monorepo layout and tooling
```

---

## Out of scope right now

`apps/api`, real authentication, persistence and automated tests. The **Relatórios** and **Metas**
screens are placeholders — they have no artboard in the design. Don't expand them without one.

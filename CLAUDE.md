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
| `pnpm lint` | oxlint, then ESLint for the project guards |
| `pnpm format` | Prettier |

`pnpm typecheck && pnpm lint && pnpm build` must be green before every commit.

---

## Rule 1 — build one flexible component, not a family of near-duplicates

This is the principle the whole codebase is organised around. When two screens need almost the same
thing, that is **one component with props**, not two components. Variants are declared with
`tailwind-variants` at the top of the file, never as `if` branches scattered through JSX:

```tsx
import { tv, type VariantProps } from '@/lib/tv';

export const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center …',
  variants: {
    variant: { primary: 'bg-primary text-on-primary …', action: 'bg-accent …' },
    size: { lg: 'h-15 rounded-panel …', md: 'h-13 rounded-field …' },
    block: { true: 'w-full' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ButtonVariants = VariantProps<typeof button>;
```

Always import `tv` from `@/lib/tv`, never from `tailwind-variants` directly — the local one is
configured to recognise this project's custom `text-*` size tokens. Without that config
`tailwind-merge` mistakes `text-body` for a colour and silently drops `text-on-primary`.
Multi-part components use `slots` (see `Modal`, `AmountDisplay`).

Before writing any component, look for it in `src/components/ui/` (generic) or
`src/components/finance/` (domain). If something close already exists, give it a prop.

```
components/ui/        primitives with no domain knowledge (Button, Field, Chip, Modal, Progress…)
components/layout/    Sidebar, BottomNav, TopBar, PageHeader
components/finance/   domain pieces (TransactionItem, BalanceHero, CategoryRow, AmountKeypad…)
routes/               pages (file-based routing)
```

### Worked example: the modal

There is exactly one modal in this project: `src/components/ui/modal.tsx`. It is not a modal system,
a registry or a store — it is a component with props and `children`, used like any other.

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Nova despesa" size="lg" footer={<Button block>Salvar</Button>}>
  {/* whatever this screen needs */}
</Modal>
```

Its props are what make it fit every case, so a second one is never needed:

| Prop | What it covers |
|---|---|
| `size` | `sm` / `md` / `lg` / `full` |
| `title`, `description` | the standard header |
| `hideHeader` | content that draws its own top |
| `footer` | pinned action bar |
| `children` | everything else |

It adapts on its own from a bottom sheet on mobile to a centred dialog from `md` up, and it is built
on the native `<dialog>`, so focus trap, Esc and the top layer come for free with no library.

If a new screen doesn't fit, add a prop here. Never build a second modal, and never install Radix,
Headless UI or shadcn/ui. ESLint blocks `createPortal`, `<dialog>` and `role="dialog"` everywhere
except that one file.

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
- **No comments in code.** Names, types and small functions carry the meaning. If a line needs a
  comment to be understood, rewrite the line. Documentation lives here, in CLAUDE.md.
- **Language**: everything in code is English — component names, variables, types, file names,
  route paths, docs and commit messages. The *only* Portuguese in the repo is text a user actually
  reads on screen, plus the seed content that stands in for it.
- **44px minimum touch target** on anything tappable; it's in the design system.
- **Accessibility**: every control has an accessible name; selected state uses `aria-pressed` or
  `aria-current`, not colour alone.

### Linting

`oxlint` is the main linter: fast, and it owns correctness, style and the import guards
(no `createPortal`, no reaching into `src/api/` from a component, no importing `clsx` /
`tailwind-merge` / `tailwind-variants` directly). Config lives in `apps/web/.oxlintrc.json`.

ESLint stays for the two guards oxlint cannot express, both of which need AST selectors: literal
hex colour anywhere outside `globals.css`, and modal chrome outside `components/ui/modal.tsx`.

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

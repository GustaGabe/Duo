# Duo — regras do projeto

Gerenciador de finanças **para casais**. Cada lançamento tem dono: o casal vê o total junto e a
fatia de cada um. Monorepo pnpm com `apps/web` (Vite + React) e, futuramente, `apps/api`
(NestJS + PostgreSQL).

O visual vem de um design pronto (Claude Design, `Duo Financas.dc.html`). **Não invente estilo novo**:
se algo não existe no design, componha com os tokens e primitivos que já existem.

---

## Estrutura

```
apps/web          app React (Vite + TanStack Router)
apps/api          NestJS + PostgreSQL — ainda não existe
packages/shared   tipos de domínio puros, usados pelos dois lados (@duo/shared)
```

### Comandos (rodar da raiz)

| Comando | O que faz |
|---|---|
| `pnpm install` | instala tudo |
| `pnpm dev` | sobe o web em http://localhost:5173 |
| `pnpm build` | build de produção do web |
| `pnpm typecheck` | `tsc --noEmit` em todos os pacotes |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

Antes de qualquer commit: `pnpm typecheck && pnpm lint && pnpm build` verdes.

---

## Regra 1 — existe UMA modal no projeto

Esta é a regra mais importante do repositório.

Não criamos "a modal de despesa", "a modal de categoria", "a modal de confirmação". Existe **um**
componente que desenha overlay e painel, e ele se molda a todos os casos: sheet no mobile, dialog
centralizado no desktop, com ou sem coluna lateral, em quatro tamanhos.

**Os únicos arquivos autorizados a desenhar chrome de modal:**

```
apps/web/src/components/modal/modal-shell.tsx     ← o ÚNICO overlay + painel do projeto
apps/web/src/components/modal/modal-registry.ts   ← chave → conteúdo
apps/web/src/components/modal/modal-store.ts      ← qual modal está aberta
apps/web/src/components/modal/use-modal.ts        ← API tipada de abrir/fechar
apps/web/src/components/modal/modal-root.tsx      ← montado uma vez no __root
```

### Como abrir uma modal

```tsx
const { open } = useModal();
open('transaction-form', { kind: 'expense' });
```

Nunca `const [aberto, setAberto] = useState(false)` para modal. Nunca renderizar conteúdo de modal
dentro de uma página.

### Como adicionar uma modal nova

1. Crie **só o conteúdo** em `apps/web/src/modals/nome-da-modal.tsx`. Sem overlay, sem `<dialog>`,
   sem `position: fixed`, sem botão de fechar — o shell já dá tudo isso. O componente recebe suas
   props mais `close`.
2. Registre em `modal-registry.ts` com a chave, o tamanho e o título.
3. Pronto. `open('sua-chave', { ...props })` já funciona e já é tipado.

### Proibido

- `createPortal`, `<dialog>`, `role="dialog"` ou overlay `fixed inset-0` fora de `components/modal/`.
  O ESLint bloqueia — se você está brigando com essa regra, a solução é estender o `ModalShell`,
  não contorná-lo.
- Instalar Radix, Headless UI, shadcn/ui ou qualquer biblioteca de modal.

---

## Regra 2 — só tokens semânticos

Todas as cores, raios, sombras e fontes vivem em `apps/web/src/styles/globals.css`, no bloco
`@theme` do Tailwind v4. Componentes usam **apenas** as classes semânticas:

| Use | Não use |
|---|---|
| `bg-surface`, `bg-surface-2`, `bg-surface-3` | `bg-white`, `bg-[#F4F4F6]` |
| `text-ink`, `text-muted`, `text-subtle` | `text-black`, `text-[#6B6B73]` |
| `border-line` | `border-[#E4E4E9]` |
| `bg-accent`, `text-accent` | `bg-blue-600`, `bg-[#1B1FE5]` |
| `bg-owner-a` / `bg-owner-b` | azul/preto no braço para Ana/Léo |
| `rounded-field`, `rounded-card`, `rounded-pill` | `rounded-[14px]` |
| `shadow-float` | `shadow-[0_30px_60px_...]` |

Hex literal e classes com colchetes (`bg-[#...]`, `text-[13px]` para cor) são **proibidos** fora de
`globals.css`. Se falta um token, adicione o token — não escape dele.

### Cor de dono

Ana é o slot `a`, Léo é o slot `b`. Isso não é decoração: no modo escuro o preto do slot `b` vira
branco. Sempre use `bg-owner-a` / `bg-owner-b` (ou o helper `ownerClasses(slot)`), nunca a cor direta.

### Modo escuro

Alternado por `data-theme="dark"` no `<html>`, persistido em `localStorage`, padrão = sistema.
Os tokens semânticos já trocam sozinhos — um componente escrito com tokens **não precisa** de nenhuma
classe `dark:`. Se você está escrevendo `dark:`, provavelmente usou um token primitivo por engano.

---

## Regra 3 — dados só via hook

```
componente  →  hooks/use-*.ts (TanStack Query)  →  api/*.ts  →  api/mock-db.ts
```

Um componente **nunca** importa de `src/api/` direto. Toda leitura é uma query, toda escrita é uma
mutation que invalida as queries afetadas.

Hoje `src/api/*` devolve dados de um banco em memória com latência simulada. Quando o NestJS existir,
troca-se o corpo dessas funções por `fetch` — hooks, componentes e telas não mudam nada. É por isso
que a camada existe.

Dinheiro é **sempre inteiro em centavos** (`amountCents`) do domínio até a borda. Formate só na hora
de exibir, com `formatBRL` de `src/lib/format.ts`.

---

## Regra 4 — componha, não duplique

Antes de escrever um botão, campo, chip, avatar, barra de progresso ou card: procure em
`src/components/ui/`. Antes de escrever qualquer coisa de finanças: procure em
`src/components/finance/`. Se o que existe quase serve, **adicione uma variante ao existente** em vez
de criar um irmão.

```
components/ui/        primitivos sem domínio (Button, Field, Chip, Switch, Progress…)
components/modal/     o sistema de modal única
components/layout/    Sidebar, BottomNav, TopBar, PageHeader
components/finance/   domínio (TransactionItem, BalanceHero, CategoryRow, AmountKeypad…)
modals/               só o conteúdo das modais
routes/               páginas (file-based routing)
```

Variantes de componente saem de um mapa de classes no topo do arquivo, não de `if` espalhado no JSX.

---

## Convenções

- **Arquivos** em kebab-case (`transaction-item.tsx`). **Componentes** em PascalCase.
- **Mobile-first**: escreva o estilo base para 390px e suba com `md:` / `lg:`. Nunca o contrário.
- **TypeScript estrito**: sem `any`, sem `@ts-ignore`. Tipos de domínio vêm de `@duo/shared`.
- **UI em português** (pt-BR) — é um produto brasileiro. Código, nomes de variáveis e commits
  técnicos em inglês; mensagens e comentários explicativos em português.
- **Alvo de toque mínimo 44px** em qualquer coisa clicável — está no design system.
- **Acessibilidade**: todo controle tem nome acessível; estado selecionado usa `aria-pressed` ou
  `aria-current`, não só cor.

### Commits

Um commit por feature entregue, Conventional Commits com escopo:

```
feat(web): painel do casal (mobile e desktop)
fix(web): corrige foco do campo de valor no teclado numérico
chore: estrutura do monorepo e tooling
```

---

## Fora de escopo agora

`apps/api`, autenticação real, persistência e testes automatizados. As telas de **Relatórios** e
**Metas** são placeholders — não têm artboard no design. Não as expanda sem design.

/**
 * Contratos de domínio do Duo.
 *
 * Este pacote é só tipos — nenhum runtime, nenhuma dependência. O `apps/web` usa hoje com dados
 * mock e o `apps/api` (NestJS) vai usar os mesmos tipos depois, para que os dois lados nunca
 * discordem sobre a forma dos dados.
 *
 * Valores monetários são SEMPRE inteiros em centavos (`…Cents`). Nunca `number` em reais, nunca
 * string formatada — a formatação é responsabilidade da camada de apresentação.
 */

/** Identificador opaco. */
export type Id = string;

/** Data no formato ISO `YYYY-MM-DD`. */
export type IsoDate = string;

/** Mês de referência no formato `YYYY-MM`. */
export type IsoMonth = string;

/**
 * Slot do dono dentro do casal. O design dá uma cor fixa para cada slot:
 * `a` é o azul da marca, `b` é o preto (que vira branco no modo escuro).
 * Ficar em slot em vez de "cor" mantém a semântica no tema certo.
 */
export type OwnerSlot = 'a' | 'b';

/** Natureza do lançamento. */
export type TransactionKind = 'expense' | 'income';

/** Quem carrega o valor do lançamento. */
export type SplitMode =
  /** Fica todo no nome de quem pagou. */
  | 'payer'
  /** Dividido meio a meio entre os dois. */
  | 'equal';

/** Quem enxerga a categoria. */
export type CategoryScope =
  /** Aparece no painel dos dois. */
  | 'shared'
  /** Aparece só para quem criou. */
  | 'private';

/** Chave de cor da categoria — resolvida para um token de tema na UI. */
export type CategoryColor = 'accent' | 'ink' | 'mist' | 'violet' | 'silver';

export interface User {
  id: Id;
  name: string;
  email: string;
  /** Iniciais mostradas no avatar. Derivadas do nome, mas guardadas para o casal poder ajustar. */
  initials: string;
  slot: OwnerSlot;
}

export interface CoupleInvite {
  id: Id;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
}

export interface Couple {
  id: Id;
  /** Código curto de convite, ex.: `DUO-4F92`. */
  code: string;
  members: User[];
  invites: CoupleInvite[];
}

export interface Category {
  id: Id;
  name: string;
  /** Sigla de duas letras mostrada no quadradinho, ex.: `MC`. */
  tag: string;
  /** Linha de apoio na lista, ex.: "Compras da semana". */
  description: string;
  kind: TransactionKind;
  color: CategoryColor;
  /** Limite mensal em centavos, ou `null` quando a categoria não tem teto. */
  monthlyLimitCents: number | null;
  scope: CategoryScope;
  /** Preenchido apenas quando `scope === 'private'`. */
  ownerId: Id | null;
}

export interface Transaction {
  id: Id;
  kind: TransactionKind;
  description: string;
  amountCents: number;
  categoryId: Id;
  /** Quem pagou (saída) ou recebeu (entrada). */
  payerId: Id;
  split: SplitMode;
  date: IsoDate;
  /** Se repete todo mês. */
  recurring: boolean;
  createdAt: string;
}

/** Quanto cada pessoa movimentou no mês. */
export interface PersonSummary {
  userId: Id;
  spentCents: number;
  /** Fatia do total de saídas, de 0 a 100. */
  sharePercent: number;
  transactionCount: number;
}

/** Quanto foi gasto por categoria no mês. */
export interface CategorySummary {
  categoryId: Id;
  spentCents: number;
  limitCents: number | null;
  /** Uso do limite, de 0 a 100. `null` quando não há limite. */
  usagePercent: number | null;
}

/** Quem deve para quem, considerando só os lançamentos divididos. */
export interface Settlement {
  fromUserId: Id;
  toUserId: Id;
  amountCents: number;
  settled: boolean;
}

export interface MonthSummary {
  month: IsoMonth;
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  perPerson: PersonSummary[];
  byCategory: CategorySummary[];
  settlement: Settlement | null;
}

/** Filtro de dono usado nos chips do painel. */
export type OwnerFilter = 'all' | Id;

export interface TransactionQuery {
  month?: IsoMonth;
  owner?: OwnerFilter;
  kind?: TransactionKind;
  categoryId?: Id;
  limit?: number;
}

/** Payload de criação de lançamento — o `id` e o `createdAt` são do servidor. */
export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

/** Payload de criação de categoria. */
export type CreateCategoryInput = Omit<Category, 'id'>;

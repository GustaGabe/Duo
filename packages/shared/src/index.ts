/**
 * Duo domain contracts.
 *
 * Types only — no runtime, no dependencies. `apps/web` uses them today against mock data and
 * `apps/api` (NestJS) will reuse them later, so the two sides can never disagree about shape.
 *
 * Money is ALWAYS an integer in cents (`…Cents`). Never a float in reais, never a formatted
 * string — formatting belongs to the presentation layer.
 */

/** Opaque identifier. */
export type Id = string;

/** ISO date, `YYYY-MM-DD`. */
export type IsoDate = string;

/** Reference month, `YYYY-MM`. */
export type IsoMonth = string;

/**
 * Which half of the couple owns something. The design fixes a colour per slot: `a` is the brand
 * blue, `b` is black — and black becomes white in dark mode. Storing the slot rather than the
 * colour is what keeps the couple legible in both themes.
 */
export type OwnerSlot = 'a' | 'b';

/** What kind of entry this is. */
export type TransactionKind = 'expense' | 'income';

/** Who carries the value of the entry. */
export type SplitMode =
  /** Stays entirely with whoever paid. */
  | 'payer'
  /** Split evenly between the two. */
  | 'equal';

/** Who can see the category. */
export type CategoryScope =
  /** Shows up on both dashboards. */
  | 'shared'
  /** Only visible to whoever created it. */
  | 'private';

/** Category colour key — resolved to a theme token in the UI. */
export type CategoryColor = 'accent' | 'ink' | 'mist' | 'violet' | 'silver';

export interface User {
  id: Id;
  name: string;
  email: string;
  /** Initials shown on the avatar. Derived from the name, but stored so it can be overridden. */
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
  /** Short invite code, e.g. `DUO-4F92`. */
  code: string;
  members: User[];
  invites: CoupleInvite[];
}

export interface Category {
  id: Id;
  name: string;
  /** Two-letter badge shown in the square tile, e.g. `MC`. */
  tag: string;
  /** Supporting line in the list, e.g. "Compras da semana". */
  description: string;
  kind: TransactionKind;
  color: CategoryColor;
  /** Monthly cap in cents, or `null` when the category has no cap. */
  monthlyLimitCents: number | null;
  scope: CategoryScope;
  /** Only set when `scope === 'private'`. */
  ownerId: Id | null;
}

export interface Transaction {
  id: Id;
  kind: TransactionKind;
  description: string;
  amountCents: number;
  categoryId: Id;
  /** Who paid (expense) or received (income). */
  payerId: Id;
  split: SplitMode;
  date: IsoDate;
  /** Repeats every month. */
  recurring: boolean;
  createdAt: string;
}

/** How much each person moved during the month. */
export interface PersonSummary {
  userId: Id;
  spentCents: number;
  /** Share of total expenses, 0 to 100. */
  sharePercent: number;
  transactionCount: number;
}

/** How much was spent per category during the month. */
export interface CategorySummary {
  categoryId: Id;
  spentCents: number;
  limitCents: number | null;
  /** Cap usage, 0 to 100. `null` when there is no cap. */
  usagePercent: number | null;
}

/** Who owes whom, counting only the entries marked as split. */
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

/** Owner filter behind the dashboard chips. */
export type OwnerFilter = 'all' | Id;

export interface TransactionQuery {
  month?: IsoMonth;
  owner?: OwnerFilter;
  kind?: TransactionKind;
  categoryId?: Id;
  limit?: number;
}

/** Create payload — `id` and `createdAt` come from the server. */
export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

/** Category create payload. */
export type CreateCategoryInput = Omit<Category, 'id'>;

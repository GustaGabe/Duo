export type Id = string;

export type IsoDate = string;

export type IsoMonth = string;

export type OwnerSlot = 'a' | 'b';

export type TransactionKind = 'expense' | 'income';

export type SplitMode =
  | 'payer'
  | 'equal';

export type CategoryScope =
  | 'shared'
  | 'private';

export type CategoryColor = 'accent' | 'ink' | 'mist' | 'violet' | 'silver';

export interface User {
  id: Id;
  name: string;
  email: string;
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
  code: string;
  members: User[];
  invites: CoupleInvite[];
}

export interface Category {
  id: Id;
  name: string;
  tag: string;
  description: string;
  kind: TransactionKind;
  color: CategoryColor;
  monthlyLimitCents: number | null;
  scope: CategoryScope;
  ownerId: Id | null;
}

export interface Transaction {
  id: Id;
  kind: TransactionKind;
  description: string;
  amountCents: number;
  categoryId: Id;
  payerId: Id;
  split: SplitMode;
  date: IsoDate;
  recurring: boolean;
  createdAt: string;
}

export interface PersonSummary {
  userId: Id;
  spentCents: number;
  sharePercent: number;
  transactionCount: number;
}

export interface CategorySummary {
  categoryId: Id;
  spentCents: number;
  limitCents: number | null;
  usagePercent: number | null;
}

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

export type OwnerFilter = 'all' | Id;

export interface TransactionQuery {
  month?: IsoMonth;
  owner?: OwnerFilter;
  kind?: TransactionKind;
  categoryId?: Id;
  limit?: number;
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

export type CreateCategoryInput = Omit<Category, 'id'>;

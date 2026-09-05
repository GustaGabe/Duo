export type Id = string;

export type IsoDate = string;

export type IsoMonth = string;

export type MemberSlot = 'a' | 'b' | 'c' | 'd';

export type SpaceRole = 'owner' | 'member';

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
}

export interface SessionUser {
  id: Id;
  name: string;
  email: string;
  initials: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SpaceMember extends User {
  slot: MemberSlot;
  role: SpaceRole;
  joinedAt: string;
}

export interface SpaceInvite {
  id: Id;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
}

export interface Space {
  id: Id;
  name: string;
  code: string;
  ownerId: Id;
  members: SpaceMember[];
  invites: SpaceInvite[];
  createdAt: string;
}

export interface CreateSpaceInput {
  name: string;
}

export interface Category {
  id: Id;
  spaceId: Id;
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
  spaceId: Id;
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
  spaceId: Id;
  month: IsoMonth;
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  perPerson: PersonSummary[];
  byCategory: CategorySummary[];
  settlements: Settlement[];
}

export type OwnerFilter = 'all' | Id;

export interface TransactionQuery {
  spaceId: Id;
  month?: IsoMonth;
  owner?: OwnerFilter;
  kind?: TransactionKind;
  categoryId?: Id;
  limit?: number;
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

/** `ownerId` is derived from the session on the server, never sent by the client. */
export type CreateCategoryInput = Omit<Category, 'id' | 'ownerId'>;

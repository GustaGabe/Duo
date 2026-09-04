import type { Category, Couple, Transaction, User } from '@duo/shared';

export const ANA: User = {
  id: 'usr_ana',
  name: 'Ana Ribeiro',
  email: 'ana@duo.app',
  initials: 'A',
  slot: 'a',
};

export const LEO: User = {
  id: 'usr_leo',
  name: 'Léo Martins',
  email: 'leo@duo.app',
  initials: 'L',
  slot: 'b',
};

export const CURRENT_USER_ID = ANA.id;

export const TODAY = '2026-09-04';
export const CURRENT_MONTH = '2026-09';

interface Database {
  couple: Couple;
  categories: Category[];
  transactions: Transaction[];
}

const categories: Category[] = [
  {
    id: 'cat_casa',
    name: 'Casa',
    tag: 'CA',
    description: 'Aluguel, contas, condomínio',
    kind: 'expense',
    color: 'accent',
    monthlyLimitCents: 300_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_mercado',
    name: 'Mercado',
    tag: 'MC',
    description: 'Compras da semana',
    kind: 'expense',
    color: 'mist',
    monthlyLimitCents: 140_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_lazer',
    name: 'Lazer',
    tag: 'LZ',
    description: 'Jantares, cinema, viagens',
    kind: 'expense',
    color: 'mist',
    monthlyLimitCents: 90_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_transporte',
    name: 'Transporte',
    tag: 'TR',
    description: 'App, combustível',
    kind: 'expense',
    color: 'mist',
    monthlyLimitCents: 60_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_saude',
    name: 'Saúde',
    tag: 'SD',
    description: 'Plano, farmácia',
    kind: 'expense',
    color: 'mist',
    monthlyLimitCents: 90_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_educacao',
    name: 'Educação',
    tag: 'ED',
    description: 'Cursos e livros',
    kind: 'expense',
    color: 'silver',
    monthlyLimitCents: 50_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_renda',
    name: 'Renda',
    tag: 'RD',
    description: 'Salários e freelas',
    kind: 'income',
    color: 'accent',
    monthlyLimitCents: 1_100_000,
    scope: 'shared',
    ownerId: null,
  },
  {
    id: 'cat_pessoal_ana',
    name: 'Pessoal Ana',
    tag: 'PS',
    description: 'Só aparece para Ana',
    kind: 'expense',
    color: 'mist',
    monthlyLimitCents: 40_000,
    scope: 'private',
    ownerId: ANA.id,
  },
  {
    id: 'cat_pets',
    name: 'Pets',
    tag: 'PT',
    description: 'Só aparece para o Léo',
    kind: 'expense',
    color: 'violet',
    monthlyLimitCents: 30_000,
    scope: 'private',
    ownerId: LEO.id,
  },
];

type Seed = [
  description: string,
  cents: number,
  categoryId: string,
  payerId: string,
  date: string,
  split: 'payer' | 'equal',
  kind?: 'expense' | 'income',
  recurring?: boolean,
];

const seed: Seed[] = [
  ['Aluguel', 240_000, 'cat_casa', ANA.id, '2026-09-03', 'equal', 'expense', true],
  ['Supermercado do mês', 47_480, 'cat_mercado', LEO.id, '2026-09-01', 'equal'],
  ['Conta de luz', 21_860, 'cat_casa', LEO.id, '2026-09-02', 'equal'],
  ['Internet fibra', 11_990, 'cat_casa', LEO.id, '2026-09-01', 'equal', 'expense', true],
  ['Plano de saúde', 63_240, 'cat_saude', LEO.id, '2026-09-01', 'equal', 'expense', true],
  ['Jantar a dois', 16_800, 'cat_lazer', LEO.id, '2026-09-01', 'equal'],

  ['Mercado da esquina', 18_200, 'cat_mercado', ANA.id, '2026-09-04', 'payer'],
  ['Uber para o trabalho', 4_300, 'cat_transporte', ANA.id, '2026-09-03', 'payer'],
  ['Feira orgânica', 9_400, 'cat_mercado', ANA.id, '2026-09-03', 'payer'],
  ['Farmácia São João', 12_750, 'cat_saude', ANA.id, '2026-09-02', 'payer'],
  ['Café da manhã', 1_800, 'cat_lazer', ANA.id, '2026-09-04', 'payer'],
  ['Salão de beleza', 12_000, 'cat_pessoal_ana', ANA.id, '2026-09-03', 'payer'],
  ['Livraria', 8_900, 'cat_educacao', ANA.id, '2026-09-02', 'payer'],
  ['Uber de volta', 3_750, 'cat_transporte', ANA.id, '2026-09-02', 'payer'],
  ['Almoço no centro', 4_480, 'cat_lazer', ANA.id, '2026-09-04', 'payer'],
  ['Padaria', 2_360, 'cat_mercado', ANA.id, '2026-09-01', 'payer'],
  ['Estacionamento', 1_800, 'cat_transporte', ANA.id, '2026-09-03', 'payer'],
  ['Assinatura de streaming', 3_990, 'cat_lazer', ANA.id, '2026-09-01', 'payer', 'expense', true],
  ['Ração do gato', 795, 'cat_pets', ANA.id, '2026-09-02', 'payer'],

  ['Café perto do escritório', 1_650, 'cat_lazer', LEO.id, '2026-09-04', 'payer'],
  ['Ônibus', 940, 'cat_transporte', LEO.id, '2026-09-03', 'payer'],
  ['Pão na padaria', 1_280, 'cat_mercado', LEO.id, '2026-09-02', 'payer'],
  ['Pilhas e lâmpadas', 2_025, 'cat_casa', LEO.id, '2026-09-01', 'payer'],

  ['Salário CLT', 580_000, 'cat_renda', ANA.id, '2026-09-01', 'payer', 'income', true],
  ['Salário', 490_000, 'cat_renda', LEO.id, '2026-09-01', 'payer', 'income', true],
  ['Freela de design', 70_000, 'cat_renda', ANA.id, '2026-09-03', 'payer', 'income'],
];

const transactions: Transaction[] = seed.map(
  ([description, amountCents, categoryId, payerId, date, split, kind = 'expense', recurring = false], index) => ({
    id: `txn_${String(index + 1).padStart(3, '0')}`,
    kind,
    description,
    amountCents,
    categoryId,
    payerId,
    split,
    date,
    recurring,
    createdAt: `${date}T12:00:00.000Z`,
  }),
);

export const db: Database = {
  couple: {
    id: 'cpl_duo',
    code: 'DUO-4F92',
    members: [ANA, LEO],
    invites: [
      {
        id: 'inv_leo',
        email: 'leo@duo.app',
        status: 'pending',
        sentAt: '2026-09-04T11:58:00.000Z',
      },
    ],
  },
  categories,
  transactions,
};

let sequence = seed.length;
export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}_${String(sequence).padStart(3, '0')}`;
}

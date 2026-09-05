import type { Category, Space, Transaction, User } from '@duo/shared';

import { CURRENT_MONTH, TODAY } from '@/lib/clock';

export const ANA: User = {
  id: 'usr_ana',
  name: 'Ana Ribeiro',
  email: 'ana@duo.app',
  initials: 'A',
};

export const LEO: User = {
  id: 'usr_leo',
  name: 'Léo Martins',
  email: 'leo@duo.app',
  initials: 'L',
};

export const BIA: User = {
  id: 'usr_bia',
  name: 'Bia Nunes',
  email: 'bia@duo.app',
  initials: 'B',
};

export const RAFA: User = {
  id: 'usr_rafa',
  name: 'Rafa Costa',
  email: 'rafa@duo.app',
  initials: 'R',
};

export const CURRENT_USER_ID = ANA.id;

export { CURRENT_MONTH, TODAY };

export const CASA_ID = 'spc_casa';
export const VIAGEM_ID = 'spc_viagem';
export const PESSOAL_ID = 'spc_pessoal';

interface Database {
  users: User[];
  spaces: Space[];
  categories: Category[];
  transactions: Transaction[];
}

const spaces: Space[] = [
  {
    id: CASA_ID,
    name: 'Casa',
    code: 'DUO-4F92',
    ownerId: ANA.id,
    createdAt: '2026-01-12T10:00:00.000Z',
    members: [
      { ...ANA, slot: 'a', role: 'owner', joinedAt: '2026-01-12T10:00:00.000Z' },
      { ...LEO, slot: 'b', role: 'member', joinedAt: '2026-01-12T10:22:00.000Z' },
    ],
    invites: [],
  },
  {
    id: VIAGEM_ID,
    name: 'Viagem ao Chile',
    code: 'DUO-8K31',
    ownerId: LEO.id,
    createdAt: '2026-08-02T09:00:00.000Z',
    members: [
      { ...LEO, slot: 'a', role: 'owner', joinedAt: '2026-08-02T09:00:00.000Z' },
      { ...ANA, slot: 'b', role: 'member', joinedAt: '2026-08-02T09:05:00.000Z' },
      { ...BIA, slot: 'c', role: 'member', joinedAt: '2026-08-03T14:10:00.000Z' },
      { ...RAFA, slot: 'd', role: 'member', joinedAt: '2026-08-04T19:40:00.000Z' },
    ],
    invites: [
      { id: 'inv_tom', email: 'tom@duo.app', status: 'pending', sentAt: '2026-09-02T18:00:00.000Z' },
    ],
  },
  {
    id: PESSOAL_ID,
    name: 'Meu pessoal',
    code: 'DUO-2A07',
    ownerId: ANA.id,
    createdAt: '2026-03-01T08:00:00.000Z',
    members: [{ ...ANA, slot: 'a', role: 'owner', joinedAt: '2026-03-01T08:00:00.000Z' }],
    invites: [],
  },
];

type CategorySeed = [
  id: string,
  spaceId: string,
  name: string,
  tag: string,
  description: string,
  kind: 'expense' | 'income',
  color: Category['color'],
  limit: number | null,
  scope: 'shared' | 'private',
  ownerId: string | null,
];

const categorySeed: CategorySeed[] = [
  [ 'cat_casa', CASA_ID, 'Casa', 'CA', 'Aluguel, contas, condomínio', 'expense', 'accent', 300_000, 'shared', null ],
  [ 'cat_mercado', CASA_ID, 'Mercado', 'MC', 'Compras da semana', 'expense', 'mist', 140_000, 'shared', null ],
  [ 'cat_lazer', CASA_ID, 'Lazer', 'LZ', 'Jantares, cinema, viagens', 'expense', 'mist', 90_000, 'shared', null ],
  [ 'cat_transporte', CASA_ID, 'Transporte', 'TR', 'App, combustível', 'expense', 'mist', 60_000, 'shared', null ],
  [ 'cat_saude', CASA_ID, 'Saúde', 'SD', 'Plano, farmácia', 'expense', 'mist', 90_000, 'shared', null ],
  [ 'cat_educacao', CASA_ID, 'Educação', 'ED', 'Cursos e livros', 'expense', 'silver', 50_000, 'shared', null ],
  [ 'cat_renda', CASA_ID, 'Renda', 'RD', 'Salários e freelas', 'income', 'accent', 1_100_000, 'shared', null ],
  [ 'cat_pessoal_ana', CASA_ID, 'Pessoal Ana', 'PS', 'Só aparece para Ana', 'expense', 'mist', 40_000, 'private', ANA.id ],
  [ 'cat_pessoal_leo', CASA_ID, 'Pessoal Léo', 'PL', 'Só aparece para o Léo', 'expense', 'violet', 30_000, 'private', LEO.id ],

  [ 'cat_v_passagem', VIAGEM_ID, 'Passagens', 'PA', 'Aéreo e traslado', 'expense', 'accent', 800_000, 'shared', null ],
  [ 'cat_v_hospedagem', VIAGEM_ID, 'Hospedagem', 'HO', 'Hotéis e airbnb', 'expense', 'violet', 600_000, 'shared', null ],
  [ 'cat_v_comida', VIAGEM_ID, 'Comida', 'CO', 'Restaurantes e mercado', 'expense', 'mist', 300_000, 'shared', null ],
  [ 'cat_v_passeio', VIAGEM_ID, 'Passeios', 'PS', 'Ingressos e tours', 'expense', 'silver', 250_000, 'shared', null ],
  [ 'cat_v_caixa', VIAGEM_ID, 'Caixinha', 'CX', 'Aportes do grupo', 'income', 'accent', 2_000_000, 'shared', null ],

  [ 'cat_p_estudos', PESSOAL_ID, 'Estudos', 'ET', 'Cursos e certificações', 'expense', 'accent', 60_000, 'shared', null ],
  [ 'cat_p_freela', PESSOAL_ID, 'Freelas', 'FR', 'Trabalhos por fora', 'income', 'accent', null, 'shared', null ],
];

const categories: Category[] = categorySeed.map(
  ([id, spaceId, name, tag, description, kind, color, monthlyLimitCents, scope, ownerId]) => ({
    id,
    spaceId,
    name,
    tag,
    description,
    kind,
    color,
    monthlyLimitCents,
    scope,
    ownerId,
  }),
);

type Seed = [
  spaceId: string,
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
  [CASA_ID, 'Aluguel', 240_000, 'cat_casa', ANA.id, '2026-09-03', 'equal', 'expense', true],
  [CASA_ID, 'Supermercado do mês', 47_480, 'cat_mercado', LEO.id, '2026-09-01', 'equal'],
  [CASA_ID, 'Conta de luz', 21_860, 'cat_casa', LEO.id, '2026-09-02', 'equal'],
  [CASA_ID, 'Internet fibra', 11_990, 'cat_casa', LEO.id, '2026-09-01', 'equal', 'expense', true],
  [CASA_ID, 'Plano de saúde', 63_240, 'cat_saude', LEO.id, '2026-09-01', 'equal', 'expense', true],
  [CASA_ID, 'Jantar a dois', 16_800, 'cat_lazer', LEO.id, '2026-09-01', 'equal'],

  [CASA_ID, 'Mercado da esquina', 18_200, 'cat_mercado', ANA.id, '2026-09-04', 'payer'],
  [CASA_ID, 'Uber para o trabalho', 4_300, 'cat_transporte', ANA.id, '2026-09-03', 'payer'],
  [CASA_ID, 'Feira orgânica', 9_400, 'cat_mercado', ANA.id, '2026-09-03', 'payer'],
  [CASA_ID, 'Farmácia São João', 12_750, 'cat_saude', ANA.id, '2026-09-02', 'payer'],
  [CASA_ID, 'Café da manhã', 1_800, 'cat_lazer', ANA.id, '2026-09-04', 'payer'],
  [CASA_ID, 'Salão de beleza', 12_000, 'cat_pessoal_ana', ANA.id, '2026-09-03', 'payer'],
  [CASA_ID, 'Livraria', 8_900, 'cat_educacao', ANA.id, '2026-09-02', 'payer'],
  [CASA_ID, 'Uber de volta', 3_750, 'cat_transporte', ANA.id, '2026-09-02', 'payer'],
  [CASA_ID, 'Almoço no centro', 4_480, 'cat_lazer', ANA.id, '2026-09-04', 'payer'],
  [CASA_ID, 'Padaria', 2_360, 'cat_mercado', ANA.id, '2026-09-01', 'payer'],
  [CASA_ID, 'Estacionamento', 1_800, 'cat_transporte', ANA.id, '2026-09-03', 'payer'],
  [CASA_ID, 'Assinatura de streaming', 3_990, 'cat_lazer', ANA.id, '2026-09-01', 'payer', 'expense', true],
  [CASA_ID, 'Ração do gato', 795, 'cat_pessoal_ana', ANA.id, '2026-09-02', 'payer'],

  [CASA_ID, 'Café perto do escritório', 1_650, 'cat_pessoal_leo', LEO.id, '2026-09-04', 'payer'],
  [CASA_ID, 'Ônibus', 940, 'cat_transporte', LEO.id, '2026-09-03', 'payer'],
  [CASA_ID, 'Pão na padaria', 1_280, 'cat_mercado', LEO.id, '2026-09-02', 'payer'],
  [CASA_ID, 'Pilhas e lâmpadas', 2_025, 'cat_casa', LEO.id, '2026-09-01', 'payer'],

  [CASA_ID, 'Salário CLT', 580_000, 'cat_renda', ANA.id, '2026-09-01', 'payer', 'income', true],
  [CASA_ID, 'Salário', 490_000, 'cat_renda', LEO.id, '2026-09-01', 'payer', 'income', true],
  [CASA_ID, 'Freela de design', 70_000, 'cat_renda', ANA.id, '2026-09-03', 'payer', 'income'],

  [VIAGEM_ID, 'Passagens Santiago', 720_000, 'cat_v_passagem', LEO.id, '2026-09-01', 'equal'],
  [VIAGEM_ID, 'Airbnb Bellavista', 384_000, 'cat_v_hospedagem', BIA.id, '2026-09-02', 'equal'],
  [VIAGEM_ID, 'Aluguel de carro', 156_000, 'cat_v_passagem', RAFA.id, '2026-09-02', 'equal'],
  [VIAGEM_ID, 'Jantar no Bocanáriz', 62_400, 'cat_v_comida', ANA.id, '2026-09-03', 'equal'],
  [VIAGEM_ID, 'Tour Valle Nevado', 98_000, 'cat_v_passeio', BIA.id, '2026-09-03', 'equal'],
  [VIAGEM_ID, 'Mercado para o apê', 24_600, 'cat_v_comida', RAFA.id, '2026-09-04', 'equal'],
  [VIAGEM_ID, 'Ingresso Cerro San Cristóbal', 8_800, 'cat_v_passeio', LEO.id, '2026-09-04', 'payer'],
  [VIAGEM_ID, 'Aporte da Ana', 400_000, 'cat_v_caixa', ANA.id, '2026-09-01', 'payer', 'income'],
  [VIAGEM_ID, 'Aporte do Léo', 400_000, 'cat_v_caixa', LEO.id, '2026-09-01', 'payer', 'income'],
  [VIAGEM_ID, 'Aporte da Bia', 400_000, 'cat_v_caixa', BIA.id, '2026-09-01', 'payer', 'income'],
  [VIAGEM_ID, 'Aporte do Rafa', 400_000, 'cat_v_caixa', RAFA.id, '2026-09-02', 'payer', 'income'],

  [PESSOAL_ID, 'Curso de Rust', 49_900, 'cat_p_estudos', ANA.id, '2026-09-02', 'payer'],
  [PESSOAL_ID, 'Landing page para cliente', 180_000, 'cat_p_freela', ANA.id, '2026-09-03', 'payer', 'income'],
];

const transactions: Transaction[] = seed.map(
  (
    [spaceId, description, amountCents, categoryId, payerId, date, split, kind = 'expense', recurring = false],
    index,
  ) => ({
    id: `txn_${String(index + 1).padStart(3, '0')}`,
    spaceId,
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
  users: [ANA, LEO, BIA, RAFA],
  spaces,
  categories,
  transactions,
};

let sequence = seed.length;
export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}_${String(sequence).padStart(3, '0')}`;
}

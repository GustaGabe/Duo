export interface NavItem {
  to: string;
  label: string;
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Painel' },
  { to: '/transactions', label: 'Lançamentos' },
  { to: '/reports', label: 'Relatórios' },
  { to: '/goals', label: 'Metas' },
  { to: '/categories', label: 'Categorias' },
  { to: '/spaces', label: 'Espaços' },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Início' },
  { to: '/reports', label: 'Relatórios' },
  { to: '/goals', label: 'Metas' },
  { to: '/spaces', label: 'Espaços' },
];

import type { LinkProps } from '@tanstack/react-router';
import {
  ListOrdered,
  Shield,
  Swords,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { LEAGUE_MOCK } from '@/lib/mocks/league.mock';

type MenuItem = {
  title: string;
  icon: LucideIcon;
  // Sem rota enquanto a página não existe
  to?: LinkProps['to'];
  count?: number;
};

export const MENU_GROUPS: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Mercado',
    items: [
      {
        title: 'Jogadores',
        icon: Users,
        to: '/players',
        count: LEAGUE_MOCK.playersCount,
      },
      {
        title: 'Clubes',
        icon: Shield,
        to: '/clubs',
        count: LEAGUE_MOCK.clubsCount,
      },
    ],
  },
  {
    label: 'Liga',
    items: [
      { title: 'Partidas', icon: Swords, count: LEAGUE_MOCK.matchesCount },
      { title: 'Classificação', icon: ListOrdered },
    ],
  },
];

import type { LinkProps } from '@tanstack/react-router';
import {
  ListOrdered,
  Shield,
  Swords,
  Users,
  type LucideIcon,
} from 'lucide-react';

type MenuItem = {
  title: string;
  icon: LucideIcon;
  // Sem rota enquanto a página não existe
  to?: LinkProps['to'];
};

export const MENU_GROUPS: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Mercado',
    items: [
      { title: 'Jogadores', icon: Users, to: '/players' },
      { title: 'Clubes', icon: Shield, to: '/clubs' },
    ],
  },
  {
    label: 'Liga',
    items: [
      { title: 'Partidas', icon: Swords, to: '/matches' },
      { title: 'Classificação', icon: ListOrdered, to: '/standings' },
    ],
  },
];

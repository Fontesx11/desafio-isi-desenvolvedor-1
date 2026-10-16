import {
  HandCoins,
  History,
  Shield,
  ShoppingCart,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const FLOW_STEPS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Users,
    title: 'Jogadores',
    description:
      'Nascem livres e Apto; o valor de mercado vem da condição, agilidade e idade.',
  },
  {
    icon: Shield,
    title: 'Clubes',
    description: 'Começam com 300,00 em caixa e sem jogadores.',
  },
  {
    icon: ShoppingCart,
    title: 'Compra',
    description: 'Valor + taxa, até 50% do caixa, com contrato de fidelidade.',
  },
  {
    icon: HandCoins,
    title: 'Venda',
    description: 'Multa antes do fim da fidelidade e comissão sobre o lucro.',
  },
  {
    icon: History,
    title: 'Histórico',
    description: 'Toda compra e venda fica registrada, com totais e CSV.',
  },
  {
    icon: Trophy,
    title: 'Liga',
    description:
      'Escale 5 titulares e jogue partidas que entram na classificação.',
  },
];

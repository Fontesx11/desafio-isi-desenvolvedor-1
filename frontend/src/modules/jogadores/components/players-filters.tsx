import {
  ChevronDown,
  Coins,
  HeartPulse,
  Search,
  Shield,
  Shirt,
  User,
} from 'lucide-react';
import { InputWithIcon } from '@/components/input-with-icon';
import { Button } from '@/components/ui/button';

const FILTERS = [
  { id: 'position', label: 'Posição', icon: Shirt },
  { id: 'condition', label: 'Condição', icon: HeartPulse },
  { id: 'club', label: 'Clube', icon: Shield },
  { id: 'age', label: 'Idade', icon: User },
  { id: 'market-value', label: 'Valor de mercado', icon: Coins },
];

type PlayersFiltersProps = {
  // "Só livres" não combina com o filtro por clube
  isClubFilterDisabled: boolean;
};

export function PlayersFilters({ isClubFilterDisabled }: PlayersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 p-2">
      <div className="min-w-64 flex-1">
        <InputWithIcon
          icon={Search}
          type="search"
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
          className="h-9"
        />
      </div>
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          type="button"
          variant="outline"
          disabled={filter.id === 'club' && isClubFilterDisabled}
          className="h-9 gap-2 font-normal"
        >
          <filter.icon className="text-zinc-500" />
          {filter.label}
          <ChevronDown className="text-zinc-400" />
        </Button>
      ))}
    </div>
  );
}

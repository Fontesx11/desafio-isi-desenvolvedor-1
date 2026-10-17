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
import { FilterMenu } from '@/components/filter-menu';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import { Button } from '@/components/ui/button';
import {
  CONDITIONS,
  CONDITION_LABELS,
  POSITIONS,
  POSITION_LABELS,
} from '../constants/players.constants';
import type { PlayerCondition, PlayerPosition } from '../types/players.types';

const FILTERS = [
  { id: 'age', label: 'Idade', icon: User },
  { id: 'market-value', label: 'Valor de mercado', icon: Coins },
];

type PlayersFiltersProps = {
  search: string;
  position: PlayerPosition | undefined;
  onPositionChange: (position: PlayerPosition | undefined) => void;
  clubId: number | undefined;
  onClubChange: (clubId: number | undefined) => void;
  condition: PlayerCondition | undefined;
  onConditionChange: (condition: PlayerCondition | undefined) => void;
  onSearchChange: (search: string) => void;
  // "Só livres" não combina com o filtro por clube
  isClubFilterDisabled: boolean;
};

export function PlayersFilters({
  search,
  position,
  onPositionChange,
  clubId,
  onClubChange,
  condition,
  onConditionChange,
  onSearchChange,
  isClubFilterDisabled,
}: PlayersFiltersProps) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs = [] } = useGetClubs();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 p-2">
      <div className="min-w-64 flex-1">
        <InputWithIcon
          icon={Search}
          type="search"
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
          className="h-9"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <FilterMenu
        icon={Shirt}
        label="Posição"
        options={POSITIONS.map((value) => ({
          value,
          label: POSITION_LABELS[value],
        }))}
        value={position}
        onChange={onPositionChange}
      />
      <FilterMenu
        icon={HeartPulse}
        label="Condição"
        options={CONDITIONS.map((value) => ({
          value,
          label: CONDITION_LABELS[value],
        }))}
        value={condition}
        onChange={onConditionChange}
      />
      <FilterMenu
        icon={Shield}
        label="Clube"
        options={clubs.map((club) => ({
          value: String(club.id),
          label: club.name,
        }))}
        value={clubId === undefined ? undefined : String(clubId)}
        onChange={(value) =>
          onClubChange(value === undefined ? undefined : Number(value))
        }
        disabled={isClubFilterDisabled}
      />
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          type="button"
          variant="outline"
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

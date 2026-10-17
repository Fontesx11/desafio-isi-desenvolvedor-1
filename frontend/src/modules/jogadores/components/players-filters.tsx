import { Coins, HeartPulse, Search, Shield, Shirt, User } from 'lucide-react';
import { InputWithIcon } from '@/components/input-with-icon';
import { FilterMenu } from '@/components/filter-menu';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import { RangeFilterMenu, type Range } from '@/components/range-filter-menu';
import { formatCurrency } from '@/lib/format';
import {
  AGE_RANGE,
  MARKET_VALUE_RANGE,
  CONDITIONS,
  CONDITION_LABELS,
  POSITIONS,
  POSITION_LABELS,
} from '../constants/players.constants';
import type { PlayerCondition, PlayerPosition } from '../types/players.types';

type PlayersFiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  position: PlayerPosition | undefined;
  onPositionChange: (position: PlayerPosition | undefined) => void;
  condition: PlayerCondition | undefined;
  onConditionChange: (condition: PlayerCondition | undefined) => void;
  clubId: number | undefined;
  onClubChange: (clubId: number | undefined) => void;
  age: Range | undefined;
  onAgeChange: (age: Range | undefined) => void;
  marketValue: Range | undefined;
  onMarketValueChange: (marketValue: Range | undefined) => void;
  isClubFilterDisabled: boolean;
};

export function PlayersFilters({
  search,
  onSearchChange,
  position,
  onPositionChange,
  condition,
  onConditionChange,
  clubId,
  onClubChange,
  age,
  onAgeChange,
  marketValue,
  onMarketValueChange,
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
      <RangeFilterMenu
        icon={User}
        label="Idade"
        bounds={AGE_RANGE}
        value={age}
        onChange={onAgeChange}
      />
      <RangeFilterMenu
        icon={Coins}
        label="Valor"
        bounds={MARKET_VALUE_RANGE}
        step={0.01}
        value={marketValue}
        onChange={onMarketValueChange}
        formatValue={formatCurrency}
      />
    </div>
  );
}

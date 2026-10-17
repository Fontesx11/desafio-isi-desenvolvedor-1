import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import {
  CONDITION_LABELS,
  POSITION_LABELS,
} from '../constants/players.constants';
import type { PlayersFilters } from '../hooks/usePlayersFilters';

type ActiveFiltersProps = {
  filters: PlayersFilters;
  onChange: (changes: Partial<PlayersFilters>) => void;
  onClear: () => void;
};

export function ActiveFilters({
  filters,
  onChange,
  onClear,
}: ActiveFiltersProps) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs = [] } = useGetClubs();
  const { position, condition, clubId, age, marketValue } = filters;

  const chips = [
    position && {
      label: `Posição: ${POSITION_LABELS[position]}`,
      remove: { position: undefined },
    },
    condition && {
      label: `Condição: ${CONDITION_LABELS[condition]}`,
      remove: { condition: undefined },
    },
    clubId !== undefined && {
      label: `Clube: ${clubs.find((club) => club.id === clubId)?.name ?? clubId}`,
      remove: { clubId: undefined },
    },
    age && {
      label: `Idade: ${age.min} a ${age.max}`,
      remove: { age: undefined },
    },
    marketValue && {
      label: `Valor de mercado: ${formatCurrency(marketValue.min)} a ${formatCurrency(marketValue.max)}`,
      remove: { marketValue: undefined },
    },
  ].filter((chip) => !!chip);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-zinc-500">Filtros ativos:</span>
      {chips.map((chip) => (
        <Badge key={chip.label} variant="secondary" className="h-7 gap-1.5">
          {chip.label}
          <button
            type="button"
            aria-label={`Remover ${chip.label}`}
            onClick={() => onChange(chip.remove)}
          >
            <X className="size-3.5" />
          </button>
        </Badge>
      ))}
      <Button type="button" variant="link" onClick={onClear}>
        Limpar filtros
      </Button>
    </div>
  );
}

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { PAGE_SIZE, SORT_OPTIONS } from '../constants/players.constants';
import type {
  PlayerCondition,
  PlayerPosition,
  PlayersTab,
} from '../types/players.types';

type PlayersFilters = {
  tab: PlayersTab;
  search: string;
  position?: PlayerPosition;
  condition?: PlayerCondition;
  sort: string;
};

export function usePlayersFilters() {
  const [filters, setFilters] = useState<PlayersFilters>({
    tab: 'all',
    search: '',
    sort: SORT_OPTIONS[0].value,
  });
  const [page, setPage] = useState(1);

  function updateFilters(changes: Partial<PlayersFilters>) {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(1);
  }

  const debouncedSearch = useDebounce(filters.search.trim());

  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sort: filters.sort,
  });
  if (filters.position) params.set('position', filters.position);
  if (filters.condition) params.set('condition', filters.condition);
  if (debouncedSearch.length >= 2) params.set('search', debouncedSearch);
  if (filters.tab === 'free') params.set('free', 'true');

  return {
    filters,
    updateFilters,
    page,
    setPage,
    queryParams: params.toString(),
  };
}

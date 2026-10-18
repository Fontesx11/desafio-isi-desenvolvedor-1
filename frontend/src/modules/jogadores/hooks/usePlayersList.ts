import type { PlayersTab } from '../types/players.types';
import { usePlayersQueries } from './usePlayersQueries';

export function usePlayersList(queryParams: string) {
  const { useGetPlayers } = usePlayersQueries();
  const {
    data: playersPage,
    isLoading,
    error,
    refetch,
  } = useGetPlayers(queryParams);

  const { data: allPage } = useGetPlayers('limit=1');
  const { data: freePage } = useGetPlayers('limit=1&free=true');
  const allCount = allPage?.meta.total_items ?? 0;
  const freeCount = freePage?.meta.total_items ?? 0;

  const counts: Record<PlayersTab, number> = {
    all: allCount,
    free: freeCount,
    'in-clubs': allCount - freeCount,
  };

  return {
    players: playersPage?.data ?? [],
    total: playersPage?.meta.total_items ?? 0,
    counts,
    isLoading,
    error,
    refetch,
  };
}

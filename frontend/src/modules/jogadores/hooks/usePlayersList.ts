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
  const { data: inClubsPage } = useGetPlayers('limit=1&free=false');

  const counts: Record<PlayersTab, number> = {
    all: allPage?.meta.total_items ?? 0,
    free: freePage?.meta.total_items ?? 0,
    'in-clubs': inClubsPage?.meta.total_items ?? 0,
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

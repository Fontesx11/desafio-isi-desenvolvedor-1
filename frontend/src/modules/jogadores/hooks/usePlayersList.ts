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

  const countParams = new URLSearchParams(queryParams);
  ['page', 'sort', 'free'].forEach((key) => countParams.delete(key));
  countParams.set('limit', '1');

  const { data: allPage } = useGetPlayers(countParams.toString());
  const { data: freePage } = useGetPlayers(`${countParams}&free=true`);
  const { data: inClubsPage } = useGetPlayers(`${countParams}&free=false`);

  const counts: Record<PlayersTab, number> = {
    all: allPage?.meta.total_items ?? 0,
    free: freePage?.meta.total_items ?? 0,
    'in-clubs': inClubsPage?.meta.total_items ?? 0,
  };

  return {
    players: playersPage?.data ?? [],
    total: playersPage?.meta.total_items ?? 0,
    totalPages: playersPage?.meta.total_pages,
    counts,
    isLoading,
    error,
    refetch,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getStandings } from '../services/standings.service';

export function useStandingsQueries() {
  const useGetStandings = () =>
    useQuery({
      queryKey: ['standings'],
      queryFn: () => getStandings(),
    });

  return { useGetStandings };
}

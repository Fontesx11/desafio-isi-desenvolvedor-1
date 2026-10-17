import { useQuery } from '@tanstack/react-query';
import { getClubs } from '../services/clubs.service';

export function useClubsQueries() {
  const useGetClubs = () =>
    useQuery({
      queryKey: ['clubs'],
      queryFn: getClubs,
    });

  return { useGetClubs };
}

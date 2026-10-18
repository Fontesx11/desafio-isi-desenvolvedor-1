import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getClubs, saveClub } from '../services/clubs.service';
import type { ClubSort, CreateClub } from '../types/clubs.types';

export function useClubsQueries() {
  const queryClient = useQueryClient();

  const refreshClubs = () =>
    queryClient.invalidateQueries({ queryKey: ['clubs'] });

  const showError = (error: Error) => toast.error(error.message);

  const useGetClubs = (sort: ClubSort = 'name') =>
    useQuery({
      queryKey: ['clubs', sort],
      queryFn: () => getClubs(sort),
    });

  const useCreateClub = () =>
    useMutation({
      mutationFn: (data: CreateClub) => saveClub(data),
      onSuccess: refreshClubs,
      onError: showError,
    });

  return { useGetClubs, useCreateClub };
}

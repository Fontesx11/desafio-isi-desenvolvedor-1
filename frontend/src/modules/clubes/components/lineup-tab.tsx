import { toast } from 'sonner';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useLeagueQueries } from '@/modules/liga/hooks/useLeagueQueries';
import type { SaveLineup } from '@/modules/liga/types/league.types';
import type { ClubDetails } from '../types/clubs.types';
import { LineupForm } from './lineup-form';

export function LineupTab({ club }: { club: ClubDetails }) {
  const { useGetLineup, useSaveLineup } = useLeagueQueries();
  const {
    data: lineup,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLineup(club.id);
  const { mutate, isPending } = useSaveLineup();

  function saveLineup(data: SaveLineup) {
    mutate(
      { clubId: club.id, data },
      {
        onSuccess: (saved) => {
          toast.success('Escalação salva', {
            description: `${club.name} na formação ${saved.formation}.`,
          });
        },
      },
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a escalação"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!lineup || isFetching) {
    return <LoadingState />;
  }

  return (
    <LineupForm
      club={club}
      lineup={lineup}
      isSaving={isPending}
      onSave={saveLineup}
    />
  );
}

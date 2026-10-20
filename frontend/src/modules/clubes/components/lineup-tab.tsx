import { RefreshCw, ServerOff } from 'lucide-react';
import { toast } from 'sonner';
import { ListState } from '@/components/list-state';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
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
      <ListState
        icon={ServerOff}
        title="Não foi possível carregar a escalação"
        description={error.message}
        action={
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw />
            Tentar de novo
          </Button>
        }
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

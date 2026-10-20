import { RefreshCw, ServerOff } from 'lucide-react';
import { toast } from 'sonner';
import { ListState } from '@/components/list-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
    return (
      <section className="space-y-3 rounded-xl border border-zinc-200 p-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <p className="text-sm text-zinc-500">Carregando...</p>
      </section>
    );
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

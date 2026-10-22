import { useNavigate } from '@tanstack/react-router';
import { Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ErrorState } from '@/components/error-state';
import { ListState } from '@/components/list-state';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { formatCurrency } from '@/lib/format';
import { ClubsTable } from '../components/clubs-table';
import { CreateClubDialog } from '../components/create-club-dialog';
import { useClubsQueries } from '../hooks/useClubsQueries';
import type { Club, ClubSort } from '../types/clubs.types';

export default function ClubsPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [sort, setSort] = useState<ClubSort>('name');
  const { useGetClubs } = useClubsQueries();
  const {
    data: clubs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClubs(sort);
  const isEmpty = !isLoading && !isError && clubs.length === 0;
  const showTable = !isError && !isEmpty;

  function handleCreated(club: Club) {
    setIsCreating(false);
    toast.success('Clube criado', {
      description: `${club.name} (${club.acronym}) começa com ${formatCurrency(club.cash)} em caixa.`,
    });
    navigate({ to: '/clubs/$clubId', params: { clubId: String(club.id) } });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shield}
        title="Clubes"
        subtitle="Cada clube começa com 300,00 em caixa e sem jogadores. A liga aceita no máximo 20 clubes."
        actions={
          <Button
            type="button"
            className="h-10 gap-2 px-4"
            onClick={() => setIsCreating(true)}
          >
            <Plus />
            Novo clube
          </Button>
        }
      />

      {isError && (
        <ErrorState
          title="Não foi possível carregar os clubes"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {isEmpty && (
        <ListState
          icon={Shield}
          title="Nenhum clube cadastrado"
          description="Crie o primeiro clube para começar."
          action={
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setIsCreating(true)}
            >
              <Plus />
              Novo clube
            </Button>
          }
        />
      )}

      {showTable && (
        <ClubsTable
          clubs={clubs}
          sort={sort}
          onSortChange={setSort}
          isLoading={isLoading}
        />
      )}

      {isCreating && (
        <CreateClubDialog
          onClose={() => setIsCreating(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

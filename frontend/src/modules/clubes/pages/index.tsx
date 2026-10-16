import { useNavigate } from '@tanstack/react-router';
import { Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { formatCurrency } from '@/lib/format';
import { ClubsTable } from '../components/clubs-table';
import { CreateClubDialog } from '../components/create-club-dialog';
import { CLUBS_MOCK } from '../mocks/clubs.mock';
import type { Club } from '../types/clubs.types';

export default function ClubsPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  // simulacao
  // Mostra o aviso e abre a página do clube dos dados fixos
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

      <ClubsTable clubs={CLUBS_MOCK} />

      {isCreating && (
        <CreateClubDialog
          onClose={() => setIsCreating(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

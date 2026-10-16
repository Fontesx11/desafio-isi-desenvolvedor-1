import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';

export default function PlayersPage() {
  return (
    <PageHeader
      icon={Users}
      title="Jogadores"
      subtitle="Cadastre jogadores, acompanhe os indicadores e compre os que estão livres."
      actions={
        <Button type="button" className="h-10 gap-2 px-4">
          <Plus />
          Novo jogador
        </Button>
      }
    />
  );
}

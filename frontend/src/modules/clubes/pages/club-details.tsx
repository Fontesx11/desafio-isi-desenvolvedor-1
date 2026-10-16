import { useLoaderData } from '@tanstack/react-router';
import { ClipboardList, History, Shirt, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClubAcronym } from '../components/club-acronym';
import { ClubStats } from '../components/club-stats';
import { SquadTable } from '../components/squad-table';

export default function ClubDetailsPage() {
  const { club } = useLoaderData({ from: '/_app/clubs/$clubId' });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ClubAcronym acronym={club.acronym} className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{club.name}</h1>
          <Badge variant="outline">Sigla {club.acronym}</Badge>
        </div>
        {/* simulacao: botão sem ação até a etapa de Compra */}
        <Button type="button" className="h-10 gap-2 px-4">
          <ShoppingCart />
          Comprar jogadores
        </Button>
      </div>

      <ClubStats club={club} />

      {/* Escalação e Histórico entram nas etapas próprias (F12 e F09-F11) */}
      <Tabs defaultValue="squad" className="gap-4">
        <TabsList variant="line" className="w-full justify-start border-b">
          <TabsTrigger value="squad" className="flex-none px-3">
            <Shirt />
            Elenco
          </TabsTrigger>
          <TabsTrigger value="lineup" className="flex-none px-3" disabled>
            <ClipboardList />
            Escalação
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-none px-3" disabled>
            <History />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="squad">
          <SquadTable players={club.players} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useLoaderData } from '@tanstack/react-router';
import { ClipboardList, History, Shirt, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClubAcronym } from '../components/club-acronym';
import { ClubStats } from '../components/club-stats';
import { LineupTab } from '../components/lineup-tab';
import { SaleResultDialog } from '../components/sale-result-dialog';
import { SellPlayerDialog } from '../components/sell-player-dialog';
import { SquadTable } from '../components/squad-table';
import { TransactionsTab } from '../components/transactions-tab';
import type { SaleResult, SquadPlayer } from '../types/clubs.types';

// Qual modal da venda está aberto
type SalePanel =
  { type: 'sell'; player: SquadPlayer } | { type: 'sold'; result: SaleResult };

export default function ClubDetailsPage() {
  const { club } = useLoaderData({ from: '/_app/clubs/$clubId' });
  const [tab, setTab] = useState('squad');
  const [salePanel, setSalePanel] = useState<SalePanel | null>(null);

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

      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList variant="line" className="w-full justify-start border-b">
          <TabsTrigger value="squad" className="flex-none px-3">
            <Shirt />
            Elenco
          </TabsTrigger>
          <TabsTrigger value="lineup" className="flex-none px-3">
            <ClipboardList />
            Escalação
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-none px-3">
            <History />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="squad">
          <SquadTable
            players={club.players}
            onSell={(player) => setSalePanel({ type: 'sell', player })}
          />
        </TabsContent>

        <TabsContent value="lineup">
          {/* key: ao trocar de clube, a aba começa da escalação do novo clube */}
          <LineupTab key={club.id} club={club} />
        </TabsContent>

        <TabsContent value="history">
          <TransactionsTab key={club.id} clubId={club.id} />
        </TabsContent>
      </Tabs>

      {salePanel?.type === 'sell' && (
        <SellPlayerDialog
          player={salePanel.player}
          clubName={club.name}
          onClose={() => setSalePanel(null)}
          onSold={(result) => setSalePanel({ type: 'sold', result })}
        />
      )}
      {salePanel?.type === 'sold' && (
        <SaleResultDialog
          result={salePanel.result}
          clubName={club.name}
          onClose={() => setSalePanel(null)}
          onShowHistory={() => {
            setSalePanel(null);
            setTab('history');
          }}
        />
      )}
    </div>
  );
}

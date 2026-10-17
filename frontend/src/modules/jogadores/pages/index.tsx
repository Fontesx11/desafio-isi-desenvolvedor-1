import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { BuyPlayerDialog } from '../components/buy-player-dialog';
import { ChangeConditionDialog } from '../components/change-condition-dialog';
import { CreatePlayerDialog } from '../components/create-player-dialog';
import { DeletePlayerDialog } from '../components/delete-player-dialog';
import { EditPlayerDialog } from '../components/edit-player-dialog';
import { PlayerCreatedDialog } from '../components/player-created-dialog';
import { PlayerDetailsSheet } from '../components/player-details-sheet';
import { PlayersFilters } from '../components/players-filters';
import { PlayersTable } from '../components/players-table';
import { PurchaseResultDialog } from '../components/purchase-result-dialog';
import { PAGE_SIZE } from '../constants/players.constants';
import type {
  Player,
  PlayerAction,
  PlayersTab,
  PurchaseResult,
} from '../types/players.types';
import { usePlayersQueries } from '../hooks/usePlayersQueries';

type OpenPanel =
  | { type: 'create' }
  | { type: PlayerAction | 'created'; player: Player }
  | { type: 'purchased'; player: Player; result: PurchaseResult };

export default function PlayersPage() {
  const [tab, setTab] = useState<PlayersTab>('all');
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<OpenPanel | null>(null);

  const { useGetPlayers } = usePlayersQueries();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  if (tab === 'free') params.set('free', 'true');
  const { data: playersPage } = useGetPlayers(params.toString());

  const { data: allPage } = useGetPlayers('limit=1');
  const { data: freePage } = useGetPlayers('limit=1&free=true');
  const allCount = allPage?.meta.total_items ?? 0;
  const freeCount = freePage?.meta.total_items ?? 0;
  const counts: Record<PlayersTab, number> = {
    all: allCount,
    free: freeCount,
    'in-clubs': allCount - freeCount,
  };
  const pagePlayers = playersPage?.data ?? [];

  function changeTab(next: PlayersTab) {
    setTab(next);
    setPage(1);
  }

  function openAction(action: PlayerAction, player: Player) {
    setPanel({ type: action, player });
  }

  function closePanel() {
    setPanel(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Jogadores"
        subtitle="Cadastre jogadores, acompanhe os indicadores e compre os que estão livres."
        actions={
          <Button
            type="button"
            className="h-10 gap-2 px-4"
            onClick={() => setPanel({ type: 'create' })}
          >
            <Plus />
            Novo jogador
          </Button>
        }
      />

      <PlayersFilters isClubFilterDisabled={tab === 'free'} />

      <PlayersTable
        players={pagePlayers}
        total={playersPage?.meta.total_items ?? 0}
        counts={counts}
        tab={tab}
        onTabChange={changeTab}
        page={page}
        onPageChange={setPage}
        onAction={openAction}
      />

      {panel?.type === 'create' && (
        <CreatePlayerDialog
          onClose={closePanel}
          onCreated={(player) => setPanel({ type: 'created', player })}
        />
      )}
      {panel?.type === 'created' && (
        <PlayerCreatedDialog
          player={panel.player}
          onClose={closePanel}
          onShowDetails={() => openAction('details', panel.player)}
        />
      )}
      {panel?.type === 'details' && (
        <PlayerDetailsSheet
          player={panel.player}
          onClose={closePanel}
          onAction={openAction}
        />
      )}
      {panel?.type === 'edit' && (
        <EditPlayerDialog player={panel.player} onClose={closePanel} />
      )}
      {panel?.type === 'condition' && (
        <ChangeConditionDialog player={panel.player} onClose={closePanel} />
      )}
      {panel?.type === 'delete' && (
        <DeletePlayerDialog player={panel.player} onClose={closePanel} />
      )}
      {panel?.type === 'buy' && (
        <BuyPlayerDialog
          player={panel.player}
          onClose={closePanel}
          onPurchased={(result) =>
            setPanel({ type: 'purchased', player: panel.player, result })
          }
        />
      )}
      {panel?.type === 'purchased' && (
        <PurchaseResultDialog
          player={panel.player}
          result={panel.result}
          onClose={closePanel}
        />
      )}
    </div>
  );
}

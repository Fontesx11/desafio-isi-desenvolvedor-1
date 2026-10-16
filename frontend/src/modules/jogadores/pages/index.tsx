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
import { PLAYERS_MOCK } from '../mocks/players.mock';
import type {
  Player,
  PlayerAction,
  PlayersTab,
  PurchaseResult,
} from '../types/players.types';
import { isFreePlayer } from '../utils/players.utils';

// Qual modal ou painel está aberto, e para qual jogador
type OpenPanel =
  | { type: 'create' }
  | { type: PlayerAction | 'created'; player: Player }
  | { type: 'purchased'; player: Player; result: PurchaseResult };

export default function PlayersPage() {
  const [tab, setTab] = useState<PlayersTab>('all');
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<OpenPanel | null>(null);

  // Sem a API, as abas e a paginação usam os dados fixos
  const counts: Record<PlayersTab, number> = {
    all: PLAYERS_MOCK.length,
    free: PLAYERS_MOCK.filter(isFreePlayer).length,
    'in-clubs': PLAYERS_MOCK.filter((player) => !isFreePlayer(player)).length,
  };
  const tabPlayers = PLAYERS_MOCK.filter(
    (player) => tab === 'all' || (tab === 'free') === isFreePlayer(player),
  );
  const pagePlayers = tabPlayers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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
        total={tabPlayers.length}
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

import type { PurchaseResult } from '@/modules/mercado/types/market.types';
import type { Player, PlayerAction } from '../types/players.types';
import { BuyPlayerDialog } from './buy-player-dialog';
import { ChangeConditionDialog } from './change-condition-dialog';
import { CreatePlayerDialog } from './create-player-dialog';
import { DeletePlayerDialog } from './delete-player-dialog';
import { EditPlayerDialog } from './edit-player-dialog';
import { PlayerCreatedDialog } from './player-created-dialog';
import { PlayerDetailsSheet } from './player-details-sheet';
import { PurchaseResultDialog } from './purchase-result-dialog';

export type OpenPanel =
  | { type: 'create' }
  | { type: PlayerAction | 'created'; player: Player }
  | { type: 'purchased'; player: Player; result: PurchaseResult };

type PlayersPanelsProps = {
  panel: OpenPanel | null;
  onPanelChange: (panel: OpenPanel | null) => void;
};

export function PlayersPanels({ panel, onPanelChange }: PlayersPanelsProps) {
  const closePanel = () => onPanelChange(null);
  const openAction = (action: PlayerAction, player: Player) =>
    onPanelChange({ type: action, player });

  switch (panel?.type) {
    case 'create':
      return (
        <CreatePlayerDialog
          onClose={closePanel}
          onCreated={(player) => onPanelChange({ type: 'created', player })}
        />
      );
    case 'created':
      return (
        <PlayerCreatedDialog
          player={panel.player}
          onClose={closePanel}
          onShowDetails={() => openAction('details', panel.player)}
        />
      );
    case 'details':
      return (
        <PlayerDetailsSheet
          player={panel.player}
          onClose={closePanel}
          onAction={openAction}
        />
      );
    case 'edit':
      return <EditPlayerDialog player={panel.player} onClose={closePanel} />;
    case 'condition':
      return (
        <ChangeConditionDialog player={panel.player} onClose={closePanel} />
      );
    case 'delete':
      return <DeletePlayerDialog player={panel.player} onClose={closePanel} />;
    case 'buy':
      return (
        <BuyPlayerDialog
          player={panel.player}
          onClose={closePanel}
          onPurchased={(result) =>
            onPanelChange({ type: 'purchased', player: panel.player, result })
          }
        />
      );
    case 'purchased':
      return (
        <PurchaseResultDialog
          player={panel.player}
          result={panel.result}
          onClose={closePanel}
        />
      );
    default:
      return null;
  }
}

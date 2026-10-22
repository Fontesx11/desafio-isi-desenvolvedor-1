import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { ActiveFilters } from '../components/active-filters';
import { PlayersFilters } from '../components/players-filters';
import { PlayersPanels, type OpenPanel } from '../components/players-panels';
import { PlayersTable } from '../components/players-table';
import { usePlayersFilters } from '../hooks/usePlayersFilters';
import { usePlayersList } from '../hooks/usePlayersList';
import type { Player, PlayerAction } from '../types/players.types';

export default function PlayersPage() {
  const [panel, setPanel] = useState<OpenPanel | null>(null);
  const { filters, updateFilters, clearFilters, page, setPage, queryParams } =
    usePlayersFilters();
  const { players, total, totalPages, counts, isLoading, error, refetch } =
    usePlayersList(queryParams);

  const lastPage = Math.max(1, totalPages ?? page);
  if (page > lastPage) {
    setPage(lastPage);
  }

  function openAction(action: PlayerAction, player: Player) {
    setPanel({ type: action, player });
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

      <PlayersFilters
        search={filters.search}
        onSearchChange={(search) => updateFilters({ search })}
        position={filters.position}
        onPositionChange={(position) => updateFilters({ position })}
        condition={filters.condition}
        onConditionChange={(condition) => updateFilters({ condition })}
        clubId={filters.clubId}
        onClubChange={(clubId) => updateFilters({ clubId })}
        age={filters.age}
        onAgeChange={(age) => updateFilters({ age })}
        marketValue={filters.marketValue}
        onMarketValueChange={(marketValue) => updateFilters({ marketValue })}
        isClubFilterDisabled={filters.tab === 'free'}
      />

      <ActiveFilters
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {error && (
        <ErrorState
          title="Não foi possível carregar os jogadores"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!error && (
        <PlayersTable
          players={players}
          total={total}
          counts={counts}
          tab={filters.tab}
          onTabChange={(tab) => updateFilters({ tab })}
          page={page}
          onPageChange={setPage}
          onAction={openAction}
          sort={filters.sort}
          onSortChange={(sort) => updateFilters({ sort })}
          isLoading={isLoading}
        />
      )}

      <PlayersPanels panel={panel} onPanelChange={setPanel} />
    </div>
  );
}

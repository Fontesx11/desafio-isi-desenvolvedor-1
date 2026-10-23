import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { PlayersTable } from '../components/players-table';
import type { Player } from '../types/players.types';

vi.mock('@/modules/clubes/hooks/useClubsQueries', () => ({
  useClubsQueries: () => ({
    useGetClubs: () => ({
      data: [{ id: 1, name: 'Águias FC', acronym: 'AGU' }],
    }),
  }),
}));

const player: Player = {
  id: 1,
  name: 'Rafael Lima',
  position: 'ATA',
  agility: 70,
  age: 24,
  condition: 'APTO',
  pace: 80,
  shooting: 75,
  passing: 70,
  dribbling: 72,
  defending: 40,
  physical: 68,
  potential: 85,
  overall: 72,
  base_value: 30,
  market_value: 37,
  club_id: null,
};

function renderTable(players: Player[], onAction = vi.fn()) {
  render(
    <PlayersTable
      players={players}
      total={players.length}
      counts={{ all: 1, free: 1, 'in-clubs': 0 }}
      tab="all"
      onTabChange={vi.fn()}
      page={1}
      onPageChange={vi.fn()}
      onAction={onAction}
      sort="name"
      onSortChange={vi.fn()}
      isLoading={false}
    />,
  );
}

test('shows a free player with the market value in reais and buys on click', () => {
  const onAction = vi.fn();
  renderTable([player], onAction);

  fireEvent.click(screen.getByRole('button', { name: 'Comprar' }));

  expect(screen.getByText('37,00')).toBeInTheDocument();
  expect(screen.getByText('Livre')).toBeInTheDocument();
  expect(onAction).toHaveBeenCalledWith('buy', player);
});

test('shows the club of a player under contract and hides the buy button', () => {
  renderTable([{ ...player, club_id: 1 }]);

  expect(screen.getByText('Águias FC')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Comprar' }),
  ).not.toBeInTheDocument();
});

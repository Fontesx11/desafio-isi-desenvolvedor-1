import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { ClubsTable } from '../components/clubs-table';
import type { Club } from '../types/clubs.types';

const aguias: Club = {
  id: 1,
  name: 'Águias FC',
  acronym: 'AGU',
  cash: 261.15,
  squad_value: 37,
  net_worth: 298.15,
};

test('shows Águias FC with cash, squad value and net worth in reais', () => {
  render(
    <ClubsTable
      clubs={[aguias]}
      sort="name"
      onSortChange={vi.fn()}
      isLoading={false}
    />,
  );

  expect(screen.getByText('Águias FC')).toBeInTheDocument();
  expect(screen.getByText('261,15')).toBeInTheDocument();
  expect(screen.getByText('37,00')).toBeInTheDocument();
  expect(screen.getByText('298,15')).toBeInTheDocument();
});

test('shows the empty message when there are no clubs', () => {
  render(
    <ClubsTable
      clubs={[]}
      sort="name"
      onSortChange={vi.fn()}
      isLoading={false}
    />,
  );

  expect(screen.getByText('Nenhum clube encontrado.')).toBeInTheDocument();
});

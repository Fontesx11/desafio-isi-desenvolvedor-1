import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import ClubsPage from '../pages';

const useGetClubs = vi.fn();

vi.mock('../hooks/useClubsQueries', () => ({
  useClubsQueries: () => ({ useGetClubs }),
}));

test('shows the empty state when no club is registered', () => {
  useGetClubs.mockReturnValue({ data: [], isLoading: false, isError: false });

  render(<ClubsPage />);

  expect(screen.getByText('Nenhum clube cadastrado')).toBeInTheDocument();
});

test('shows the API error and tries again on click', () => {
  const refetch = vi.fn();
  useGetClubs.mockReturnValue({
    data: [],
    isLoading: false,
    isError: true,
    error: new Error('Network Error'),
    refetch,
  });

  render(<ClubsPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));

  expect(screen.getByText('Network Error')).toBeInTheDocument();
  expect(refetch).toHaveBeenCalled();
});

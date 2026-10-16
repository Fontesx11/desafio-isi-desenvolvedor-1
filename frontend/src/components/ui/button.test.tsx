import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Button } from './button';

test('renders the button label', () => {
  render(<Button>Salvar</Button>);

  expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
});

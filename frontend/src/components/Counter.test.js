import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('le compteur incrémente et ne descend pas sous 0', () => {
  render(<Counter />);
  const plus = screen.getByRole('button', { name: '+' });
  const minus = screen.getByRole('button', { name: '-' });

  fireEvent.click(plus);
  fireEvent.click(plus);
  expect(screen.getByText('Valeur : 2')).toBeInTheDocument();

  fireEvent.click(minus);
  fireEvent.click(minus);
  fireEvent.click(minus);
  expect(screen.getByText('Valeur : 0')).toBeInTheDocument();
});

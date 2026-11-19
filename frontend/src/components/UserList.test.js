import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserList from './UserList';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
  getErrorMessage: () => 'Impossible de joindre le serveur',
}));

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

beforeEach(() => jest.clearAllMocks());

test('affiche "Chargement..." puis la liste des utilisateurs', async () => {
  api.get.mockResolvedValue({ data: users });
  render(<UserList />);

  expect(screen.getByText('Chargement...')).toBeInTheDocument();
  expect(await screen.findByText('Alice - alice@example.com')).toBeInTheDocument();
  expect(screen.getByText('Bob - bob@example.com')).toBeInTheDocument();
});

test('supprime un utilisateur avec le bouton Supprimer', async () => {
  api.get.mockResolvedValue({ data: users });
  api.delete.mockResolvedValue({});
  render(<UserList />);

  await screen.findByText('Alice - alice@example.com');
  fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0]);

  expect(api.delete).toHaveBeenCalledWith('/users/1');
  await waitFor(() =>
    expect(screen.queryByText('Alice - alice@example.com')).not.toBeInTheDocument()
  );
});

test('affiche une alerte Bootstrap si le backend ne répond pas', async () => {
  api.get.mockRejectedValue(new Error('Network Error'));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<UserList />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de joindre le serveur');
});

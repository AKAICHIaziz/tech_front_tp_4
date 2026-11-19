import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from './UserForm';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
  getErrorMessage: () => 'erreur',
}));

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

test('affiche une alerte si le nom est vide', () => {
  render(<UserForm />);
  fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));
  expect(window.alert).toHaveBeenCalledWith('Le champ ne peut pas être vide !');
  expect(api.post).not.toHaveBeenCalled();
});

test("envoie l'utilisateur au backend avec axios.post", async () => {
  api.post.mockResolvedValue({ data: { id: 3, name: 'Carol', email: 'carol@example.com' } });
  render(<UserForm />);

  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Carol' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'carol@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));

  expect(api.post).toHaveBeenCalledWith('/users', { name: 'Carol', email: 'carol@example.com' });
  expect(await screen.findByText(/utilisateur #3 créé/)).toBeInTheDocument();
});

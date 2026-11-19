import { render, screen } from '@testing-library/react';
import App from './App';

test("affiche la page d'accueil avec le header et le footer", () => {
  render(<App />);
  expect(screen.getByText(/Bienvenue sur notre application React/i)).toBeInTheDocument();
  expect(screen.getByText('Mon App')).toBeInTheDocument();
  expect(screen.getByText(/Tous droits réservés/i)).toBeInTheDocument();
});

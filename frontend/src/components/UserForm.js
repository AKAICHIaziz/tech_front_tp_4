import { useState } from 'react';
import api, { getErrorMessage } from '../api';

const UserForm = () => {
  const [input, setInput] = useState(''); // nom saisi
  const [email, setEmail] = useState(''); // bonus : email pour créer l'utilisateur côté backend
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      alert('Le champ ne peut pas être vide !');
      return;
    }

    setMessage(`Vous avez saisi : ${input}`); // backticks pour l'interpolation

    // Bonus : envoi au backend via axios.post
    if (!email.trim()) {
      setError("Ajoutez un email pour enregistrer l'utilisateur sur le serveur.");
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/users', { name: input.trim(), email: email.trim() });
      setMessage(`Vous avez saisi : ${input} — utilisateur #${res.data.id} créé sur le serveur.`);
      setInput('');
      setEmail('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Formulaire</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name" className="form-label">Nom</label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <label htmlFor="email" className="form-label mt-2">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-2" disabled={sending}>
          {sending ? 'Envoi...' : 'Soumettre'}
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
    </div>
  );
};

export default UserForm;

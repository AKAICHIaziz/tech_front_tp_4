import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(getErrorMessage(err)); // bonus : erreur visuelle
        setLoading(false);
      });
  }, []); // ← tableau vide = exécuter une seule fois au montage

  // Bonus : suppression via DELETE /api/users/:id
  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Liste des utilisateurs</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className="list-group">
          {users.map(user => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{user.name} - {user.email}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                Supprimer
              </button>
            </li>
          ))}
          {!error && users.length === 0 && (
            <li className="list-group-item text-muted">Aucun utilisateur.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserList;

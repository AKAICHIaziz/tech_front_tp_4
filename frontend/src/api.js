import axios from 'axios';

// URL du backend Express (modifiable via REACT_APP_API_URL dans un fichier .env)
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Transforme une erreur Axios en message lisible pour l'utilisateur
export const getErrorMessage = (err) => {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.request && !err.response) {
    return `Impossible de joindre le serveur (${API_URL}). Le backend est-il lancé ?`;
  }
  return 'Une erreur inattendue est survenue.';
};

export default api;

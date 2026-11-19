const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // autorise les appels cross-origin (3000 -> 5000)
app.use(express.json()); // permet de lire le JSON envoyé par le front

// Route GET : liste des utilisateurs
app.get('/api/users', (req, res) => {
  res.json(db.getAllUsers());
});

// Bonus : route POST pour créer un utilisateur
app.post('/api/users', (req, res) => {
  const name = (req.body?.name || '').trim();
  const email = (req.body?.email || '').trim();

  if (!name || !email) {
    return res.status(400).json({ error: 'Les champs "name" et "email" sont obligatoires.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "L'adresse email n'est pas valide." });
  }

  try {
    const user = db.createUser(name, email);
    res.status(201).json(user);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Bonus : route DELETE pour supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identifiant invalide.' });
  }
  const deleted = db.deleteUser(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }
  res.status(204).end();
});

// Démarrage du serveur (seulement si on lance ce fichier directement, pas dans les tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;

# TP 4 — Application React + Node.js

Application web complète : un **backend** Express (port 5000) qui expose une API JSON, et un **frontend** React (port 3000) qui la consomme avec Axios, stylisé avec Bootstrap et navigable avec React Router.

```
tp4/
├── backend/            # Node.js + Express + CORS (+ SQLite en bonus)
│   ├── server.js       # routes /api/users (GET, POST, DELETE)
│   └── db.js           # base SQLite (node:sqlite), seed Alice & Bob
└── frontend/           # create-react-app
    └── src/
        ├── components/ # Header, Footer, Counter, UserForm, UserList
        ├── pages/      # Home, About
        ├── api.js      # instance Axios + messages d'erreur
        ├── App.js      # routes React Router v6
        └── index.js    # import Bootstrap
```

## Prérequis

Node **22.13+** (le backend utilise le module natif `node:sqlite`) :

```powershell
nvm use 22.22.1
```

## Installation

```powershell
cd backend; npm install
cd ../frontend; npm install
```

## Lancer le projet (2 terminaux)

Terminal 1 — backend :

```powershell
cd backend
npm run dev
```

Terminal 2 — frontend :

```powershell
cd frontend
npm start
```

## Vérification

| URL | Résultat attendu |
|---|---|
| http://localhost:3000/ | Page d'accueil + Header + Footer |
| http://localhost:3000/about | Page À propos |
| http://localhost:3000/counter | Compteur +/- (ne descend pas sous 0) |
| http://localhost:3000/form | Formulaire, alerte si le nom est vide |
| http://localhost:3000/users | Liste Alice & Bob chargée depuis le backend |
| http://localhost:5000/api/users | JSON brut des utilisateurs |

## Tests

Backend — test runner intégré de Node, base SQLite en mémoire (5 tests : GET, POST, validation 400, doublon 409, DELETE/404) :

```powershell
cd backend
npm test
```

Frontend — Jest + React Testing Library, API mockée (7 tests : rendu de l'app, compteur, alerte du formulaire, `axios.post`, chargement de la liste, suppression, alerte d'erreur) :

```powershell
cd frontend
npm test -- --watchAll=false
```

## API

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/users` | Liste des utilisateurs |
| POST | `/api/users` | Crée un utilisateur `{ name, email }` → 201 (400 si invalide, 409 si email déjà pris) |
| DELETE | `/api/users/:id` | Supprime un utilisateur → 204 (404 si introuvable) |

## Bonus réalisés

- Route `POST /api/users` + `UserForm` connecté via `axios.post`
- Route `DELETE /api/users/:id` + bouton « Supprimer » dans `UserList`
- Erreurs affichées avec des alertes Bootstrap (backend éteint, validation…)
- Données stockées dans une vraie base **SQLite** (`backend/database.sqlite`, créée au démarrage)

## Corrections apportées au document

- `res.json({ { id: 1... } })` → tableau `res.json([ ... ])`
- `0 =>` → `() =>` dans les composants
- `useState()` → `useState("")` pour le champ du formulaire
- `'Vous avez saisi : ${input}'` → template literal avec backticks
- Suppression des `</li> ))) </ul> })` orphelins dans `UserList`

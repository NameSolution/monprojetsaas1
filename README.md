# HotelBot AI - Assistant Virtuel Hôtelier (Prêt pour PostgreSQL Local & Backend Personnalisé)

HotelBot AI est une plateforme SaaS (Software as a Service) fullstack conçue pour permettre aux hôtels de déployer leur propre assistant virtuel intelligent. Cet assistant est multilingue et entièrement personnalisable. **Le projet s'appuie sur un backend Express et une base de données PostgreSQL.**

## ✨ Fonctionnalités Principales (Interface Utilisateur)

HotelBot AI offre une suite complète d'outils répartis sur plusieurs interfaces :

- **Présentation Professionnelle** : Vitrine de la solution HotelBot AI.
- **Démo Interactive** : Permet de tester un chatbot de démonstration.
- **Informations Claires** : Sections dédiées aux fonctionnalités, tarifs, FAQ et contact.
- **Appel à l'Action (CTA)**.

Interface de gestion centralisée pour les administrateurs de la plateforme HotelBot AI.
- **Vue d'Ensemble (Dashboard)** : Statistiques globales.
- **Gestion des Hôtels** : CRUD des comptes hôtels.
- **Gestion des Utilisateurs** : CRUD des comptes utilisateurs.
- **Support Tickets** : Visualisation et gestion des tickets.
- **Analytics Globales** : Données agrégées.
- **Facturation (Billing)** : Consultation des factures.
- **Système IA (Monitoring & Configuration)** : Monitoring et configuration.
- **Paramètres Généraux** : Configuration des clés API, etc.

### 3. Dashboard Client Hôtel (`/client`)
Espace dédié à chaque hôtel pour gérer et personnaliser son propre assistant virtuel.
- **Vue d'Ensemble (Dashboard)** : Statistiques clés.
- **Personnalisation de l'Apparence** : Modification du nom, message d'accueil, couleur, logo.
- **Base de Connaissances (LLM Memory)** : CRUD pour les informations.
- **Gestion des Langues** : Activation/Désactivation des langues.
- **QR Code & Lien Public** : Génération et personnalisation.
- **Analytics** : Données d'analyse.
- **Paramètres & Compte** : Modification des informations.
- **Documentation**.

### 4. Interface Chatbot Publique (`/bot/:slug`)
Interface utilisateur finale avec laquelle les clients de l'hôtel interagissent.
- **Interaction Intuitive** : Réponses du bot.
- **Affichage Personnalisé** : Reprend les configurations de l'hôtel.
Les routes `/api/chatbot/ask` et `/api/chatbot/interactions` délèguent désormais la requête à votre modèle IA (défini par `AI_API_URL`) puis enregistrent chaque échange dans la table `interactions`.
La route `/api/billing/session` crée une session Stripe à l'aide de votre clé `STRIPE_SECRET` et renvoie l'URL de paiement.

## 🧠 Intelligence Artificielle & Fonctionnement (Conceptuel)

- **Modèle de Langage (LLM)** : Conçu pour interagir avec un LLM via votre backend personnalisé.
- **Base de Connaissances Spécifique à l'Hôtel** : Chaque hôtel alimentera sa propre base de données via votre backend.
- **Logique Backend** : Votre backend recevra la question, la langue, et l'ID de l'hôtel. Il interrogera la base de connaissances de l'hôtel et/ou le LLM pour formuler une réponse.

## ⚙️ Architecture Technique (Frontend)

- **Frontend** :
    - **React 18.2.0**
    - **Vite**
    - **React Router 6.16.0**
    - **TailwindCSS 3.3.2**
    - **shadcn/ui**
    - **Lucide React 0.292.0**
    - **Framer Motion 10.16.4**
    - **Recharts**
- **Backend & Base de Données (À Développer par Vos Soins)** :
    - **Authentification** : Gérée par le backend Express.
    - **Base de Données PostgreSQL Locale** : Vous devrez configurer et gérer votre propre instance PostgreSQL.
    - **Stockage de Fichiers** : À gérer par votre backend (ex: pour les logos).
    - **API Backend** : Pour toute la logique métier, interaction avec la base de données et le LLM.
- **Structure des Fichiers Frontend** :
    - `src/pages/` : Composants de page principaux.
    - `src/components/` : Composants réutilisables.
    - `src/hooks/` : Hooks personnalisés (ex: `useClientData`, `useSuperAdminData`).
    - `src/services/` : Logique d'interaction avec l'API Express.
        - `src/services/modules/` : Modules de service spécifiques.
    - `src/lib/` : Utilitaires (ex: `authContext.jsx` pour l'authentification, `cn`).
    - `src/database/` : Contient la structure de dossiers pour votre future base de données PostgreSQL locale.
        - `src/database/config/` : Pour vos configurations de connexion.
        - `src/database/migrations/` : Pour vos scripts de migration SQL.
        - `src/database/schemas/` : Pour vos définitions de schémas ou types de données.

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** : Version 18 ou supérieure.
- **Git** : Pour cloner le projet.

### Installation
1.  **Clonez le projet**.
2.  **Installez les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancez le serveur de développement** :
    ```bash
    npm run dev
    ```
    Les requêtes commençant par `/api` seront automatiquement
    proxyfées vers le backend Express sur le port `5000`.
    L'application sera accessible à `http://localhost:5173`.

### Comptes de Test
Utilisez les identifiants suivants sur la page de connexion :
- **Superadmin** :
    - Email: `superadmin@example.com`
    - Mot de passe: `password`
- **Administrateur Client (Hôtel)** :
    - Email: `clientadmin@example.com`
    - Mot de passe: `password`
- **Manager Client (Hôtel)** :
    - Email: `clientmanager@example.com`
    - Mot de passe: `password`

## 🗃️ Structure Cible de la Base de Données PostgreSQL Locale

Voici un aperçu des tables principales que votre backend et votre base de données PostgreSQL locale devront gérer. Ces définitions servent de guide.

1.  **`profiles`**
    -   `id` (UUID, Primary Key) : identifiant du profil.
    -   `user_id` (UUID, Unique, Foreign Key vers `users.id`).
    -   `name` (TEXT).
    -   `role` (TEXT) : `superadmin`, `admin`, `manager`.
    -   `hotel_id` (UUID, Foreign Key vers `hotels.id`, NULL pour superadmins).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

2.  **`hotels`**
    -   `id` (UUID, Primary Key).
    -   `user_id` (UUID, Foreign Key vers `users.id`): Admin principal de l'hôtel.
    -   `name` (TEXT).
    -   `slug` (TEXT, Unique).
    -   `plan_id` (UUID, Foreign Key vers `plans.id`).
    -   `status` (TEXT): (`active`, `suspended`, `pending`).
    -   `logo_url` (TEXT): URL du logo (géré par votre backend/stockage).
    -   `theme_color` (TEXT).
    -   `welcome_message` (JSONB): Messages d'accueil par langue.
    -   `default_lang_code` (TEXT, Foreign Key vers `languages.code`).
    -   `contact_name` (TEXT).
    -   `contact_email` (TEXT).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

3.  **`plans`**
    -   `id` (UUID, Primary Key).
    -   `name` (TEXT).
    -   `price_monthly` (NUMERIC).
    -   `features` (JSONB).

4.  **`languages`**
    -   `code` (TEXT, Primary Key): (ex: "fr", "en").
    -   `name` (TEXT): (ex: "Français", "English").

5.  **`hotel_languages`** (Table de liaison)
    -   `hotel_id` (UUID, PK, FK vers `hotels.id`).
    -   `lang_code` (TEXT, PK, FK vers `languages.code`).
    -   `is_active` (BOOLEAN).

6.  **`knowledge_items`**
    -   `id` (UUID, PK).
    -   `hotel_id` (UUID, FK vers `hotels.id`).
    -   `info` (TEXT).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

7.  **`interactions`** (Conversations du chatbot)
    -   `id` (BIGINT, PK, auto-increment).
    -   `hotel_id` (UUID, FK vers `hotels.id`).
    -   `session_id` (UUID).
    -   `timestamp` (TIMESTAMPTZ).
    -   `lang_code` (TEXT, FK vers `languages.code`).
    -   `user_input` (TEXT).
    -   `bot_response` (TEXT).
    -   `intent_detected` (TEXT, optionnel).
    -   `confidence_score` (DOUBLE PRECISION, optionnel).
    -   `feedback` (SMALLINT, optionnel).

8.  **`support_tickets`**
    -   `id` (BIGINT, PK, auto-increment).
    -   `user_id` (UUID, FK vers `users.id`, optionnel).
    -   `hotel_id` (UUID, FK vers `hotels.id`, optionnel).
    -   `submitter_name` (TEXT).
    -   `submitter_email` (TEXT).
    -   `subject` (TEXT).
    -   `message` (TEXT).
    -   `status` (TEXT): (`Nouveau`, `En cours`, `Résolu`, `Fermé`).
    -   `priority` (TEXT): (`Basse`, `Moyenne`, `Haute`).
    -   `assigned_to_user_id` (UUID, FK vers `users.id`, optionnel).
    -   `internal_notes` (TEXT, optionnel).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

9.  **`settings`**
    - `id` (UUID, Primary Key)
    - `tenant_id` (INT)
    - `key` (TEXT, Unique)
    - `value` (TEXT)
    - `created_at` (TIMESTAMPTZ)
    - `updated_at` (TIMESTAMPTZ)

## 🚀 Installation Rapide

### Prérequis
- Node.js (version 18+)
- PostgreSQL (version 12+)

### Installation automatique
```bash
# Windows
./setup.bat

# Linux/Mac
chmod +x setup.sh && ./setup.sh
```

### Installation manuelle
```bash
npm install
node server/seed.cjs
npm run build
npm start
```
Before running the server copy `.env.example` to `.env` and adjust the values.  At minimum `JWT_SECRET` and `STRIPE_SECRET` must be set so authentication and billing work correctly. `AI_API_URL` and `AI_MODEL` configure the LLM endpoint.  By default they target OpenRouter at `https://openrouter.ai/api/v1` using the `google/gemma-3n-e4b-it:free` model.  Update `DB_USER` and `DB_PASSWORD` if your local PostgreSQL credentials differ from the defaults.  The seed script also creates a `hotel_customizations` table so that settings from the Personnalisation menu persist between sessions.  The Agent Builder centralizes conversation nodes and knowledge items so you can build flows visually.
Pensez à relancer `npm run build` après toute modification du code React
avant de démarrer le serveur en production.

## 📋 Comptes de test
- **Super Admin** : `pass@passhoteltest.com` / `pass`
- **Admin Hôtel** : `admin@example.com` / `password`

## 🏗️ Structure du projet
```
├── server/          # API Backend
├── src/            # Frontend React
├── public/         # Fichiers statiques
└── dist/          # Build de production
```

## 🌐 Déploiement
Le projet est configuré pour un déploiement sur Replit avec auto-scaling. Vous pouvez aussi l'héberger sur tout autre service compatible Node.js (Docker, VPS, etc.). Une fois le backend développé et PostgreSQL configuré, exécutez `npm run build` puis `npm start` pour démarrer l'application en production.


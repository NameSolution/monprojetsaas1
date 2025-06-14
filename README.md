# HotelBot AI - Assistant Virtuel Hôtelier (Prêt pour PostgreSQL Local & Backend Personnalisé)

HotelBot AI est une plateforme SaaS (Software as a Service) fullstack conçue pour permettre aux hôtels de déployer leur propre assistant virtuel intelligent. Cet assistant est multilingue et entièrement personnalisable. **Ce projet est maintenant configuré pour utiliser une base de données PostgreSQL locale et un backend personnalisé que vous devrez développer.** Les services de données actuels utilisent des données simulées pour permettre le développement et la démonstration de l'interface utilisateur.

## ✨ Fonctionnalités Principales (Interface Utilisateur)

HotelBot AI offre une suite complète d'outils répartis sur plusieurs interfaces :

### 1. Landing Page Publique (`/`)
- **Présentation Professionnelle** : Vitrine de la solution HotelBot AI.
- **Démo Interactive (Simulée)** : Permet de tester un chatbot de démonstration.
- **Informations Claires** : Sections dédiées aux fonctionnalités, tarifs, FAQ et contact.
- **Appel à l'Action (CTA)**.

### 2. Dashboard Superadmin (`/superadmin`)
Interface de gestion centralisée pour les administrateurs de la plateforme HotelBot AI.
- **Vue d'Ensemble (Dashboard)** : Statistiques globales (simulées).
- **Gestion des Hôtels** : CRUD des comptes hôtels (simulé).
- **Gestion des Utilisateurs** : CRUD des comptes utilisateurs (simulé).
- **Support Tickets** : Visualisation et gestion des tickets (simulé, pas de temps réel).
- **Analytics Globales** : Données agrégées (simulées).
- **Facturation (Billing)** : Consultation des factures (simulées).
- **Système IA (Monitoring & Configuration)** : Monitoring et configuration (simulés).
- **Paramètres Généraux** : Configuration des clés API, etc. (simulé).

### 3. Dashboard Client Hôtel (`/client`)
Espace dédié à chaque hôtel pour gérer et personnaliser son propre assistant virtuel.
- **Vue d'Ensemble (Dashboard)** : Statistiques clés (simulées).
- **Personnalisation de l'Apparence** : Modification du nom, message d'accueil, couleur, logo (upload simulé).
- **Base de Connaissances (LLM Memory)** : CRUD pour les informations (simulé).
- **Gestion des Langues** : Activation/Désactivation des langues.
- **QR Code & Lien Public** : Génération et personnalisation (simulé).
- **Analytics** : Données d'analyse (simulées).
- **Paramètres & Compte** : Modification des informations (simulé).
- **Documentation**.

### 4. Interface Chatbot Publique (`/bot/:slug`)
Interface utilisateur finale avec laquelle les clients de l'hôtel interagissent.
- **Interaction Intuitive** : Réponses du bot simulées.
- **Affichage Personnalisé** : Reprend les configurations de l'hôtel (simulé).

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
    - **Authentification** : À gérer par votre backend. L'application simule l'authentification.
    - **Base de Données PostgreSQL Locale** : Vous devrez configurer et gérer votre propre instance PostgreSQL.
    - **Stockage de Fichiers** : À gérer par votre backend (ex: pour les logos).
    - **API Backend** : Pour toute la logique métier, interaction avec la base de données et le LLM.
- **Structure des Fichiers Frontend** :
    - `src/pages/` : Composants de page principaux.
    - `src/components/` : Composants réutilisables.
    - `src/hooks/` : Hooks personnalisés (ex: `useClientData`, `useSuperAdminData`).
    - `src/services/` : **Logique d'interaction avec des données simulées.** Ces fichiers devront être adaptés pour appeler votre API backend.
        - `src/services/modules/` : Modules de service spécifiques.
    - `src/lib/` : Utilitaires (ex: `authContext.jsx` pour l'authentification simulée, `cn`).
    - `src/database/` : Contient la structure de dossiers pour votre future base de données PostgreSQL locale.
        - `src/database/config/` : Pour vos configurations de connexion.
        - `src/database/migrations/` : Pour vos scripts de migration SQL.
        - `src/database/schemas/` : Pour vos définitions de schémas ou types de données.

## 🚀 Démarrage Rapide (Frontend avec Données Simulées)

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
L'application sera accessible à `http://localhost:5173`.

### Comptes de Test (Simulés)
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
    -   `id` (UUID, Primary Key): Identifiant unique de l'utilisateur.
    -   `name` (TEXT).
    -   `email` (TEXT, Unique): Email de l'utilisateur.
    -   `password_hash` (TEXT): Hash du mot de passe.
    -   `role` (TEXT): Rôle (`superadmin`, `admin`, `manager`).
    -   `hotel_id` (UUID, Foreign Key vers `hotels.id`, NULL pour superadmins).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

2.  **`hotels`**
    -   `id` (UUID, Primary Key).
    -   `user_id` (UUID, Foreign Key vers `profiles.id`): Admin principal de l'hôtel.
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

6.  **`knowledge_base_articles`**
    -   `id` (BIGINT, PK, auto-increment).
    -   `hotel_id` (UUID, FK vers `hotels.id`).
    -   `lang_code` (TEXT, FK vers `languages.code`).
    -   `intent_name` (TEXT).
    -   `question_variations` (TEXT[]).
    -   `answer` (TEXT).
    -   `is_active` (BOOLEAN).
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
    -   `user_id` (UUID, FK vers `profiles.id`, optionnel).
    -   `hotel_id` (UUID, FK vers `hotels.id`, optionnel).
    -   `submitter_name` (TEXT).
    -   `submitter_email` (TEXT).
    -   `subject` (TEXT).
    -   `message` (TEXT).
    -   `status` (TEXT): (`Nouveau`, `En cours`, `Résolu`, `Fermé`).
    -   `priority` (TEXT): (`Basse`, `Moyenne`, `Haute`).
    -   `assigned_to_user_id` (UUID, FK vers `profiles.id`, optionnel).
    -   `internal_notes` (TEXT, optionnel).
    -   `created_at` (TIMESTAMPTZ).
    -   `updated_at` (TIMESTAMPTZ).

9.  **`settings`** (Paramètre# HotelBot AI SaaS - Plateforme de Chatbot pour Hôtels

Plateforme complète de chatbot IA pour hôtels avec dashboard d'administration.

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
node index.cjs
```

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
Le projet est configuré pour un déploiement sur Replit avec auto-scaling. Vous pouvez aussi l'héberger sur tout autre service compatible Node.js (Docker, VPS, etc.). Une fois le backend développé et PostgreSQL configuré, exécutez `npm run build` puis `node index.cjs` pour démarrer l'application en production.

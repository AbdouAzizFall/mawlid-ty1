# Mawlid — Thiaroye Yeumbeul 1

Application PWA de gestion du Mawlid (participants, recettes, dépenses, statistiques).

## 1. Créer le projet Supabase (gratuit)

1. Va sur https://supabase.com → "New project"
2. Choisis un nom (ex: mawlid-ty1), un mot de passe pour la base, une région proche (ex: Europe)
3. Attends 1-2 minutes que le projet soit prêt

## 2. Créer les tables

Dans ton projet Supabase → menu de gauche → **SQL Editor** → "New query".

Colle et exécute (bouton "Run") le contenu de ces 4 fichiers **dans l'ordre exact** :

1. `supabase/migrations/001_init_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_auth_trigger.sql`
4. `supabase/migrations/004_rls_require_approval.sql`

## 3. Récupérer tes clés API

Dans Supabase → **Project Settings** (icône ⚙️) → **API** :
- copie "Project URL"
- copie la clé "anon public"

## 4. Installer le projet sur ton PC

Ouvre un terminal dans le dossier du projet, puis :

```bash
npm install
```

Copie `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Ouvre `.env.local` et colle tes deux valeurs récupérées à l'étape 3 :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

## 5. Lancer l'application en local

```bash
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

## 6. Créer ton compte administrateur

Sur la page de connexion, clique sur "Inscription" et crée ton compte.
**Le tout premier compte créé devient automatiquement Administrateur.**
Vérifie ta boîte mail pour confirmer ton adresse (Supabase envoie un email de confirmation), puis connecte-toi.

## 7. Déployer en ligne (pour que ton équipe y accède depuis leurs téléphones)

1. Crée un compte gratuit sur https://github.com et un nouveau dépôt (repo)
2. Depuis le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/mawlid-ty1.git
   git push -u origin main
   ```
3. Va sur https://vercel.com → connecte-toi avec ton compte GitHub → "Add New Project" → sélectionne ton dépôt
4. Dans "Environment Variables", ajoute les 2 mêmes variables que dans `.env.local`
5. Clique "Deploy" — Vercel te donne une adresse du type `https://mawlid-ty1.vercel.app`

## 8. Installer la PWA sur les téléphones

- **Android (Chrome)** : ouvrir le lien → menu ⋮ → "Ajouter à l'écran d'accueil"
- **iPhone (Safari)** : ouvrir le lien → bouton Partager → "Sur l'écran d'accueil"

## Rôles

- **Administrateur** : accès complet, valide les nouveaux comptes dans Paramètres
- **Gestionnaire inscriptions** : gère les participants
- **Gestionnaire finances** : gère les recettes et dépenses

Chaque nouvelle inscription (`Inscription` sur la page de connexion) crée un compte
**en attente** — un administrateur doit l'approuver et lui donner un rôle depuis
**Paramètres** avant qu'il puisse utiliser l'application.

## Ce qui est déjà fonctionnel

- Authentification (connexion / inscription / validation des comptes)
- Dashboard avec chiffres en temps réel
- Inscription des participants avec catégorisation automatique par montant
- Recherche et filtres sur les participants
- Recettes (alimentées automatiquement par les inscriptions + ajout manuel possible en base)
- Dépenses (liste + formulaire d'ajout)
- Statistiques (par sexe, par catégorie, croisement sexe/catégorie)
- PWA installable sur téléphone

## Prochaines améliorations possibles

- Modification/suppression des participants et dépenses depuis l'interface
- Export CSV/PDF des rapports
- Ajout manuel de recettes indépendantes depuis l'interface (dons, bienfaiteurs hors inscription)
- Icônes PWA personnalisées (actuellement à ajouter dans `public/icons/`)

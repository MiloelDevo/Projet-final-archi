# API type Medium (NestJS)

API REST inspirée de Medium : articles (posts), tags, commentaires, abonnements (follow) et notifications. Architecture DDD légère (domain / application / infrastructure), SQLite, TypeORM, événements métier.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Lancer le projet

```bash
# Développement (avec rechargement)
npm run start:dev

# Démarrage simple
npm run start

# Production
npm run start:prod
```

L’API est disponible sur **http://localhost:3000**.  
La documentation Swagger est sur **http://localhost:3000/api**.

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## Structure du projet

- **posts** : articles avec slug auto, statuts (DRAFT, PENDING_REVIEW, ACCEPTED, REJECTED), filtrage par tags
- **tags** : CRUD, création/édition/suppression réservées aux ADMIN
- **comments** : création, liste, mise à jour, suppression, comptage ; uniquement sur les posts ACCEPTED
- **subscriptions** : follow / unfollow, liste followers / following
- **notifications** : entité persistée, créée via les événements ; liste, marquer lu, tout marquer lu

Chaque module suit une structure **domain** (entités, interfaces de repository, événements), **application** (use cases, DTOs, handlers d’événements), **infrastructure** (contrôleurs, repositories TypeORM, guards).

## Authentification (mode examen)

Headers utilisés pour simuler l’utilisateur connecté :

- `x-user-id` : identifiant numérique de l’utilisateur
- `x-user-role` : `USER`, `MODERATOR` ou `ADMIN`
- `x-admin: true` : pour les actions réservées aux administrateurs (tags create/update/delete)

## Endpoints principaux

| Module        | Méthode | Route                                      | Description                    |
|---------------|---------|--------------------------------------------|--------------------------------|
| Posts         | GET     | /posts                                     | Liste (optionnel ?tags=)       |
| Posts         | POST    | /posts                                     | Créer un post                  |
| Posts         | GET     | /posts/:slug                               | Récupérer par slug             |
| Posts         | PATCH   | /posts/:id/slug                            | Override du slug               |
| Tags          | GET     | /tags                                      | Liste des tags                 |
| Tags          | POST    | /tags                                      | Créer un tag (ADMIN)           |
| Comments      | POST    | /posts/:postId/comments                    | Créer un commentaire (auth)    |
| Comments      | GET     | /posts/:postId/comments                    | Liste (pagination)             |
| Subscriptions | POST    | /subscriptions/follow/:followedId          | Suivre un utilisateur (auth)   |
| Subscriptions | DELETE  | /subscriptions/follow/:followedId           | Ne plus suivre (auth)          |
| Notifications | GET     | /notifications                             | Mes notifications (auth)       |
| Notifications | PATCH   | /notifications/:id/read                    | Marquer une notification lue   |
| Notifications | POST    | /notifications/mark-all-read               | Tout marquer comme lu (auth)   |

## Licence

Projet à usage pédagogique / examen.

# gg.start

Application web de création et de gestion de tournois inspirée de `start.gg` et `challonge.com`.

## Équipe

- Hugo ANDRIAMAMPIANINA
- Bénédict NENERT

## Vision du projet

gg.start est une plateforme web permettant à n'importe quel utilisateur d'organiser et de participer à des tournois en ligne. L'application gère automatiquement la génération des brackets, le suivi des matchs et le classement des participants.

## Configuration

A la racine du répertoire du projet gg.start, créer un fichier **.env** avec le contenu suivant
```.env
API_PORT=<inserer_ici>
API_URL=http://localhost:$API_PORT

POSTGRES_PASSWORD=<inserer_ici>
POSTGRES_USER=<inserer_ici>
POSTGRES_DB=<inserer_ici>
POSTGRES_HOST=<inserer_ici>
POSTGRES_PORT=<inserer_ici>

JWT_SECRET=<inserer_ici>
```
Remplacez les **<inserer_ici>** par vos propres variables de configuration

**JWT_SECRET** est un secret utilisé pour signer les **access_token** JWT, libre à vous de le générer comme vous le souhaiter (ex: une chaîne de caractère en SHA256)

`ATTENTION : Le port de la base de données PostgreSQL, le port de l'API et le port du Frontend doivent être différents`

## Lancement

A la racine du répertoire du projet gg.start

Lancement du conteneur de la base de données
```bash
docker compose up -d
```

Lancement de l'API
```bash
cd api/

# installation des dépendances
bun i

# lancement de l'API en mode développement
bun start:dev
```

Lancement du front
```bash
cd frontend/

# installation des dépendances
bun i

# lancement de l'API en mode développement
bun dev
```

## Utilisation

- Une fois démarrée :
  - l'interface web est accessible sur http://localhost:<FRONTEND_PORT>/
  - l'API gg.start est accessible sur http://localhost:<API_PORT>/
    - Pour vous familiariser l'API gg.start, visitez http://localhost:<API_PORT>/api/
      - Elle contient une documentation OpenAPI/Swagger permettant de tester toutes les requêtes disponibles et de comprendre à quoi elles servent

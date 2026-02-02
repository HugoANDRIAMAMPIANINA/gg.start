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

POSTGRES_PASSWORD=<inserer_ici>
POSTGRES_USER=<inserer_ici>
POSTGRES_DB=<inserer_ici>
POSTGRES_HOST=<inserer_ici>
POSTGRES_PORT=<inserer_ici>

JWT_SECRET=<inserer_ici>
```
Remplacez les **<inserer_ici>** par vos propres variables de configuration

**JWT_SECRET** est un secret utilisé pour signer les **access_token** JWT, libre à vous de le générer comme vous le souhaiter (ex: une chaîne de caractère en SHA256)

`ATTENTION : Le port de la base de données PostgreSQL et le port de l'API doivent être différents`

## Lancement

A la racine du répertoire du projet gg.start

```bash
# lancement de la base de données PostgreSQL
docker compose up -d
```

```bash
cd api/
npm i
# lancement de l'API en mode développement
npm run start:dev
```

## Utilisation

- Une fois démarrée, l'API gg.start est accessible sur http://127.0.0.1:<API_PORT>/
- Pour vous familiariser l'API gg.start, visitez http://127.0.0.1:<API_PORT>/api/
  - Elle contient une documentation OpenAPI/Swagger permettant de tester toutes les requêtes disponibles et de comprendre à quoi elles servent
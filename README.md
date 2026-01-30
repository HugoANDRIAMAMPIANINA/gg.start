# gg.start

## A propos

## Configuration

A la racine du répertoire du projet gg.start, créer un fichier **.env** avec le contenu suivant
```.env
API_PORT=<inserer_ici>
POSTGRES_PASSWORD=<inserer_ici>
POSTGRES_USER=<inserer_ici>
POSTGRES_DB=<inserer_ici>
POSTGRES_HOST=<inserer_ici>
POSTGRES_PORT=<inserer_ici>
```
Remplacez les **<inserer_ici>** par vos propres variables de configuration

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

Pour utiliser l'API gg.start, visitez [http://127.0.0.1:3000/api/](http://127.0.0.1:3000/api/)
Elle contient une documentation OpenAPI/Swagger permettant de tester toutes les requêtes disponibles et de comprendre à quoi elles servent

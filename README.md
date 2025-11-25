# gg.start

Application web de création et de gestion de tournois inspirée de `start.gg` et `challonge.com`.

## Équipe

- Hugo ANDRIAMAMPIANINA
- Bénédict NENERT

## Table des matières

- [gg.start](#ggstart)
  - [Équipe](#équipe)
  - [Table des matières](#table-des-matières)
  - [Vision du projet](#vision-du-projet)
  - [Fonctionnalités](#fonctionnalités)
    - [1. Gestion des utilisateurs](#1-gestion-des-utilisateurs)
    - [2. Création de tournois](#2-création-de-tournois)
    - [3. Participation aux tournois](#3-participation-aux-tournois)
    - [4. Déroulement des tournois](#4-déroulement-des-tournois)
    - [5. Système de classement et statistiques](#5-système-de-classement-et-statistiques)
    - [6. Fonctionnalités additionnelles](#6-fonctionnalités-additionnelles)
  - [Stack techno](#stack-techno)
  - [Portée du MVP](#portée-du-mvp)
    - [Fonctionnalités prioritaires](#fonctionnalités-prioritaires)
    - [À reporter en V2 (si le temps le permet)](#à-reporter-en-v2-si-le-temps-le-permet)

## Vision du projet

gg.start est une plateforme permettant à n'importe quel utilisateur d'organiser et de participer à des tournois en ligne. L'application gère automatiquement la génération des brackets, le suivi des matchs et le classement des participants.

## Fonctionnalités

### 1. Gestion des utilisateurs

- **Système d'authentification**
  - Inscription et connexion par email/mot de passe
  - Profil utilisateur avec pseudonyme et statistiques
  - Historique des tournois (créés et participés)
  - Statistiques personnelles : ratio victoires/défaites, taux de participation, placement moyen

### 2. Création de tournois

Tout utilisateur authentifié peut créer un tournoi avec les paramètres suivants :

**Informations générales**

- Nom et description du tournoi
- Jeu concerné (sélection dans une liste ou saisie libre)
- Date et heure de début
- Nombre maximum de participants

**Format de compétition**

- Simple élimination
- Double élimination
- Round-robin (tous contre tous)

**Règles et paramètres**

- Presets de règles pour jeux populaires (ex: Best of 3, Best of 5)
- Règles personnalisées
- Nombre de points/manches pour gagner un match
- Gestion des DQ (disqualifications) et forfaits

### 3. Participation aux tournois

**Inscription**

- Rejoindre un tournoi public ou avec code d'accès
- Liste des participants en temps réel
- Possibilité de se désinscrire avant le début

**Check-in**

- Système de confirmation de présence avant le début du tournoi
- Délai de check-in configurable par l'organisateur
- DQ automatique des absents au check-in

### 4. Déroulement des tournois

**Génération automatique du bracket**

- Création du tableau selon le format choisi
- Possibilité pour l'organisateur d'ajuster manuellement les seeds
- Possibilité pour l'organisateur d'ajuster manuellement les seeds ???

**Gestion des matchs**

- Affichage du bracket interactif et en temps réel
  - Mise à jour du bracket en temps réel
  - Affichage du match en cours
  - Progression dans le tournoi
- Notification des participants quand leur match est prêt
- Report des scores par les participants ou l'organisateur
- Système de validation des résultats (confirmation des deux joueurs ou validation de l'organisateur) ???

### 5. Système de classement et statistiques

**Rating ELO ou similaire**

- Calcul du niveau de chaque joueur basé sur ses résultats
- Utilisé pour le seeding automatique

**Statistiques de tournoi**

- Classement final
- Historique des matchs
- Statistiques détaillées (nombre de matchs joués, temps moyen, etc.)

### 6. Fonctionnalités additionnelles

**Page d'accueil**

- Liste des tournois à venir
- Tournois en cours
- Recherche et filtres (par jeu, format, date)

**Dashboard organisateur**

- Gestion centralisée de ses tournois
- Outils de modération (DQ manuel, modification de scores)
- Annonces et notifications aux participants

## Stack techno

- **Frontend** : React ou Vue.js
- **Backend** : Node.js (Express) ou Python (Flask/FastAPI)
- **Base de données** : PostgreSQL ou MongoDB
- **Temps réel** : WebSockets (Socket.io) pour les mises à jour du bracket
- **Authentification** : JWT ou sessions

## Portée du MVP

### Fonctionnalités prioritaires

Pour respecter les délais, concentrez-vous sur :

1. **Authentification de base**
2. **Création de tournoi** (format simple/double élimination uniquement) `design pattern`
3. **Inscription aux tournois**
4. **Génération et affichage du bracket** `design pattern`
5. **Report de scores manuel** (maybe validation par l'organisateur)
6. **Seeding basique** (aléatoire ou ordre d'inscription)
7. **Système de notifications** quand un match est disponible, quand un adversaire est disqualifié...
8. **Profil utilisateur simple** avec historique

### À reporter en V2 (si le temps le permet)

- Système de seeding complexe
- Validation croisée des scores
- Formats Swiss/Round-robin
- Chat intégré

# gg.start - Manuel Technique

- [gg.start - Manuel Technique](#ggstart---manuel-technique)
  - [Design Patterns](#design-patterns)
    - [Factory (Pattern de création)](#factory-pattern-de-création)
      - [Utilisation](#utilisation)
      - [Implémentation](#implémentation)
    - [Décorateur (Pattern structurel)](#décorateur-pattern-structurel)
      - [Utilisation](#utilisation-1)
      - [Implémentation](#implémentation-1)
  - [Patterns abandonnées lors de la conception](#patterns-abandonnées-lors-de-la-conception)
    - [State (Pattern comportemental)](#state-pattern-comportemental)

## Design Patterns

### Factory (Pattern de création)

#### Utilisation

Il existe plusieurs types d'arbre (bracket) de tournoi, voici quelques exemples :

- `Single Elimination`: Arbre de tournoi dans lequel un participant est éliminé lorsqu'il a perdu un match.
- `Double Elimination`: Arbre de tournoi dans lequel un participant est éliminé lorsqu'il a perdu deux matchs.
- `Round Robin`: Arbre de tournoi dans lequel tous les participants se rencontrent tous un nombre égal de fois et sont opposés une seule fois au cours de la compétition.
-

Dans le cadre de la génération des matchs d'un arbre de tournoi, **le type de bracket détermine entièrement la structure des matchs**, leurs liens (winner/loser), ainsi que la manière dont les joueurs sont positionnés.

Le pattern **Factory** permet d'encapsuler cette logique de création et d'éviter des structures conditionnelles complexes (`if / switch`) dispersées dans le code métier.

---

#### Implémentation

Une interface commune définit le contrat de génération :

```ts
export interface BracketGenerator {
  generateMatches(bracket: Bracket): Match[];

  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[];
}
```

Chaque type de bracket possède sa propre implémentation :

```ts
export class SingleEliminationGenerator implements BracketGenerator {
  generateMatches(bracket: Bracket): Match[] {
    // Génération de l'arbre de tournoi en Single Elimination
  }

  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[] {
    // Placement des joueurs selon le seeding
  }
}
```

```ts
export class DoubleEliminationGenerator implements BracketGenerator {
  generateMatches(bracket: Bracket): Match[] {
    // Génération de l'arbre de tournoi en Double Elimination
  }

  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[] {
    // Placement des joueurs selon le seeding
  }
}
```

La factory est responsable du choix de l’implémentation :

```ts
export class BracketGeneratorFactory {
  static create(type: BracketType): BracketGenerator {
    switch (type) {
      case BracketType.SINGLE_ELIM:
        return new SingleEliminationGenerator();

      case BracketType.DOUBLE_ELIM:
        return new DoubleEliminationGenerator();

      default:
        throw new Error(`BracketType not supported`);
    }
  }
}
```

Cette implémentation permet ainsi d'ajouter de nouveau types de tournoi sans modifier le code existant, seulement de créer un nouveau BracketGenerator, d'implémenter ses méthodes et de l'ajouter dans la Factory

### Décorateur (Pattern structurel)

#### Utilisation

Le framework NestJS utilise des décorateurs

Un cas d'utilisation de décorateur est l'accès aux routes API, ce qui permet de restreindre l'accès à certains utilisateurs.
Dans notre cas, il existe plusieurs utilisateurs :
| Type d'utilisateur                              | Actions possibles                                                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utilisateur non connecté                        | peut accéder aux tournois, arbres et matchs (seulement en lecture)                                                                                |
| Utilisateur connecté                            | peut accéder à son profil, créer des tournois, s'inscrire à des arbres de tournois, en plus des actions possibles par un utilisateur non connecté |
| Utilisateur connecté et organisateur du tournoi | peut gérer ses tournois, arbres et matchs (création/modification/suppression), en plus des actions possibles par un utilisateur connecté          |

Selon les routes, un utilisateur spécifique est visé :

| Route                                             | Méthode | Accès restreint                                                                                 |
| ------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `/users`                                          | POST    | ❌ Non                                                                                           |
| `/users`                                          | GET     | ✅ Oui                                                                                           |
| `/users/{id}`                                     | GET     | ✅ Oui                                                                                           |
| `/users/{id}`                                     | DELETE  | ✅ Oui                                                                                           |
| `/auth/login`                                     | POST    | ❌ Non                                                                                           |
| `/auth/me`                                        | GET     | ✅ Oui                                                                                           |
| `/tournaments`                                    | POST    | ✅ Oui                                                                                           |
| `/tournaments`                                    | GET     | ❌ Non                                                                                           |
| `/tournaments/{id}`                               | GET     | ❌ Non                                                                                           |
| `/tournaments/{id}`                               | PATCH   | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/tournaments/{id}`                               | DELETE  | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/tournaments/name/{name}`                        | GET     | ❌ Non                                                                                           |
| `/brackets`                                       | POST    | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/brackets/{bracketId}`                           | GET     | ❌ Non                                                                                           |
| `/brackets/{bracketId}`                           | PATCH   | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/brackets/{bracketId}`                           | DELETE  | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/brackets/{bracketId}/players`                   | POST    | ✅ Oui                                                                                           |
| `/brackets/{bracketId}/players`                   | GET     | ❌ Non                                                                                           |
| `/brackets/{bracketId}/players/{bracketPlayerId}` | DELETE  | ✅ Oui réservé à l'organisateur du tournoi (un participant ne peut pas se désinscrire tout seul) |
| `/brackets/{bracketId}/matches`                   | GET     | ❌ Non                                                                                           |
| `/brackets/{bracketId}/update-seeding`            | POST    | ✅ Oui réservé à l'organisateur du tournoi                                                       |
| `/brackets/{bracketId}/generate`                  | POST    | A RETIRER EN PROD - SERT UNIQUEMENT DE TEST                                                     |
| `/matches/{matchId}`                              | GET     | ❌ Non                                                                                           |
| `/matches/{matchId}/set-score`                    | POST    | ✅ Oui réservé à l'organisateur du tournoi                                                       |


#### Implémentation

a

## Patterns abandonnées lors de la conception

### State (Pattern comportemental)

L'idée était bonne en théorie mais lors du développement, nous nous sommes rendus compte que :

- Chaque State devait exécuter une méthode avec des paramètres différents :

| État      | Description                                                  | Action                                                                                   | Paramètres           |
| --------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | -------------------- |
| PENDING   | Match créé mais les joueurs ne sont pas encore tous affectés | Si tous les joueurs sont affectés, on passe à l'état **READY**                           | Match ou ses joueurs |
| READY     | Joueurs définis, match attend d'être manuellement démarré    | On passe à l'état **ONGOING**                                                            | N/A                  |
| ONGOING   | Match en cours                                               | On met à jour le score de chaque joueur (MatchPlayer) et on passe à l'état **COMPLETED** | Score du match       |
| COMPLETED | Match terminé, scores figés                                  | On ne fait rien                                                                          | N/A                  |

Ainsi, nous aurions eu les State suivants :

```ts
export class IMatchState {
    execute(): void;
}
```

```ts
export class MatchPendingState implements IMatchState {
    execute(match: Match) {
        // Vérifie si le match possède ses deux joueurs
        // Le cas échéant, met à jour l'état du match pour Ready
    }
}
```

```ts
export class MatchReadyState implements IMatchState {
    execute() {
        // Met à jour l'état du match pour Ongoing
    }
}
```

```ts
export class MatchOngoingState implements IMatchState {
    execute(matchScore: MatchPlayerScoreDto[]) {
        // Met à jour le score du match
        // Met à jour l'état du match pour Completed
    }
}
```

```ts
export class MatchCompletedState implements IMatchState {
    execute() {
        // Ne fait rien
    }
}
```

Il était donc impossible de l'implémenter sans aller au contraire de ses possibilités d'application, nous avons donc opté pour des **conditions IF/ELSE**.
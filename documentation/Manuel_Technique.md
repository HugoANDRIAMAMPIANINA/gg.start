# gg.start - Manuel Technique

- [gg.start - Manuel Technique](#ggstart---manuel-technique)
  - [Design Patterns](#design-patterns)
    - [Factory (Pattern de création)](#factory-pattern-de-création)
      - [Utilisation](#utilisation)
      - [Implémentation](#implémentation)
    - [Decorator (Pattern structurel)](#decorator-pattern-structurel)
      - [Utilisation](#utilisation-1)
      - [Implémentation](#implémentation-1)
    - [Composite (Pattern structurel)](#composite-pattern-structurel)
      - [Utilisation](#utilisation-2)
      - [Implémentation](#implémentation-2)
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

### Decorator (Pattern structurel)

#### Utilisation

Il existe plusieurs types d'utilisateurs de l'API :
| Type d'utilisateur                              | Actions possibles                                                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utilisateur non authentifié                        | peut accéder aux tournois, arbres et matchs (seulement en lecture)                                                                                |
| Utilisateur authentifié                            | peut accéder à son profil, créer des tournois, s'inscrire à des arbres de tournois, en plus des actions possibles par un utilisateur non connecté |
| Utilisateur authentifié et organisateur du tournoi | peut gérer ses tournois, arbres et matchs (création/modification/suppression), en plus des actions possibles par un utilisateur connecté          |

Nous avons besoin de mettre en place un système d'authentification et d'autorisation pour autorisé ou empêcher l'accès à certaines routes en :
- Vérifiant si l'utilisateur est **authentifié**
- Vérifier si l'utilisateur est **propriétaire d'une ressource** (organisateur d'un tournoi dans notre cas)

Le pattern **Decorator** permet d'enrichir progressivement les routes avec des **métadonnées déclaratives** sans modifier le code des contrôleurs. Les décorateurs **annotent** les méthodes, et les guards **interprètent** ces annotations pour appliquer les règles d'autorisation.

Grâce à ce pattern, **on peut composer plusieurs niveaux de protection** (authentification et rôle) de manière déclarative et réutilisable.

---

#### Implémentation

**Décorateur de base** : définit les rôles requis via des métadonnées :

```ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

**Enum des rôles** :

```ts
export enum Role {
  TOURNAMENT_ORGANIZER = 'tournament_organizer',
}
```

**Guard (interpréteur)** : lit les métadonnées et applique la logique d'autorisation :

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lecture des métadonnées ajoutées par le décorateur
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Pas de rôle requis = accès autorisé
    }

    const req = context.switchToHttp().getRequest();
    const user: JwtPayload = req.user;

    const tournamentOrganizer: User =
      await this.usersService.findOneByIdWithOrganizedTournaments(user.sub);

    let isTournamentOrganizer = false;
    
    if (requiredRoles.includes(Role.TOURNAMENT_ORGANIZER)) {
      const { tournamentId, bracketId, matchId } = req.params;

      // Vérifie si l'utilisateur est "propriétaire" de la ressource demandée
      if (tournamentId) {
        isTournamentOrganizer = tournamentOrganizer.organizedTournaments.some(
          (tournament) => tournament.id === tournamentId,
        );
      }

      if (bracketId) {
        isTournamentOrganizer = tournamentOrganizer.organizedTournaments.some(
          (tournament) =>
            tournament.brackets.some((bracket) => bracket.id === bracketId),
        );
      }

      if (matchId) {
        isTournamentOrganizer = tournamentOrganizer.organizedTournaments.some(
          (tournament) =>
            tournament.brackets.some((bracket) =>
              bracket.matches.some((match) => match.id === matchId),
            ),
        );
      }
    }

    return isTournamentOrganizer;
  }
}
```

**Utilisation** dans un contrôleur :

```ts
// Les Guards utilisé pour l'authentification et l'autorisation sont activés globalement sur toutes les routes
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // La route a besoin d'être authentifié pour y accéder  
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  // Le décorateur @Public() sert à définir une route comme accessible par tout utilisateur sans authentification ni rôle particulier, il est implémenté dans l'AuthGuard qui gère l'autorisation liée à l'authentification
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  // Le décorateur @Roles(Role.TOURNAMENT_ORGANIZER) sert à définir une route comme accessible par uniquement par les utlisateurs qui valident la condition associée au rôle Role.TOURNAMENT_ORGANIZER, cette condition est implémentée dans le RoleGuard qui gère l'autorisation liée aux rôles
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @Patch(':tournamentId')
  update(
    @Param('tournamentId') tournamentId: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(tournamentId, updateTournamentDto);
  }
}
```

Cette implémentation permet ainsi d'**ajouter de nouveaux rôles ou règles d'autorisation** en créant simplement un nouveau décorateur et en étendant la logique du **Guard**, sans toucher au code des contrôleurs existants. La protection des routes reste **déclarative et lisible**.

### Composite (Pattern structurel)

#### Utilisation

Dans un tournoi, il existe une structure hiérarchique entre les **User**, **BracketPlayer** et **MatchPlayer** : un **BracketPlayer** participe à plusieurs **Match** via des **MatchPlayer**. 

Pour calculer des statistiques comme le score total, le nombre de victoires et/ou de défaites, on doit parcourir tous les matchs d'un joueur et additionner les valeurs individuelles.

Le pattern **Composite** permet de traiter de manière uniforme :
- Les **éléments individuels** (Leaf) : **MatchPlayer** avec son score (score) et son statut de victoire (isWinner)
- Les **conteneurs** (Composite) : **BracketPlayer** qui contient tous ses **MatchPlayer**

Grâce à ce pattern, **un BracketPlayer peut calculer son score total en déléguant le calcul à ses composants enfants, ici ses MatchPlayer**, sans connaître les détails d'implémentation. Chaque niveau de la hiérarchie expose la même interface de calcul.

---

#### Implémentation

Une interface commune définit le contrat de calcul :

```ts
export interface IScorableComponent {
  getTotalScore(): number;
  getWinCount(): number;
}
```

**Leaf** : **MatchPlayer** retourne ses propres valeurs :

```ts
@Entity()
export class MatchPlayer implements IScorableComponent {
  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  isWinner: boolean;

  // Implémentation Leaf : retourne ses propres valeurs
  getTotalScore(): number {
    return this.score;
  }

  getWinCount(): number {
    return this.isWinner ? 1 : 0;
  }
}
```

**Composite** : **BracketPlayer** agrège les valeurs de ses **MatchPlayer** :

```ts
@Entity()
export class BracketPlayer implements IScorableComponent {
  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.bracketPlayer)
  matchPlayers: MatchPlayer[];

  // Implémentation Composite : délègue aux enfants
  getTotalScore(): number {
    if (!this.matchPlayers || this.matchPlayers.length === 0) {
      return 0;
    }
    
    return this.matchPlayers.reduce(
      (total, matchPlayer) => total + matchPlayer.getTotalScore(),
      0
    );
  }

  getWinCount(): number {
    if (!this.matchPlayers || this.matchPlayers.length === 0) {
      return 0;
    }
    
    return this.matchPlayers.reduce(
      (total, matchPlayer) => total + matchPlayer.getWinCount(),
      0
    );
  }
}
```

**Utilisation** dans le service :

```ts
@Injectable()
export class BracketsService {
  async getPlayerStats(bracketId: string, bracketPlayerId: string) {
    await this.findOneById(bracketId);
    const bracketPlayer = await this.bracketPlayersRepository.findOne({
      where: { id: bracketPlayerId },
      select: { matchPlayers: true },
      relations: { matchPlayers: true },
    });
    if (!bracketPlayer) {
      throw new NotFoundException('BracketPlayer not found');
    }
    return {
      totalScore: bracketPlayer.getTotalScore(),
      totalWins: bracketPlayer.getWinCount(),
      totalPlayedMatches: bracketPlayer.matchPlayers.length,
    };
  }
}
```

Cette implémentation permet ainsi d'ajouter de nouveaux niveaux hiérarchiques (ex: **User** qui agrège plusieurs **BracketPlayer**) en implémentant simplement **ScorableComponent**, sans modifier le code existant.

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
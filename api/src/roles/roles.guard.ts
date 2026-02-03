import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './enums/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user: JwtPayload = req.user;

    const tounamentOrganizer: User =
      await this.usersService.findOneByIdWithOrganizedTournaments(user.sub);

    let isTournamentOrganizer = false;
    if (requiredRoles.includes(Role.TOURNAMENT_ORGANIZER)) {
      const tournamentId: string = req.params.tournamentId;
      // Si l'ID d'un tournoi est en paramètre de la requête, on vérifie si l'utilisateur connecté est organisateur de ce tournoi
      if (tournamentId) {
        isTournamentOrganizer = tounamentOrganizer.organizedTournaments.some(
          (tournament) => tournament.id === tournamentId,
        );
      }

      if (req.body) {
        const bodyTournamentId: string = req.body.tournamentId;
        // Si l'ID d'un tournoi est en body de la requête, on vérifie si l'utilisateur connecté est organisateur de ce tournoi
        if (bodyTournamentId) {
          isTournamentOrganizer = tounamentOrganizer.organizedTournaments.some(
            (tournament) => tournament.id === bodyTournamentId,
          );
        }
      }

      const bracketId: string = req.params.bracketId;
      // Si l'ID d'un arbre est en paramètre de la requête, on vérifie si l'utilisateur connecté est organisateur du tournoi de cet arbre
      if (bracketId) {
        isTournamentOrganizer = tounamentOrganizer.organizedTournaments.some(
          (tournament) =>
            tournament.brackets.some((bracket) => bracket.id === bracketId),
        );
      }

      const matchId: string = req.params.matchId;
      // Si l'ID d'un match est en paramètre de la requête, on vérifie si l'utilisateur connecté est organisateur du tournoi de cet arbre
      if (matchId) {
        isTournamentOrganizer = tounamentOrganizer.organizedTournaments.some(
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

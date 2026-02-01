import { Tournament } from 'src/tournaments/entities/tournament.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  organizedTournaments: Tournament[];
}

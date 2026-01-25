import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BracketPlayer } from '../../bracket-players/entities/bracket-player.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @OneToMany(() => Tournament, (tournament) => tournament.organizer)
  organizedTournaments: Tournament[];

  @OneToMany(() => BracketPlayer, (bracketPlayer) => bracketPlayer.user)
  brackets: BracketPlayer[];
}

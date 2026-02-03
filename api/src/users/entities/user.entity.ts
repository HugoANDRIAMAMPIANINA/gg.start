import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BracketPlayer } from '../../bracket-players/entities/bracket-player.entity';
import { IsEmail, IsUUID } from 'class-validator';

@Entity()
export class User {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @IsEmail()
  @Column()
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @OneToMany(() => Tournament, (tournament) => tournament.organizer)
  organizedTournaments: Tournament[];

  @OneToMany(() => BracketPlayer, (bracketPlayer) => bracketPlayer.user)
  brackets: BracketPlayer[];
}

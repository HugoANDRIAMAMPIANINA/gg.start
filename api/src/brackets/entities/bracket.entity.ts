import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BracketType } from 'src/common/enums/bracket-type.enum';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { BracketState } from 'src/common/enums/bracket-state.enum';
import { IsUUID } from 'class-validator';

@Entity()
export class Bracket {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column({
    type: 'enum',
    enum: BracketType,
    default: BracketType.SINGLE_ELIM,
  })
  type: BracketType;

  @Column({
    type: 'enum',
    enum: BracketState,
    default: BracketState.REGISTRATION,
  })
  state: BracketState;

  @ManyToOne(() => Tournament, (tournament) => tournament.brackets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @OneToMany(() => BracketPlayer, (bracketPlayer) => bracketPlayer.bracket)
  players: BracketPlayer[];

  @OneToMany(() => Match, (match) => match.bracket)
  matches: Match[];
}

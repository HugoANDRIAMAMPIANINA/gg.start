import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BracketType } from 'src/common/enum/bracketType';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { BracketState } from 'src/common/enum/bracketState';

@Entity()
export class Bracket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column({
    type: 'enum',
    enum: BracketType,
    default: BracketType.SingleElimination,
  })
  type: BracketType;

  @Column({
    type: 'enum',
    enum: BracketState,
    default: BracketState.Registration,
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

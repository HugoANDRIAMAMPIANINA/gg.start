import { Match } from 'src/matches/entities/match.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BracketPlayer } from '../../bracket-players/entities/bracket-player.entity';

@Entity()
@Unique(['match', 'slot'])
export class MatchPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Match, (match) => match.players, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  match: Match;

  @ManyToOne(() => BracketPlayer, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bracketPlayer: BracketPlayer;

  @Column()
  slot: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  isWinner: boolean;
}

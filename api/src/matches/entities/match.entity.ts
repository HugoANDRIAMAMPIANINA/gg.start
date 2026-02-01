import { Bracket } from 'src/brackets/entities/bracket.entity';
import { MatchState } from 'src/common/enums/match-state.enum';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roundNumber: number;

  @Column()
  roundMatchNumber: number;

  @ManyToOne(() => Bracket, (bracket) => bracket.matches, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bracket: Bracket;

  @Column({
    type: 'enum',
    enum: MatchState,
    default: MatchState.PENDING,
  })
  state: MatchState;

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match, {
    cascade: true,
  })
  players: MatchPlayer[];

  @ManyToOne(() => Match, { nullable: true })
  winnerNextMatch: Match | null;

  @Column({ type: 'int', nullable: true })
  winnerNextSlot: number | null;

  @ManyToOne(() => Match, { nullable: true })
  loserNextMatch: Match | null;

  @Column({ type: 'int', nullable: true })
  loserNextSlot: number | null;
}

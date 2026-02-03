import { Match } from 'src/matches/entities/match.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BracketPlayer } from '../../bracket-players/entities/bracket-player.entity';
import { ScorableComponent } from 'src/common/interfaces/scorable_component.interface';
import { IsBoolean, IsInt, IsUUID } from 'class-validator';

@Entity()
@Unique(['match', 'slot'])
export class MatchPlayer implements ScorableComponent {
  @IsUUID()
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

  @IsInt()
  @Column()
  slot: number;

  @IsInt()
  @Column({ default: 0 })
  score: number;

  @IsBoolean()
  @Column({ default: false })
  isWinner: boolean;

  getTotalScore(): number {
    return this.score;
  }

  getWinCount(): number {
    return this.isWinner ? 1 : 0;
  }
}

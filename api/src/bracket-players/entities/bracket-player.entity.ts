import { Bracket } from 'src/brackets/entities/bracket.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ScorableComponent } from 'src/common/interfaces/scorable_component.interface';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';

@Entity()
@Unique(['bracket', 'user']) // Un utilisateur ne peut s'incrire qu'une seule fois dans un Bracket
export class BracketPlayer implements ScorableComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bracket, (bracket) => bracket.players, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bracket: Bracket;

  @ManyToOne(() => User, (user) => user.brackets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  seed: number;

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.bracketPlayer)
  matchPlayers: MatchPlayer[];

  getTotalScore(): number {
    if (!this.matchPlayers || this.matchPlayers.length === 0) {
      return 0;
    }

    return this.matchPlayers.reduce(
      (total, matchPlayer) => total + matchPlayer.getTotalScore(),
      0,
    );
  }

  getWinCount(): number {
    if (!this.matchPlayers || this.matchPlayers.length === 0) {
      return 0;
    }

    return this.matchPlayers.reduce(
      (total, matchPlayer) => total + matchPlayer.getWinCount(),
      0,
    );
  }
}

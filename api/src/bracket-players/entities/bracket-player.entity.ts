import { Bracket } from 'src/brackets/entities/bracket.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['bracket', 'user']) // user can appear only once per bracket
export class BracketPlayer {
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
  seeding: number;
}

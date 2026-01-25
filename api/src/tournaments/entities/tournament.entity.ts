import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bracket } from 'src/brackets/entities/bracket.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => User, (user) => user.organizedTournaments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organizer: User;

  @OneToMany(() => Bracket, (bracket) => bracket.tournament)
  brackets: Bracket[];
}

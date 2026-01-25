import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Bracket } from 'src/brackets/entities/bracket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, User, Bracket])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}

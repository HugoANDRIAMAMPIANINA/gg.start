import { Module } from '@nestjs/common';
import { BracketsService } from './brackets.service';
import { BracketsController } from './brackets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Bracket } from './entities/bracket.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bracket, Tournament, BracketPlayer, User]),
  ],
  controllers: [BracketsController],
  providers: [BracketsService],
})
export class BracketsModule {}

import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Bracket } from 'src/brackets/entities/bracket.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Bracket, MatchPlayer])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}

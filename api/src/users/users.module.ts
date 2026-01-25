import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { BracketPlayer } from '../bracket-players/entities/bracket-player.entity';
import { Bracket } from 'src/brackets/entities/bracket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tournament, BracketPlayer, Bracket]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

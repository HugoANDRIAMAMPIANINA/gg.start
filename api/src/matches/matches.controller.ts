import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { SetMatchScoreDto } from './dto/set-match-score.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/roles/enums/role.enum';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':matchId')
  findOneById(@Param('matchId') matchId: string) {
    return this.matchesService.findOneById(matchId);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @Post(':matchId/start')
  async markMatchAsOngoing(@Param('matchId') matchId: string) {
    await this.matchesService.markMatchAsOngoing(matchId);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @Post(':matchId/set-score')
  setMatchScore(
    @Param('matchId') matchId: string,
    @Body() setMatchScoreDto: SetMatchScoreDto,
  ) {
    return this.matchesService.setMatchScore(matchId, setMatchScoreDto);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { SetMatchScoreDto } from './dto/set-match-score.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':matchId')
  findOneById(@Param('matchId') matchId: string) {
    return this.matchesService.findOneById(matchId);
  }

  @Post(':matchId/set-score')
  setMatchScore(
    @Param('matchId') matchId: string,
    @Body() setMatchScoreDto: SetMatchScoreDto,
  ) {
    return this.matchesService.setMatchScore(matchId, setMatchScoreDto);
  }
}

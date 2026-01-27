import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':matchId')
  findOneById(@Param('matchId') id: string) {
    return this.matchesService.findOneById(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { SetMatchScoreDto } from './dto/set-match-score.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Public()
  @Get(':matchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a match by id',
    description: 'Returns match details including players, score and status.',
  })
  @ApiParam({
    name: 'matchId',
    description: 'Match UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match found',
  })
  findOneById(@Param('matchId') matchId: string) {
    return this.matchesService.findOneById(matchId);
  }

  @Post(':matchId/start')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Start a match',
    description:
      'Marks a match as ongoing. Only tournament organizers are allowed.',
  })
  @ApiParam({
    name: 'matchId',
    description: 'Match UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match successfully marked as ongoing',
  })
  async markMatchAsOngoing(@Param('matchId') matchId: string) {
    await this.matchesService.markMatchAsOngoing(matchId);
  }

  @Post(':matchId/set-score')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set match score',
    description:
      'Sets the score of a match. This may also mark the match as finished.',
  })
  @ApiParam({
    name: 'matchId',
    description: 'Match UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match score successfully updated',
  })
  setMatchScore(
    @Param('matchId') matchId: string,
    @Body() setMatchScoreDto: SetMatchScoreDto,
  ) {
    return this.matchesService.setMatchScore(matchId, setMatchScoreDto);
  }
}

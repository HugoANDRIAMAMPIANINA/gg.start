import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from './dto/create-bracket.dto';
import { UpdateBracketDto } from './dto/update-bracket.dto';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';
import { UpdatePlayersSeedingDto } from './dto/update-players-seeding.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorators/roles.decorator';

@ApiTags('Brackets')
@Controller('brackets')
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a bracket',
    description: 'Creates a new bracket for a tournament. Organizer only.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bracket successfully created',
  })
  create(@Body() createBracketDto: CreateBracketDto) {
    return this.bracketsService.create(createBracketDto);
  }

  @Public()
  @Get(':bracketId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a bracket by id',
    description: 'Returns a bracket based on its UUID.',
  })
  @ApiParam({
    name: 'bracketId',
    description: 'Bracket UUID',
  })
  findOne(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findOneById(bracketId);
  }

  @Patch(':bracketId')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a bracket',
    description: 'Updates a bracket. Organizer only.',
  })
  update(
    @Param('bracketId') bracketId: string,
    @Body() updateBracketDto: UpdateBracketDto,
  ) {
    return this.bracketsService.update(bracketId, updateBracketDto);
  }

  @Delete(':bracketId')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Delete a bracket',
    description: 'Deletes a bracket. Organizer only.',
  })
  remove(@Param('bracketId') bracketId: string) {
    return this.bracketsService.remove(bracketId);
  }

  @Post(':bracketId/players')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add a player to a bracket',
    description:
      'Adds a player to the bracket and regenerates the bracket matches.',
  })
  @ApiParam({
    name: 'bracketId',
    description: 'Bracket UUID',
  })
  async addPlayer(
    @Param('bracketId') bracketId: string,
    @Body() createBracketPlayerDto: CreateBracketPlayerDto,
  ) {
    await this.bracketsService.addPlayer(bracketId, createBracketPlayerDto);
    await this.bracketsService.generateBracket(bracketId);
  }

  @Public()
  @Get(':bracketId/players')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get bracket players',
    description: 'Returns all players registered in the bracket.',
  })
  findPlayers(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findPlayers(bracketId);
  }

  @Delete(':bracketId/players/:bracketPlayerId')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Remove a player from a bracket',
    description:
      'Removes a player from the bracket and regenerates the matches.',
  })
  async removePlayer(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    await this.bracketsService.removePlayer(bracketId, bracketPlayerId);
    await this.bracketsService.generateBracket(bracketId);
  }

  @Public()
  @Get(':bracketId/players/:bracketPlayerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get player statistics in a bracket',
    description:
      'Returns statistics (wins, scores, etc.) for a player in a bracket.',
  })
  getPlayerStats(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    return this.bracketsService.getPlayerStats(bracketId, bracketPlayerId);
  }

  @Public()
  @Get(':bracketId/matches')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get bracket matches',
    description: 'Returns all matches of the bracket.',
  })
  findBracketMatches(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findBracketMatches(bracketId);
  }

  @Post(':bracketId/update-seeding')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Update bracket players seeding',
    description: 'Updates players seeding and regenerates the bracket matches.',
  })
  async updateBracketSeeding(
    @Param('bracketId') bracketId: string,
    @Body() updatePlayersSeedingDto: UpdatePlayersSeedingDto,
  ) {
    await this.bracketsService.updateBracketSeeding(
      bracketId,
      updatePlayersSeedingDto,
    );
    await this.bracketsService.generateBracket(bracketId);
  }
}

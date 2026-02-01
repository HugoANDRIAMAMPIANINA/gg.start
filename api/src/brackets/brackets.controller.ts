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
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from '../brackets/dto/create-bracket.dto';
import { UpdateBracketDto } from '../brackets/dto/update-bracket.dto';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';
import { UpdatePlayersSeedingDto } from './dto/update-players-seeding.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('brackets')
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createBracketDto: CreateBracketDto) {
    return this.bracketsService.create(createBracketDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':bracketId')
  findOne(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findOneById(bracketId);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @Patch(':bracketId')
  update(
    @Param('bracketId') bracketId: string,
    @Body() updateBracketDto: UpdateBracketDto,
  ) {
    return this.bracketsService.update(bracketId, updateBracketDto);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':bracketId')
  remove(@Param('bracketId') bracketId: string) {
    return this.bracketsService.remove(bracketId);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post(':bracketId/players')
  async addPlayer(
    @Param('bracketId') bracketId: string,
    @Body() createBracketPlayerDto: CreateBracketPlayerDto,
  ) {
    await this.bracketsService.addPlayer(bracketId, createBracketPlayerDto);

    await this.bracketsService.generateBracket(bracketId);
    return;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':bracketId/players')
  findPlayers(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findPlayers(bracketId);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':bracketId/players/:bracketPlayerId')
  async removePlayer(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    await this.bracketsService.removePlayer(bracketId, bracketPlayerId);

    await this.bracketsService.generateBracket(bracketId);
    return;
  }

  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':bracketId/players/:bracketPlayerId')
  getPlayerStats(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    return this.bracketsService.getPlayerStats(bracketId, bracketPlayerId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':bracketId/matches')
  findBracketMatches(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findBracketMatches(bracketId);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.CREATED)
  @Post(':bracketId/update-seeding')
  async updateBracketSeeding(
    @Param('bracketId') bracketId: string,
    @Body() updatePlayersSeedingDto: UpdatePlayersSeedingDto,
  ) {
    await this.bracketsService.updateBracketSeeding(
      bracketId,
      updatePlayersSeedingDto,
    );
    await this.bracketsService.generateBracket(bracketId);
    return;
  }

  // Cette route est commentée car elle sert uniquement de route de test pour la génération d'arbre de tournoi
  // @ApiBearerAuth()
  // @Roles(Role.TOURNAMENT_ORGANIZER)
  // @Post(':bracketId/generate')
  // generateBracket(@Param('bracketId') bracketId: string) {
  //   return this.bracketsService.generateBracket(bracketId);
  // }
}

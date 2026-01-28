import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from '../brackets/dto/create-bracket.dto';
import { UpdateBracketDto } from '../brackets/dto/update-bracket.dto';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';
import { UpdatePlayersSeedingDto } from './dto/update-players-seeding.dto';

@Controller('brackets')
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @Post()
  create(@Body() createBracketDto: CreateBracketDto) {
    return this.bracketsService.create(createBracketDto);
  }

  @Get(':bracketId')
  findOne(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findOneById(bracketId);
  }

  @Patch(':bracketId')
  update(
    @Param('bracketId') bracketId: string,
    @Body() updateBracketDto: UpdateBracketDto,
  ) {
    return this.bracketsService.update(bracketId, updateBracketDto);
  }

  @Delete(':bracketId')
  remove(@Param('bracketId') bracketId: string) {
    return this.bracketsService.remove(bracketId);
  }

  @Post(':bracketId/players')
  async addPlayer(
    @Param('bracketId') bracketId: string,
    @Body() createBracketPlayerDto: CreateBracketPlayerDto,
  ) {
    await this.bracketsService.addPlayer(bracketId, createBracketPlayerDto);

    await this.bracketsService.generateBracket(bracketId);
    return;
  }

  @Get(':bracketId/players')
  findPlayers(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findPlayers(bracketId);
  }

  @Delete(':bracketId/players/:bracketPlayerId')
  removePlayer(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    return this.bracketsService.removePlayer(bracketId, bracketPlayerId);
  }

  @Get(':bracketId/matches')
  findBracketMatches(@Param('bracketId') bracketId: string) {
    return this.bracketsService.findBracketMatches(bracketId);
  }

  @Post(':bracketId/update-seeding')
  updateBracketSeeding(
    @Param('bracketId') bracketId: string,
    @Body() updatePlayersSeedingDto: UpdatePlayersSeedingDto,
  ) {
    return this.bracketsService.updateBracketSeeding(
      bracketId,
      updatePlayersSeedingDto,
    );
  }

  @Post(':bracketId/generate')
  generateBracket(@Param('bracketId') bracketId: string) {
    return this.bracketsService.generateBracket(bracketId);
  }
}

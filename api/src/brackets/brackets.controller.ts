import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from '../brackets/dto/create-bracket.dto';
import { UpdateBracketDto } from '../brackets/dto/update-bracket.dto';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';

@Controller('brackets')
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @Post()
  create(@Body() createBracketDto: CreateBracketDto) {
    return this.bracketsService.create(createBracketDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bracketsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBracketDto: UpdateBracketDto) {
    return this.bracketsService.update(id, updateBracketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bracketsService.remove(id);
  }

  @Post(':id/players')
  addPlayer(
    @Param('id') id: string,
    @Body() createBracketPlayerDto: CreateBracketPlayerDto,
  ) {
    return this.bracketsService.addPlayer(id, createBracketPlayerDto);
  }

  @Get(':id/players')
  findPlayers(@Param('id') id: string) {
    return this.bracketsService.findPlayers(id);
  }

  @Delete(':bracketId/players/:bracketPlayerId')
  removePlayer(
    @Param('bracketId') bracketId: string,
    @Param('bracketPlayerId') bracketPlayerId: string,
  ) {
    return this.bracketsService.removePlayer(bracketId, bracketPlayerId);
  }
}

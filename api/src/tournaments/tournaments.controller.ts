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
  Request,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Request() req, @Body() createTournamentDto: CreateTournamentDto) {
    const organizerId: string = req.user.sub;
    return this.tournamentsService.create(createTournamentDto, organizerId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':tournamentId')
  findOne(@Param('tournamentId') tournamentId: string) {
    return this.tournamentsService.findOneById(tournamentId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    return this.tournamentsService.findByName(name);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @Patch(':tournamentId')
  update(
    @Param('tournamentId') tournamentId: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(tournamentId, updateTournamentDto);
  }

  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':tournamentId')
  remove(@Param('tournamentId') tournamentId: string) {
    return this.tournamentsService.remove(tournamentId);
  }
}

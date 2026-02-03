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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a tournament',
    description:
      'Creates a new tournament. The authenticated user becomes the organizer.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tournament successfully created',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  create(@Request() req, @Body() createTournamentDto: CreateTournamentDto) {
    const organizerId: string = req.user.sub;
    return this.tournamentsService.create(createTournamentDto, organizerId);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all tournaments',
    description: 'Returns the list of all tournaments.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tournaments returned',
  })
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Public()
  @Get(':tournamentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a tournament by id',
    description: 'Returns a tournament based on its UUID.',
  })
  @ApiParam({
    name: 'tournamentId',
    description: 'Tournament UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tournament found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tournament not found',
  })
  findOne(@Param('tournamentId') tournamentId: string) {
    return this.tournamentsService.findOneById(tournamentId);
  }

  @Public()
  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tournaments by name',
    description: 'Returns tournaments matching the given name.',
  })
  @ApiParam({
    name: 'name',
    description: 'Tournament name',
    example: 'Summer Cup',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tournaments found',
  })
  findByName(@Param('name') name: string) {
    return this.tournamentsService.findByName(name);
  }

  @Patch(':tournamentId')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a tournament',
    description:
      'Updates a tournament. Only the organizer of the tournament can perform this action.',
  })
  @ApiParam({
    name: 'tournamentId',
    description: 'Tournament UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tournament successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not the tournament organizer',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  update(
    @Param('tournamentId') tournamentId: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(tournamentId, updateTournamentDto);
  }

  @Delete(':tournamentId')
  @ApiBearerAuth()
  @Roles(Role.TOURNAMENT_ORGANIZER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Delete a tournament',
    description:
      'Deletes a tournament. Only the organizer of the tournament can perform this action.',
  })
  @ApiParam({
    name: 'tournamentId',
    description: 'Tournament UUID',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Tournament successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not the tournament organizer',
  })
  remove(@Param('tournamentId') tournamentId: string) {
    return this.tournamentsService.remove(tournamentId);
  }
}

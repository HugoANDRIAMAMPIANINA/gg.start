import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TournamentsService {
  constructor(
    private userService: UsersService,

    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const organizer: User = await this.userService.findOneById(
      createTournamentDto.organizerId,
    );

    const tournament: Tournament = new Tournament();
    tournament.name = createTournamentDto.name;
    tournament.description = createTournamentDto.description;
    tournament.organizer = organizer;

    return await this.tournamentsRepository.save(tournament);
  }

  async findAll() {
    return await this.tournamentsRepository.find();
  }

  async findOneById(id: string) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
      relations: { brackets: true },
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async findByName(name: string) {
    return await this.tournamentsRepository.find({ where: { name: name } });
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament: Tournament = await this.findOneById(id);

    const newName = updateTournamentDto.name;
    if (newName) {
      tournament.name = newName;
    }
    const newDescription = updateTournamentDto.description;
    if (newDescription) {
      tournament.description = newDescription;
    }
    await this.tournamentsRepository.save(tournament);
  }

  async remove(id: string) {
    await this.tournamentsRepository.delete(id);
  }
}

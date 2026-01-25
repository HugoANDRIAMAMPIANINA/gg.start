import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const organizer = await this.usersRepository.findOneBy({
      id: createTournamentDto.organizerId,
    });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

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
    const tournaments = await this.tournamentsRepository.find({
      where: { id },
      relations: { brackets: true },
      take: 1,
    });
    if (tournaments.length === 0) {
      throw new NotFoundException('Tournament not found');
    }
    return tournaments[0];
  }

  findByName(name: string) {
    return this.tournamentsRepository.findBy({ name });
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.tournamentsRepository.findOneBy({ id });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
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

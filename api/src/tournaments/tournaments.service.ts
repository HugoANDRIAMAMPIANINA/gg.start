import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createTournamentDto: CreateTournamentDto, organizerId: string) {
    const organizer: User = await this.userService.findOneById(organizerId);

    if (createTournamentDto.startDate >= createTournamentDto.endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const tournament: Tournament = new Tournament();
    tournament.name = createTournamentDto.name;
    tournament.description = createTournamentDto.description;
    tournament.organizer = organizer;
    tournament.startDate = createTournamentDto.startDate;
    tournament.endDate = createTournamentDto.endDate;

    return await this.tournamentsRepository.save(tournament);
  }

  async findAll() {
    return await this.tournamentsRepository.find({
      relations: { brackets: true },
    });
  }

  async findRecentUpcoming(limit = 10) {
    const now = new Date();
    return await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .where('tournament.startDate > :now', { now })
      .orderBy('tournament.startDate', 'ASC')
      .take(limit)
      .getMany();
  }

  async findRecentFinished(limit = 10) {
    const now = new Date();
    return await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .where('tournament.endDate < :now', { now })
      .orderBy('tournament.endDate', 'DESC')
      .take(limit)
      .getMany();
  }

  async findRecentOrganizedByUser(userId: string, limit = 10) {
    return await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .innerJoin('tournament.organizer', 'organizer')
      .where('organizer.id = :userId', { userId })
      .orderBy('tournament.startDate', 'DESC')
      .take(limit)
      .getMany();
  }

  async findRecentParticipatedByUser(userId: string, limit = 10) {
    return await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .innerJoin('tournament.brackets', 'bracket')
      .innerJoin('bracket.players', 'bracketPlayer')
      .innerJoin('bracketPlayer.user', 'user')
      .where('user.id = :userId', { userId })
      .distinct(true)
      .orderBy('tournament.startDate', 'DESC')
      .take(limit)
      .getMany();
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
    const { name, description, startDate, endDate } = updateTournamentDto;

    if (name) tournament.name = name;
    if (description) tournament.description = description;
    if (startDate) tournament.startDate = startDate;
    if (endDate) tournament.endDate = endDate;

    const finalStartDate = startDate ?? tournament.startDate;
    const finalEndDate = endDate ?? tournament.endDate;

    if (finalStartDate >= finalEndDate) {
      throw new BadRequestException('startDate must be before endDate');
    }

    await this.tournamentsRepository.save(tournament);
  }

  async remove(id: string) {
    await this.tournamentsRepository.delete(id);
  }
}

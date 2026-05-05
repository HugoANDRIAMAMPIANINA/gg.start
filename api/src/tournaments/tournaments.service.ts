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
import { ArrayContains, LessThan, MoreThan, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

type TournamentWithStats = Tournament & {
  participantCount?: number;
  resultText?: string;
};

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

  async findRecentUpcoming(limit = 10): Promise<TournamentWithStats[]> {
    const now = new Date();

    const tournaments = await this.tournamentsRepository.find({
      relations: {
        brackets: { players: true },
        organizer: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        brackets: { id: true, players: true },
        organizer: { id: true, name: true },
      },
      where: { startDate: MoreThan(now) },
      order: { startDate: 'ASC' },
      take: limit,
    });

    return tournaments.map((tournament) => ({
      ...tournament,
      participantCount: this.getParticipantCount(tournament),
    }));
  }

  async findRecentFinished(limit = 10): Promise<TournamentWithStats[]> {
    const now = new Date();

    const tournaments = await this.tournamentsRepository.find({
      relations: {
        brackets: { players: true },
        organizer: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        brackets: { id: true, players: true },
        organizer: { id: true, name: true },
      },
      where: { endDate: LessThan(now) },
      order: { endDate: 'DESC' },
      take: limit,
    });

    return tournaments.map((tournament) => ({
      ...tournament,
      participantCount: this.getParticipantCount(tournament),
    }));
  }

  async findRecentOrganizedByUser(
    userId: string,
    limit = 10,
  ): Promise<TournamentWithStats[]> {
    const tournaments = await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.organizer', 'organizer')
      .leftJoinAndSelect('tournament.brackets', 'bracket')
      .leftJoinAndSelect('bracket.players', 'bracketPlayer')
      .leftJoinAndSelect('bracketPlayer.user', 'playerUser')
      .where('organizer.id = :userId', { userId })
      .orderBy('tournament.startDate', 'DESC')
      .take(limit)
      .getMany();

    return tournaments.map((tournament) => ({
      ...tournament,
      participantCount: this.getParticipantCount(tournament),
    }));
  }

  async findRecentParticipatedByUser(
    userId: string,
    limit = 10,
  ): Promise<TournamentWithStats[]> {
    // const tournaments = await this.tournamentsRepository
    //   .createQueryBuilder('tournament')
    //   .leftJoinAndSelect('tournament.organizer', 'organizer')
    //   .leftJoinAndSelect('tournament.brackets', 'bracket')
    //   .leftJoinAndSelect('bracket.players', 'bracketPlayer')
    //   .leftJoinAndSelect('bracketPlayer.user', 'playerUser')
    //   .where('playerUser.id = :userId', { userId })
    //   .distinct(true)
    //   .orderBy('tournament.startDate', 'DESC')
    //   .take(limit)
    //   .getMany();

    const tournaments = await this.tournamentsRepository.find({
      relations: {
        brackets: { players: true },
        organizer: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        brackets: { id: true, players: true },
        organizer: { id: true, name: true },
      },
      where: { brackets: { players: { user: { id: userId } } } },
      order: { startDate: 'DESC' },
      take: limit,
    });

    return tournaments.map((tournament) => ({
      ...tournament,
      participantCount: this.getParticipantCount(tournament),
      resultText: this.getTournamentResultText(tournament, userId),
    }));
  }

  async findOneById(id: string) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
      relations: { brackets: true, organizer: true },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        brackets: true,
        organizer: { id: true, name: true },
      },
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async findByName(name: string) {
    return await this.tournamentsRepository.find({ where: { name: name } });
  }

  private getParticipantCount(tournament: Tournament): number {
    const participantIds = new Set<string>();

    if (tournament.brackets) {
      tournament.brackets.forEach((bracket) => {
        bracket.players.forEach((player) => {
          if (player.user?.id) {
            participantIds.add(player.user.id);
          } else if (player.id) {
            participantIds.add(player.id);
          }
        });
      });
    }

    return participantIds.size;
  }

  private getTournamentResultText(
    tournament: Tournament,
    userId: string,
  ): string | undefined {
    const stats = [] as Array<{ userId: string; wins: number; score: number }>;

    tournament.brackets.forEach((bracket) => {
      bracket.players.forEach((player) => {
        if (!player.user?.id) {
          return;
        }

        stats.push({
          userId: player.user.id,
          wins: player.getWinCount(),
          score: player.getTotalScore(),
        });
      });
    });

    const distinctPlayerIds = Array.from(
      new Set(stats.map((item) => item.userId)),
    );
    const target = stats.find((item) => item.userId === userId);
    if (!target) {
      return undefined;
    }

    const ranking = stats
      .sort((a, b) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }
        return b.score - a.score;
      })
      .findIndex((item) => item.userId === userId);

    if (ranking === -1) {
      return undefined;
    }

    return `${ranking + 1}e / ${distinctPlayerIds.length}`;
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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBracketDto } from '../brackets/dto/create-bracket.dto';
import { UpdateBracketDto } from '../brackets/dto/update-bracket.dto';
import { Bracket } from './entities/bracket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Repository } from 'typeorm';
import { BracketType } from 'src/common/enums/bracket-type.enum';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';
import { User } from 'src/users/entities/user.entity';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { UpdatePlayersSeedingDto } from './dto/update-players-seeding.dto';
import { BracketGenerator } from './bracket-generation/bracket-generator.interface';
import { BracketGeneratorFactory } from './bracket-generation/bracket-generator.factory';
import { Match } from 'src/matches/entities/match.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import createMatchPlayer from 'src/match-players/helpers/create-match-player';
import { MatchState } from 'src/common/enums/match-state.enum';

@Injectable()
export class BracketsService {
  constructor(
    @InjectRepository(Bracket)
    private bracketsRepository: Repository<Bracket>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BracketPlayer)
    private bracketPlayersRepository: Repository<BracketPlayer>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(MatchPlayer)
    private matchPlayersRepository: Repository<MatchPlayer>,
  ) {}

  async create(createBracketDto: CreateBracketDto): Promise<Bracket> {
    const tournament = await this.tournamentsRepository.findOneBy({
      id: createBracketDto.tournamentId,
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    const bracket = new Bracket();

    bracket.name = createBracketDto.name;
    bracket.game = createBracketDto.game;

    const bracketType = createBracketDto.bracketType;
    switch (bracketType) {
      case 'SINGLE_ELIM':
        bracket.type = BracketType.SINGLE_ELIM;
        break;

      case 'DOUBLE_ELIM':
        bracket.type = BracketType.DOUBLE_ELIM;
        break;

      default:
        throw new BadRequestException();
    }

    bracket.tournament = tournament;
    return await this.bracketsRepository.save(bracket);
  }

  async findOneById(id: string): Promise<Bracket> {
    const bracket = await this.bracketsRepository.findOne({
      where: { id },
      relations: { players: { user: true } },
      order: { players: { seed: 'ASC' } },
    });
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }
    return bracket;
  }

  async update(id: string, updateBracketDto: UpdateBracketDto): Promise<void> {
    const bracket = await this.findOneById(id);

    const newName = updateBracketDto.name;
    if (newName) {
      bracket.name = newName;
    }

    const newGame = updateBracketDto.game;
    if (newGame) {
      bracket.game = newGame;
    }

    await this.bracketsRepository.save(bracket);
  }

  async remove(id: string): Promise<void> {
    await this.bracketsRepository.delete(id);
  }

  async updateBracketSeedingAfterRemove(players: BracketPlayer[]) {
    if (players.length < 1) {
      return;
    }
    let seed = 1;
    for (const player of players) {
      player.seed = seed;
      await this.bracketPlayersRepository.save(player);
      seed++;
    }
  }

  async addPlayer(
    id: string,
    createBracketPlayerDto: CreateBracketPlayerDto,
  ): Promise<BracketPlayer> {
    const user = await this.usersRepository.findOneBy({
      id: createBracketPlayerDto.userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bracket = await this.findOneById(id);

    const bracketPlayer = new BracketPlayer();
    bracketPlayer.bracket = bracket;
    bracketPlayer.seed = bracket.players.length + 1;
    bracketPlayer.user = user;

    return await this.bracketPlayersRepository.save(bracketPlayer);
  }

  async findPlayers(id: string): Promise<BracketPlayer[]> {
    const bracket = await this.findOneById(id);
    return bracket.players;
  }

  async removePlayer(
    bracketId: string,
    bracketPlayerId: string,
  ): Promise<void> {
    const bracket = await this.findOneById(bracketId);
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }

    const bracketPlayer = await this.bracketPlayersRepository.findOneBy({
      id: bracketPlayerId,
    });
    if (!bracketPlayer) {
      throw new NotFoundException('Bracket Player not found');
    }

    await this.bracketPlayersRepository.delete({ id: bracketPlayerId });

    const updatedPlayers = await this.bracketPlayersRepository.find({
      where: { bracket: { id: bracketId } },
      order: { seed: 'ASC' },
    });

    await this.updateBracketSeedingAfterRemove(updatedPlayers);
  }

  async findBracketMatches(bracketId: string): Promise<Match[]> {
    const bracket = await this.bracketsRepository.findOne({
      where: { id: bracketId },
      relations: {
        matches: { players: { bracketPlayer: { user: true } } },
      },
      order: {
        matches: {
          roundNumber: { direction: 'ASC' },
          roundMatchNumber: { direction: 'ASC' },
        },
      },
    });
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }
    return bracket.matches;
  }

  async updateBracketSeeding(
    bracketId: string,
    updatePlayersSeedingDto: UpdatePlayersSeedingDto,
  ) {
    const bracket = await this.findOneById(bracketId);
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }

    const players = updatePlayersSeedingDto.players;
    for (const player of players) {
      const bracketPlayer = await this.bracketPlayersRepository.findOneBy({
        id: player.bracketPlayerId,
      });

      if (bracketPlayer) {
        bracketPlayer.seed = player.seed;
        await this.bracketPlayersRepository.save(bracketPlayer);
      }
    }
  }

  async deleteBracketMatches(bracket: Bracket) {
    if (bracket.matches.length < 1) {
      return;
    }
    await this.matchesRepository.delete(
      bracket.matches.map((match) => match.id),
    );
  }

  async generateBracket(bracketId: string): Promise<void> {
    const bracket = await this.bracketsRepository.findOne({
      where: { id: bracketId },
      relations: { players: true, matches: true },
      order: { players: { seed: 'ASC' } },
    });
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }

    const players = bracket.players;
    if (players.length < 2) {
      return;
    }

    await this.deleteBracketMatches(bracket);

    const generator: BracketGenerator = BracketGeneratorFactory.create(
      bracket.type,
    );

    let matches: Match[] = generator.generateMatches(bracket);

    matches = await this.matchesRepository.save(matches);

    let matchPlayers: MatchPlayer[] = generator.generateFirstRoundMatchPlayers(
      matches,
      players,
    );

    matchPlayers = await this.matchPlayersRepository.save(matchPlayers);

    for (const matchPlayer of matchPlayers) {
      if (matchPlayer.isWinner) {
        if (
          matchPlayer.match.winnerNextMatch &&
          matchPlayer.match.winnerNextSlot
        ) {
          const nextMatchPlayer = createMatchPlayer(
            matchPlayer.match.winnerNextMatch,
            matchPlayer.bracketPlayer,
            matchPlayer.match.winnerNextSlot,
            false,
          );
          await this.matchPlayersRepository.save(nextMatchPlayer);
        }
        matchPlayer.match.state = MatchState.COMPLETED;
      } else {
        matchPlayer.match.state = MatchState.READY;
      }
      await this.matchesRepository.save(matchPlayer.match);
    }
  }
}

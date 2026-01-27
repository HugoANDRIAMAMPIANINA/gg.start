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
import { BracketType } from 'src/common/enum/bracket-type.enum';
import { CreateBracketPlayerDto } from 'src/bracket-players/dto/create-bracket-player.dto';
import { User } from 'src/users/entities/user.entity';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { UpdatePlayersSeedingDto } from './dto/update-players-seeding.dto';
import { BracketGenerator } from './bracket-generation/bracket-generator.interface';
import { BracketMatchGeneratorFactory } from './bracket-generation/bracket-generator.factory';
import generateBracketOrder from 'src/common/helpers/generate-bracket-order';

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
  ) {}

  async create(createBracketDto: CreateBracketDto) {
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
      case 'ROUND_ROBIN':
        bracket.type = BracketType.ROUND_ROBIN;
        break;
      default:
        throw new BadRequestException();
    }

    bracket.tournament = tournament;
    return await this.bracketsRepository.save(bracket);
  }

  async findOneById(id: string) {
    const brackets = await this.bracketsRepository.find({
      where: { id },
      relations: { players: { user: true } },
      take: 1,
    });
    if (brackets.length === 0) {
      throw new NotFoundException('Bracket not found');
    }
    return brackets[0];
  }

  async update(id: string, updateBracketDto: UpdateBracketDto) {
    const bracket = await this.bracketsRepository.findOneBy({ id });
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }

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

  async remove(id: string) {
    return await this.bracketsRepository.delete(id);
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

  async addPlayer(id: string, createBracketPlayerDto: CreateBracketPlayerDto) {
    const user = await this.usersRepository.findOneBy({
      id: createBracketPlayerDto.userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bracket = await this.findOneById(id);
    console.log(bracket);
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }

    const bracketPlayer = new BracketPlayer();
    bracketPlayer.bracket = bracket;
    bracketPlayer.seed = bracket.players.length + 1;
    bracketPlayer.user = user;

    return await this.bracketPlayersRepository.save(bracketPlayer);
  }

  async findPlayers(id: string) {
    const bracket = await this.findOneById(id);
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }
    return bracket.players;
  }

  async removePlayer(bracketId: string, bracketPlayerId: string) {
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
        id: player.playerId,
      });

      if (bracketPlayer) {
        bracketPlayer.seed = player.seed;
        await this.bracketPlayersRepository.save(bracketPlayer);
      }
    }
  }

  async generateBracket(bracketId: string) {
    const bracket = await this.bracketsRepository.findOne({
      where: { id: bracketId },
      relations: { players: true },
    });
    if (!bracket) {
      throw new NotFoundException('Bracket not found');
    }
    // const players = await this.bracketPlayersRepository.find({where: {bracket: {id: bracket.id}}})

    const players = bracket.players;
    // if (players.length < 2) {
    //   throw new Error('Minimum 2 players are required to generate a bracket');
    // }

    const generator: BracketGenerator = BracketMatchGeneratorFactory.create(
      bracket.type,
    );

    const matches = generator.generate(bracket, players);
    console.log(matches.length);

    // const seeding = generateBracketOrder(nearestPowerOfTwo);
    // console.log(seeding);
    // return matches;
  }
}

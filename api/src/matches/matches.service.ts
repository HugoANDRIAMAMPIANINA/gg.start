import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import { SetMatchScoreDto } from './dto/set-match-score.dto';
import { MatchState } from 'src/common/enums/match-state.enum';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { BracketState } from 'src/common/enums/bracket-state.enum';
import { Bracket } from 'src/brackets/entities/bracket.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(MatchPlayer)
    private matchPlayersRepository: Repository<MatchPlayer>,
    @InjectRepository(Bracket)
    private bracketsRepository: Repository<Bracket>,
  ) {}

  async findOneById(id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: id },
      relations: { players: { bracketPlayer: true } },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async findOneByIdWithBracket(id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: id },
      relations: {
        players: { bracketPlayer: true },
        bracket: true,
        winnerNextMatch: true,
        loserNextMatch: true,
      },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async updateMatchState(match: Match, matchState: MatchState) {
    match.state = matchState;
    await this.matchesRepository.save(match);
  }

  async markMatchAsOngoing(id: string) {
    const match = await this.findOneById(id);
    if (match.state !== MatchState.READY) {
      throw new ConflictException({
        message: 'Invalid MatchState transition',
        currentState: match.state,
        requiredState: MatchState.READY,
      });
    }
    await this.updateMatchState(match, MatchState.ONGOING);
  }

  async setMatchScore(id: string, setMatchScoreDto: SetMatchScoreDto) {
    const match = await this.findOneByIdWithBracket(id);

    if (match.state !== MatchState.ONGOING) {
      throw new BadRequestException('Match is not ongoing');
    }

    const matchPlayers: MatchPlayer[] = [];

    for (const matchPlayerScore of setMatchScoreDto.matchScore) {
      const matchPlayer = match.players.find(
        (matchPlayer) => matchPlayer.id === matchPlayerScore.matchPlayerId,
      );
      if (!matchPlayer) {
        throw new BadRequestException('MatchPlayer not found');
      }

      matchPlayer.score = matchPlayerScore.score;
      matchPlayers.push(matchPlayer);
    }

    let [player1, player2] = matchPlayers;
    if (player1.score === player2.score) {
      throw new BadRequestException('MatchPlayers have the same score');
    }

    [player1, player2] = await this.matchPlayersRepository.save(matchPlayers);

    const winner = player1.score > player2.score ? player1 : player2;
    const loser = winner === player1 ? player2 : player1;

    await this.updateMatchState(match, MatchState.COMPLETED);

    // Send winner to its next match
    if (match.winnerNextMatch && match.winnerNextSlot) {
      await this.sendPlayerToNextMatch(
        winner.bracketPlayer,
        match.winnerNextMatch,
        match.winnerNextSlot,
      );
    } else {
      // No more Matches => Bracket is completed
      match.bracket.state = BracketState.COMPLETED;
      await this.bracketsRepository.save(match.bracket);
    }

    // Send loser to its next match
    if (match.loserNextMatch && match.loserNextSlot) {
      await this.sendPlayerToNextMatch(
        loser.bracketPlayer,
        match.loserNextMatch,
        match.loserNextSlot,
      );
    }
  }

  async sendPlayerToNextMatch(
    bracketPlayer: BracketPlayer,
    nextMatch: Match,
    nextMatchSlot: number,
  ) {
    // Crée un nouveau MatchPlayer
    const matchPlayer = new MatchPlayer();
    matchPlayer.bracketPlayer = bracketPlayer;
    matchPlayer.match = nextMatch;
    matchPlayer.slot = nextMatchSlot;

    await this.matchPlayersRepository.save(matchPlayer);

    // check if next match has 2 players -> state = READY else PENDING
    nextMatch = await this.findOneById(nextMatch.id);
    if (nextMatch.players.length === 2) {
      nextMatch.state = MatchState.READY;
    }

    await this.matchesRepository.save(nextMatch);
  }
}

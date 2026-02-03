import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Bracket } from '../../entities/bracket.entity';
import { BracketGenerator } from '../bracket-generator.interface';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import generateBracketOrder from 'src/common/helpers/generate-bracket-order';
import createMatchPlayer from 'src/match-players/helpers/create-match-player';

export class SingleEliminationGenerator implements BracketGenerator {
  generateMatches(bracket: Bracket): Match[] {
    const matches: Match[] = [];

    let nearestPowerOfTwo: number = 2;
    let roundCount: number = 1;
    while (nearestPowerOfTwo < bracket.players.length) {
      nearestPowerOfTwo *= 2;
      roundCount += 1;
    }

    const currentRound = roundCount;
    const roundMatchNumber = 1;

    const finalMatch = new Match();
    finalMatch.bracket = bracket;
    finalMatch.roundNumber = currentRound;
    finalMatch.roundMatchNumber = 1;

    matches.push(finalMatch);

    this.createMatch(
      matches,
      finalMatch,
      1,
      currentRound - 1,
      roundMatchNumber * 2 - 1,
    );
    this.createMatch(
      matches,
      finalMatch,
      2,
      currentRound - 1,
      roundMatchNumber * 2,
    );

    return matches;
  }

  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[] {
    const matchPlayers: MatchPlayer[] = [];

    let nearestPowerOfTwo: number = 2;
    while (nearestPowerOfTwo < players.length) {
      nearestPowerOfTwo *= 2;
    }

    const bracketOrder: number[] = generateBracketOrder(nearestPowerOfTwo);

    matches = matches
      .filter((match) => match.roundNumber === 1)
      .sort((a, b) => a.roundMatchNumber - b.roundMatchNumber);

    // bracketOrder.map((seed));
    matches.map((match, index) => {
      const player1 = players.find(
        (player) => player.seed === bracketOrder[index * 2] + 1,
      );
      const player2 = players.find(
        (player) => player.seed === bracketOrder[index * 2 + 1] + 1,
      );
      const isWinner = player2 === undefined ? true : false;

      if (player1) {
        matchPlayers.push(createMatchPlayer(match, player1, 1, isWinner));
      }
      if (player2) {
        matchPlayers.push(createMatchPlayer(match, player2, 2, isWinner));
      }
    });

    return matchPlayers;
  }

  private createMatch(
    matches: Match[],
    winnerNextMatch: Match,
    winnerNextSlot: number,
    currentRound: number,
    roundMatchNumber: number,
  ): void {
    if (currentRound < 1) {
      return;
    }
    const match: Match = new Match();
    match.bracket = winnerNextMatch.bracket;
    match.winnerNextMatch = winnerNextMatch;
    match.winnerNextSlot = winnerNextSlot;
    match.roundNumber = currentRound;
    match.roundMatchNumber = roundMatchNumber;

    matches.push(match);

    this.createMatch(
      matches,
      match,
      1,
      currentRound - 1,
      roundMatchNumber * 2 - 1,
    );
    this.createMatch(matches, match, 2, currentRound - 1, roundMatchNumber * 2);
  }
}

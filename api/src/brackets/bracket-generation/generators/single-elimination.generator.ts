import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Bracket } from '../../entities/bracket.entity';
import { BracketGenerator } from '../bracket-generator.interface';
import { User } from 'src/users/entities/user.entity';

export class SingleEliminationGenerator implements BracketGenerator {
  generate(bracket: Bracket): Match[] {
    const matches: Match[] = [];

    const testPlayers: BracketPlayer[] = [];
    for (let i = 1; i <= 15; i++) {
      const testUser: User = new User();
      testUser.name = `player${i}`;
      const testPlayer = new BracketPlayer();
      testPlayer.seed = i;
      testPlayer.user = testUser;
      testPlayers.push(testPlayer);
    }

    const sortedPlayers = [...testPlayers].sort((a, b) => a.seed - b.seed);
    // console.log(sortedPlayers);

    let nearestPowerOfTwo: number = 2;
    let roundCount: number = 1;
    while (nearestPowerOfTwo < sortedPlayers.length) {
      nearestPowerOfTwo *= 2;
      roundCount += 1;
    }

    console.log(
      `nearestPowerOfTwo: ${nearestPowerOfTwo}\nround_count: ${roundCount}`,
    );

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
    // console.log(currentRound);
    // console.log(match.id);
    // console.log(`WR${currentRound}M${roundMatchNumber}`);
    // console.log(match.winnerNextSlot);
    matches.push(match);

    this.createMatch(
      matches,
      match,
      1,
      currentRound - 1,
      roundMatchNumber * 2 - 1,
    );
    this.createMatch(matches, match, 2, currentRound - 1, roundMatchNumber * 2);
    // return match;
  }

  // private createParticipant(
  //   match: Match,
  //   player: BracketPlayer,
  //   slot: number,
  // ): MatchPlayer {
  //   const matchPlayer = new MatchPlayer();
  //   matchPlayer.match = match;
  //   matchPlayer.bracketPlayer = player;
  //   matchPlayer.slot = slot;
  //   matchPlayer.score = 0;
  //   return matchPlayer;
  // }
}

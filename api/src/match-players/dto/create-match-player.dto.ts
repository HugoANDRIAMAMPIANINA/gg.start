import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchPlayerDto {
  @ApiProperty({ type: 'string', description: 'A Match UUID' })
  matchId: string;

  @ApiProperty({ type: 'string', description: 'A BracketPlayer UUID' })
  bracketPlayerId: string;

  @ApiProperty({
    type: 'integer',
    description:
      'An integer representing the MatchPlayer slot in the given match',
  })
  slot: number;
}

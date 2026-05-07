import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateMatchPlayerDto {
  @IsUUID()
  @ApiProperty({ type: 'string', description: 'A Match UUID' })
  matchId: string;

  @IsUUID()
  @ApiProperty({ type: 'string', description: 'A BracketPlayer UUID' })
  bracketPlayerId: string;

  @IsNumber()
  @ApiProperty({
    type: 'integer',
    description:
      'An integer representing the MatchPlayer slot in the given match',
  })
  slot: number;
}

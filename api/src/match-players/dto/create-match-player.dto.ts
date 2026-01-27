import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchPlayerDto {
  @ApiProperty()
  matchId: string;

  @ApiProperty()
  bracketPlayerId: string;

  @ApiProperty()
  slot: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateBracketDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  game: string;

  @ApiProperty()
  bracketType: string;

  @ApiProperty()
  tournamentId: string;
}

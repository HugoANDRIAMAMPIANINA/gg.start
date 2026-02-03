import { ApiProperty } from '@nestjs/swagger';

export class UpdateBracketDto {
  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket name',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket game',
  })
  game: string;
}

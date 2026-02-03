import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({
    type: 'string',
    description: 'A string used as Tournament name',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'A string used as Tournament description',
  })
  description: string | null;
}

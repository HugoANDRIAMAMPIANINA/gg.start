import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class Player {
  @IsUUID()
  @ApiProperty({ type: 'string', description: 'A BracketPlayer UUID' })
  bracketPlayerId: string;

  @ApiProperty({
    type: 'integer',
    description: 'An integer representing the BracketPlayer updated seed',
  })
  seed: number;
}

export class UpdatePlayersSeedingDto {
  @ApiProperty({
    type: [Player],
    description: 'A list of BracketPlayer UUID and their updated seed',
  })
  players: Player[];
}

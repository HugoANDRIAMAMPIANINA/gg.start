import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsUUID } from 'class-validator';

class Player {
  @IsUUID()
  @ApiProperty({ type: 'string', description: 'A BracketPlayer UUID' })
  bracketPlayerId: string;

  @IsNumber()
  @ApiProperty({
    type: 'integer',
    description: 'An integer representing the BracketPlayer updated seed',
  })
  seed: number;
}

export class UpdatePlayersSeedingDto {
  @IsArray()
  @ApiProperty({
    type: [Player],
    description: 'A list of BracketPlayer UUID and their updated seed',
  })
  players: Player[];
}

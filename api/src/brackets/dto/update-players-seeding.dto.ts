import { ApiProperty } from '@nestjs/swagger';

interface Player {
  bracketPlayerId: string;
  seed: number;
}

export class UpdatePlayersSeedingDto {
  @ApiProperty()
  players: Player[];
}

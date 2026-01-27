import { ApiProperty } from '@nestjs/swagger';

interface Player {
  playerId: string;
  seed: number;
}

export class UpdatePlayersSeedingDto {
  @ApiProperty()
  players: Player[];
}

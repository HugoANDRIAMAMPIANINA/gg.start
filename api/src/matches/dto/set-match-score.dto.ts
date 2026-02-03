import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  IsUUID,
} from 'class-validator';

export class MatchPlayerScoreDto {
  @ApiProperty({ type: 'string', description: 'A MatchPlayer UUID' })
  @IsUUID()
  matchPlayerId: string;

  @ApiProperty({
    type: 'integer',
    description: 'An integer representing the MatchPlayer score',
  })
  @IsInt()
  score: number;
}

export class SetMatchScoreDto {
  @ApiProperty({
    type: [MatchPlayerScoreDto],
    description: 'A MatchPlayer UUID and score object',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  matchScore: MatchPlayerScoreDto[];
}

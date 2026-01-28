import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  IsUUID,
} from 'class-validator';

export class MatchPlayerScoreDto {
  @ApiProperty({ type: 'string', description: 'A MatchPlayer Id' })
  @IsUUID()
  matchPlayerId: string;

  @ApiProperty()
  @IsInt()
  score: number;
}

export class SetMatchScoreDto {
  @ApiProperty({ type: [MatchPlayerScoreDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  matchScore: MatchPlayerScoreDto[];
}

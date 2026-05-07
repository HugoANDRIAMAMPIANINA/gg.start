import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UpdateBracketDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket name',
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket game',
  })
  game: string;

  @ApiProperty({
    type: 'string',
    description:
      'An ISO 8601 string containing a date used as the starting date of tournament',
  })
  @IsDate()
  @Type(() => Date) // Transforms the incoming ISO string to a Date object
  startDate: Date;
}

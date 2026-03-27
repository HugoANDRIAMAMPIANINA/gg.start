import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string used as Tournament name',
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string used as Tournament description',
  })
  description: string | null;

  @ApiProperty({
    type: 'string',
    description:
      'An ISO 8601 string containing a date used as the starting date of tournament',
  })
  @IsDate()
  @Type(() => Date) // Transforms the incoming ISO string to a Date object
  startDate: Date;

  @ApiProperty({
    type: 'string',
    description:
      'An ISO 8601 string containing a date used as the ending date of tournament',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

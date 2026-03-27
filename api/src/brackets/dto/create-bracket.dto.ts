import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { BracketType } from 'src/common/enums/bracket-type.enum';

export class CreateBracketDto {
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

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket type',
    enum: BracketType,
    enumName: 'BracketType',
  })
  bracketType: string;

  @ApiProperty({
    type: 'string',
    description:
      'An ISO 8601 string containing a date used as the starting date of tournament',
  })
  @IsDate()
  @Type(() => Date) // Transforms the incoming ISO string to a Date object
  startDate: Date;

  @IsUUID()
  @ApiProperty({
    type: 'string',
    description: 'A Tournament UUID',
  })
  tournamentId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { BracketType } from 'src/common/enums/bracket-type.enum';

export class CreateBracketDto {
  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket name',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket game',
  })
  game: string;

  @ApiProperty({
    type: 'string',
    description: 'A string representing Bracket type',
    enum: BracketType,
    enumName: 'BracketType',
  })
  bracketType: string;

  @ApiProperty({
    type: 'string',
    description: 'A Tournament UUID',
  })
  tournamentId: string;
}

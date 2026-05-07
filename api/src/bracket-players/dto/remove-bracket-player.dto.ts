import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveBracketPlayerDto {
  @IsUUID()
  @ApiProperty({
    type: 'string',
    description: 'A User UUID',
  })
  userId: string;
}

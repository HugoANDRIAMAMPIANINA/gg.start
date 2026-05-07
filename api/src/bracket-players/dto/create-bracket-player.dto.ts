import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateBracketPlayerDto {
  @IsUUID()
  @ApiProperty({
    type: 'string',
    description: 'A User UUID',
  })
  userId: string;
}

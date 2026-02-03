import { ApiProperty } from '@nestjs/swagger';

export class CreateBracketPlayerDto {
  @ApiProperty({
    type: 'string',
    description: 'A User UUID',
  })
  userId: string;
}

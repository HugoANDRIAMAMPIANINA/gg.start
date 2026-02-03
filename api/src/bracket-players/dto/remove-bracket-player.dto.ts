import { ApiProperty } from '@nestjs/swagger';

export class RemoveBracketPlayerDto {
  @ApiProperty({
    type: 'string',
    description: 'A User UUID',
  })
  userId: string;
}

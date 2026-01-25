import { ApiProperty } from '@nestjs/swagger';

export class RemoveBracketPlayerDto {
  @ApiProperty()
  userId: string;
}

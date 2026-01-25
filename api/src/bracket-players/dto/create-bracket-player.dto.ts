import { ApiProperty } from '@nestjs/swagger';

export class CreateBracketPlayerDto {
  @ApiProperty()
  userId: string;
}

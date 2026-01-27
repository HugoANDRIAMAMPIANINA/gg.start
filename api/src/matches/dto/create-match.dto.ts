import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  bracketId: string;
}

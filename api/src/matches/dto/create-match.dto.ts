import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsUUID()
  @ApiProperty({ type: 'string', description: 'A Bracket UUID' })
  bracketId: string;
}

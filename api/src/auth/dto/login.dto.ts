import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    description: 'A string representing an email address',
  })
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string representing a password',
  })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: 'string',
    description: 'A string representing an email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'A string representing a password',
  })
  password: string;
}

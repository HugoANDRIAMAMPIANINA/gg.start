import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'A string representing a username',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    type: 'string',
    description: 'A string representing an email address',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'A string representing a password',
  })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
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

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'A string representing a password',
  })
  password: string;
}

import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import type { Request, Response } from 'express';
import { RefreshGuard } from './refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login a user',
    description: 'Authenticates a user and returns a JWT access token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(response, loginDto.email, loginDto.password);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Give a new AccessToken to user',
    description:
      'Update the user RefreshToken and set a new AccessToken and updated RefreshToken',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated user profile',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token missing or invalid',
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.refresh(request, response);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get authenticated user profile',
    description: 'Returns the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated user profile',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token missing or invalid',
  })
  async getMe(@Req() request) {
    return await this.authService.getMe(request);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logout a user by nullifiying its refreshToken.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logout',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token missing or invalid',
  })
  async logout(@Req() request, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(request, response);
  }
}

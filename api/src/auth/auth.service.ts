import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt-payload.interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Session } from './entities/session.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(response: Response, email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const session = await this.generateSessionTokens(user);

    const refreshTokenHash = await bcrypt.hash(session.refreshToken, 10);

    await this.usersService.updateUserRefreshToken(user, refreshTokenHash);

    this.setSessionCookies(response, session);
  }

  async logout(request: Request, response: Response) {
    const user = await this.usersService.findOneByEmail(
      request['user']['email'],
    );
    await this.usersService.updateUserRefreshToken(user, null);
    this.clearSessionCookies(response);
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    response: Response,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    const userEntity = await this.usersService.findOneById(id);
    const accessToken = await this.generateAccessToken(userEntity);
    this.setAccessTokenCookie(response, accessToken);
    return updatedUser;
  }

  async getMe(request: Request): Promise<User> {
    return await this.usersService.findOneById(request['user']['sub']);
  }

  async refresh(request: Request, response: Response) {
    const accessToken: JwtPayload = this.jwtService.decode(
      request['accessToken'],
    );

    const user = await this.usersService.findOneByIdWithRefreshToken(
      accessToken.sub,
    );

    const storedRefreshToken = user.refreshToken;
    if (!storedRefreshToken) {
      throw new UnauthorizedException('User has no refreshToken');
    }

    const refreshTokensEquals = await bcrypt.compare(
      request['refreshToken'],
      storedRefreshToken,
    );

    if (!refreshTokensEquals) {
      throw new UnauthorizedException('RefreshTokens are different');
    }

    const session = await this.generateSessionTokens(user);

    const updatedRefreshTokenHash = await bcrypt.hash(session.refreshToken, 10);

    await this.usersService.updateUserRefreshToken(
      user,
      updatedRefreshTokenHash,
    );

    this.setSessionCookies(response, session);
  }

  private async generateSessionTokens(user: User): Promise<Session> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.name,
      organizedTournaments: user.organizedTournaments,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = uuidv4();

    const session: Session = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return session;
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.name,
      organizedTournaments: user.organizedTournaments,
    };

    return this.jwtService.signAsync(payload);
  }

  private setAccessTokenCookie(response: Response, accessToken: string) {
    const secure = this.configService.get('NODE_ENV') === 'production';
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.get<number>('TOKEN_COOKIES_EXPIRATION'),
    });
  }

  private setSessionCookies(response: Response, session: Session) {
    const secure = this.configService.get('NODE_ENV') === 'production';
    response.cookie('accessToken', session.accessToken, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.get<number>('TOKEN_COOKIES_EXPIRATION'),
    });
    response.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.get<number>('TOKEN_COOKIES_EXPIRATION'),
    });
  }

  private clearSessionCookies(response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }
}

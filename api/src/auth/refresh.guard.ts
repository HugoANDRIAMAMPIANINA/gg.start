import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Session } from './entities/session.interface';

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const session: Session = this.extractTokensFromHeader(request);
    if (!session) {
      throw new UnauthorizedException(
        'Session Tokens (accessToken and refreshToken) not found',
      );
    }

    request['accessToken'] = session.accessToken;
    request['refreshToken'] = session.refreshToken;
    return true;
  }

  private extractTokensFromHeader(request: Request): Session {
    const cookies: Record<string, string> = request.cookies;
    return {
      accessToken: cookies['accessToken'],
      refreshToken: cookies['refreshToken'],
    };
  }
}

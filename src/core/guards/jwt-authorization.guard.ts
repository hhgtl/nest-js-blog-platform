import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtAdapter } from '../adapters/jwt-adapter';

type JwtPayload = { userId: string };

type RequestWithUser = Request & {
  user?: JwtPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = jwtAdapter.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = { userId: payload.userId };
    return true;
  }
}

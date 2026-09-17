import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RateLimitRepository } from '../infrastructure/rate-limit.repository';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private rateLimitRepository: RateLimitRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = req.ip || 'unknown';
    const url = (req.baseUrl + req.path).replace(/\/$/, '') || '/';

    const recentRequestsCount =
      await this.rateLimitRepository.countByIpAndUrlSince({
        ip,
        url,
        since: new Date(Date.now() - 10 * 1000),
      });

    if (recentRequestsCount >= 5) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.rateLimitRepository.addToRateLimit({
      ip,
      url,
      date: new Date(),
    });

    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RateLimit,
  RateLimitDocument,
  type RateLimitModelType,
} from '../domain/rate-limit.entity';

@Injectable()
export class RateLimitRepository {
  constructor(
    @InjectModel(RateLimit.name) private rateLimitModel: RateLimitModelType,
  ) {}

  async addToRateLimit(newRequest: RateLimit): Promise<RateLimitDocument> {
    return this.rateLimitModel.create(newRequest);
  }

  async countByIpAndUrlSince({
    ip,
    url,
    since,
  }: {
    ip: string;
    url: string;
    since: Date;
  }): Promise<number> {
    return this.rateLimitModel.countDocuments({
      ip,
      url,
      date: { $gt: since },
    });
  }
}

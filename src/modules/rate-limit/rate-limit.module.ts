import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RateLimit, RateLimitSchema } from './domain/rate-limit.entity';
import { RateLimitRepository } from './infrastructure/rate-limit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateLimit.name, schema: RateLimitSchema },
    ]),
  ],
  providers: [RateLimitRepository],
  exports: [RateLimitRepository],
})
export class RateLimitModule {}
